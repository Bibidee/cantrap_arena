'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { isStudionet, STUDIONET } from '@/lib/genlayer/network';

type Eip1193Error = Error & { code?: number };
export type Eip1193 = { request(args: { method: string; params?: unknown[] }): Promise<unknown>; on(event: string, cb: (...args: any[]) => void): void; removeListener(event: string, cb: (...args: any[]) => void): void };
type Wallet = { account?: `0x${string}`; chainId?: string; connecting: boolean; error?: string; connected: boolean; connect(): Promise<void>; disconnect(): void; switchNetwork(): Promise<void>; client?: ReturnType<typeof createClient> };
const WalletContext = createContext<Wallet | null>(null);
const STUDIONET_CHAIN_ID = `0x${STUDIONET.id.toString(16)}`;

/** Switch to Studionet, adding the chain to wallets that do not know it yet. */
export async function ensureStudionetNetwork(provider: Eip1193): Promise<void> {
 try {
  await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: STUDIONET_CHAIN_ID }] });
 } catch (error) {
  const walletError = error as Eip1193Error;
  if (walletError.code !== 4902) throw error;
  await provider.request({ method: 'wallet_addEthereumChain', params: [{
   chainId: STUDIONET_CHAIN_ID,
   chainName: STUDIONET.name,
   nativeCurrency: { name: STUDIONET.currency, symbol: STUDIONET.currency, decimals: STUDIONET.decimals },
   rpcUrls: [STUDIONET.rpcUrl],
   blockExplorerUrls: [STUDIONET.explorer],
  }] });
  await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: STUDIONET_CHAIN_ID }] });
 }
}
export function WalletProvider({ children }: { children: React.ReactNode }) {
 const [account,setAccount]=useState<`0x${string}` | undefined>(); const [chainId,setChainId]=useState<string>(); const [connecting,setConnecting]=useState(false); const [error,setError]=useState<string>();
 const provider = typeof window === 'undefined' ? undefined : (window as Window & { ethereum?: Eip1193 }).ethereum;
 const sync = async () => { if (!provider) return; const accounts = await provider.request({method:'eth_accounts'}) as string[]; setAccount(accounts[0] as `0x${string}` | undefined); setChainId(await provider.request({method:'eth_chainId'}) as string); };
 useEffect(()=>{ void sync(); if(!provider)return; const accounts=(a:string[])=>setAccount(a[0] as `0x${string}`|undefined); const chain=(c:string)=>setChainId(c); const disconnect=()=>setAccount(undefined); provider.on('accountsChanged',accounts); provider.on('chainChanged',chain); provider.on('disconnect',disconnect); return()=>{provider.removeListener('accountsChanged',accounts);provider.removeListener('chainChanged',chain);provider.removeListener('disconnect',disconnect)}},[provider]);
 const connect=async()=>{ if(!provider){setError('No injected wallet found. Install or unlock a Studionet-compatible wallet.');return} setConnecting(true);setError(undefined);try{await provider.request({method:'eth_requestAccounts'});await ensureStudionetNetwork(provider);await sync()}catch(e){setError(e instanceof Error?e.message:'Wallet connection or Studionet network switch was rejected.')}finally{setConnecting(false)}};
 const switchNetwork=async()=>{if(!provider)return;try{await ensureStudionetNetwork(provider);await sync()}catch(e){setError(e instanceof Error?e.message:'Could not add or switch to Studionet.')}};
 const client = provider && account ? createClient({chain:studionet,account,provider}) : undefined;
 return <WalletContext.Provider value={{account,chainId,connecting,error,connected:!!account,connect,disconnect:()=>setAccount(undefined),switchNetwork,client}}>{children}</WalletContext.Provider>;
}
export function useWallet(){const value=useContext(WalletContext);if(!value)throw new Error('WalletProvider missing');return {...value, onStudionet:isStudionet(value.chainId)}}
