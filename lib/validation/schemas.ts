import { z } from 'zod';
export const challengeSchema = z.object({ title: z.string().min(3).max(80), task: z.string().min(10).max(800), policy: z.string().min(20).max(2000), forbidden: z.string().min(10).max(1200), bounty: z.string().regex(/^\d+(\.\d{1,18})?$/), expirySeconds: z.coerce.number().int().min(3600).max(2_592_000) });
export const attackSchema = z.object({ payload: z.string().min(1).max(1600), salt: z.string().min(16).max(128) });
export const commitmentSchema = z.string().regex(/^[0-9a-f]{64}$/, 'commitment must be lowercase 64-character hex');
export async function commitmentDigest(challengeId: string, attacker: string, payload: string, salt: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${challengeId}:${attacker}:${payload}:${salt}`));
  return Array.from(new Uint8Array(bytes)).map((value) => value.toString(16).padStart(2, '0')).join('');
}
export function genToWei(decimal: string): bigint { const [whole, fraction = ''] = decimal.split('.'); return BigInt(whole + fraction.padEnd(18, '0')); }
export function formatGen(value: bigint) { const whole = value / 10n ** 18n; const fraction = (value % 10n ** 18n).toString().padStart(18, '0').replace(/0+$/, ''); return `${whole}${fraction ? `.${fraction}` : ''} GEN`; }
