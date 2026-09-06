export type VaultLike = { state: string; funded_at: bigint | number; amount?: bigint | string; recipient?: string; transfer_kind?: string; dispatched_at?: bigint | number };
const same = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();
export function canClaimBounty(challenge: any, vault: VaultLike, account?: string) { return challenge.status === 'BROKEN' && vault.state === 'FUNDED' && same(account, challenge.winner); }
export function canRefundExpired(challenge: any, vault: VaultLike, account?: string) { return challenge.status === 'EXPIRED' && vault.state === 'FUNDED' && same(account, challenge.author); }
export function canRefundUnactivated(challenge: any, vault: VaultLike, account?: string, now = Math.floor(Date.now()/1000)) { return challenge.status === 'FUNDED' && vault.state === 'FUNDED' && same(account, challenge.author) && now >= Number(vault.funded_at) + Number(challenge.activation_timeout || 86400); }
export function localReceiptKey(key: string) { const match = key.match(/^cantrap:([^:]+):([0-9a-f]{64})$/); return match ? { challengeId: match[1], commitment: match[2] } : null; }
