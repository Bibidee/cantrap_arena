export type LocalAttackReceipt = {
  challengeId: string;
  attackId?: string | number;
  payload?: string;
  salt?: string;
  commitment?: string;
  attacker?: string;
  stage?: 'prepared' | 'committed' | 'revealed' | 'tested';
  updatedAt?: number;
};

export type CanonicalAttack = { id: string; challengeId: string; attacker: string; revealed: boolean; tested: boolean; result?: string; raw: unknown };

export function canonicalAttackId(value: unknown): string {
  try {
    const id = BigInt(String(value));
    return id > 0n ? id.toString() : '0';
  } catch {
    return '0';
  }
}

export function localAttackKey(challengeId: string, account: string): string {
  return `cantrap:attack:${challengeId}:${account.toLowerCase()}`;
}

export function parseLocalAttackReceipt(raw: string | null): LocalAttackReceipt | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    return value && typeof value === 'object' && typeof value.challengeId === 'string' ? value as LocalAttackReceipt : null;
  } catch { return null; }
}

function field(value: unknown, name: string, index: number): unknown {
  if (Array.isArray(value)) return value[index];
  if (value && typeof value === 'object') return (value as Record<string, unknown>)[name];
  return undefined;
}

export function normalizeCanonicalAttack(value: unknown, fallbackId: string): CanonicalAttack | null {
  const id = canonicalAttackId(field(value, 'id', 0) ?? fallbackId);
  const challengeId = canonicalAttackId(field(value, 'challenge_id', 1));
  const attacker = String(field(value, 'attacker', 2) ?? '');
  if (id === '0' || challengeId === '0' || !attacker) return null;
  const result = field(value, 'result', 8);
  return { id, challengeId, attacker, revealed: field(value, 'revealed', 6) === true, tested: field(value, 'tested', 7) === true, result: typeof result === 'string' ? result : undefined, raw: value };
}

export async function verifyCanonicalAttack(attackId: string, challengeId: string, account: string, readAttack: (id: string) => Promise<unknown>): Promise<CanonicalAttack | null> {
  const positiveId = canonicalAttackId(attackId);
  if (positiveId === '0') return null;
  try {
    const attack = normalizeCanonicalAttack(await readAttack(positiveId), positiveId);
    if (!attack || attack.id !== positiveId || attack.challengeId !== canonicalAttackId(challengeId) || attack.attacker.toLowerCase() !== account.toLowerCase()) return null;
    return attack;
  } catch { return null; }
}

export async function recoverCanonicalAttack(input: { challengeId: string; account: string; receipt: LocalAttackReceipt | null; readActive: () => Promise<unknown>; readAttack: (id: string) => Promise<unknown> }): Promise<{ attackId: string; attack: CanonicalAttack | null }> {
  try {
    const active = await verifyCanonicalAttack(canonicalAttackId(await input.readActive()), input.challengeId, input.account, input.readAttack);
    if (active) return { attackId: active.id, attack: active };
  } catch { /* fall through to the verified local receipt */ }
  const saved = await verifyCanonicalAttack(canonicalAttackId(input.receipt?.attackId), input.challengeId, input.account, input.readAttack);
  return saved ? { attackId: saved.id, attack: saved } : { attackId: '0', attack: null };
}
