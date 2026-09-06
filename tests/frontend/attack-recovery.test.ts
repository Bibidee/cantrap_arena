import { describe, expect, it } from 'vitest';
import { canonicalAttackId, localAttackKey } from '@/lib/genlayer/attack-recovery';

describe('canonical attack recovery', () => {
  it('never treats local or malformed values as a valid attack id', () => {
    expect(canonicalAttackId(0)).toBe('0');
    expect(canonicalAttackId('not-a-number')).toBe('0');
    expect(canonicalAttackId('17')).toBe('17');
  });
  it('uses the same wallet-scoped receipt key after reload', () => {
    expect(localAttackKey('9', '0xAbC')).toBe('cantrap:attack:9:0xabc');
  });
});
