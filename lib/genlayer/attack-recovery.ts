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
