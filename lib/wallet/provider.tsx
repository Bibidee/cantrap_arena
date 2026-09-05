'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { isStudionet, STUDIONET } from '@/lib/genlayer/network';

type Eip1193 = { request(args: { method: string; params?: unknown[] }): Promise<unknown>; on(event: string, cb: (...args: any[]) => void): void; removeListener(event: string, cb: (...args: any[]) => void): void };
type Wallet = { account?: `0x${string}`; chainId?: string; connecting: boolean; error?: string; connected: boolean; connect(): Promise<void>; disconnect(): void; switchNetwork(): Promise<void>; client?: ReturnType<typeof createClient> };
const WalletContext = createContext<Wallet | null>(null);
export function WalletProvider({ children }: { children: React.ReactNode }) {
 const [account,setAccount]=useState<`0x${string}` | undefined>(); const [chainId,setChainId]=useState<string>(); const [connecting,setConnecting]=useState(false); const [error,setError]=useState<string>();
 const provider = typeof window === 'undefined' ? undefined : (window as Window & { ethereum?: Eip1193 }).ethereum;
 const sync = async () => { if (!provider) return; const accounts = await provider.request({method:'eth_accounts'}) as string[]; setAccount(accounts[0] as `0x${string}` | undefined); setChainId(await provider.request({method:'eth_chainId'}) as string); };
 useEffect(()=>{ void sync(); if(!provider)return; const accounts=(a:string[])=>setAccount(a[0] as `0x${string}`|undefined); const chain=(c:string)=>setChainId(c); const disconnect=()=>setAccount(undefined); provider.on('accountsChanged',accounts); provider.on('chainChanged',chain); provider.on('disconnect',disconnect); return()=>{provider.removeListener('accountsChanged',accounts);provider.removeListener('chainChanged',chain);provider.removeListener('disconnect',disconnect)}},[provider]);
 const connect=async()=>{ if(!provider){setError('No injected wallet found. Install or unlock a Studionet-compatible wallet.');return} setConnecting(true);setError(undefined);try{await provider.request({method:'eth_requestAccounts'});await sync()}catch(e){setError(e instanceof Error?e.message:'Wallet connection was rejected.')}finally{setConnecting(false)}};
 const switchNetwork=async()=>{if(!provider)return;try{await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:`0x${STUDIONET.id.toString(16)}`}]});await sync()}catch(e){setError(e instanceof Error?e.message:'Could not switch network.')}};
 const client = provider && account ? createClient({chain:studionet,account,provider}) : undefined;
 return <WalletContext.Provider value={{account,chainId,connecting,error,connected:!!account,connect,disconnect:()=>setAccount(undefined),switchNetwork,client}}>{children}</WalletContext.Provider>;
}
export function useWallet(){const value=useContext(WalletContext);if(!value)throw new Error('WalletProvider missing');return {...value, onStudionet:isStudionet(value.chainId)}}
