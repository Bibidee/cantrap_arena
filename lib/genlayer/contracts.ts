import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { STUDIONET } from './network';

export const publicClient = createClient({ chain: studionet });
export const addresses = { arena: process.env.NEXT_PUBLIC_ARENA_ADDRESS as `0x${string}`, vault: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}` };
export type Challenge = { id: bigint; author: string; title: string; task: string; policy: string; forbidden: string; bounty: bigint; activation: bigint; expiry: bigint; status: string; winner: string; winningAttackId: bigint; definitionHash: string };
export async function readChallenge(id: bigint): Promise<Challenge> { return publicClient.readContract({ address: addresses.arena, functionName: 'get_challenge', args: [id] }) as Promise<Challenge>; }
export function assertConfigured() { if (!addresses.arena || /^0x0{40}$/.test(addresses.arena)) throw new Error('Arena address is not configured. Deploy to Studionet and set NEXT_PUBLIC_ARENA_ADDRESS.'); }
export { STUDIONET };
