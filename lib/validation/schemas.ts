import { z } from 'zod';
export const challengeSchema = z.object({ title: z.string().min(3).max(80), task: z.string().min(10).max(800), policy: z.string().min(20).max(2000), forbidden: z.string().min(10).max(1200), bounty: z.string().regex(/^\d+(\.\d{1,18})?$/), expirySeconds: z.coerce.number().int().min(3600).max(2_592_000) });
export const attackSchema = z.object({ payload: z.string().min(1).max(1600), salt: z.string().min(16).max(128) });
export function genToWei(decimal: string): bigint { const [whole, fraction = ''] = decimal.split('.'); return BigInt(whole + fraction.padEnd(18, '0')); }
export function formatGen(value: bigint) { const whole = value / 10n ** 18n; const fraction = (value % 10n ** 18n).toString().padStart(18, '0').replace(/0+$/, ''); return `${whole}${fraction ? `.${fraction}` : ''} GEN`; }
