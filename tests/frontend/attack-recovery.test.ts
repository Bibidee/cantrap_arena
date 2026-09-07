import { describe, expect, it } from 'vitest';
import { canonicalAttackId, localAttackKey, parseLocalAttackReceipt, recoverCanonicalAttack } from '@/lib/genlayer/attack-recovery';

const attack = (id: string, challengeId = '9', attacker = '0xabc', revealed = false, tested = false, result = 'NO_BYPASS') => ({ id: BigInt(id), challenge_id: BigInt(challengeId), attacker, revealed, tested, result });

describe('canonical attack recovery', () => {
  it('never treats local or malformed values as a valid attack id', () => {
    expect(canonicalAttackId(0)).toBe('0');
    expect(canonicalAttackId('not-a-number')).toBe('0');
    expect(canonicalAttackId('17')).toBe('17');
  });
  it('uses the same wallet-scoped receipt key after reload', () => {
    expect(localAttackKey('9', '0xAbC')).toBe('cantrap:attack:9:0xabc');
  });
  it('recovers a committed active attack after reload', async () => {
    const result = await recoverCanonicalAttack({ challengeId: '9', account: '0xAbC', receipt: { challengeId: '9', attackId: '17' }, readActive: async () => 17n, readAttack: async () => attack('17') });
    expect(result.attackId).toBe('17');
    expect(result.attack?.revealed).toBe(false);
  });
  it('recovers a revealed attack after reload when active mapping is cleared', async () => {
    const result = await recoverCanonicalAttack({ challengeId: '9', account: '0xAbC', receipt: { challengeId: '9', attackId: '17', stage: 'revealed' }, readActive: async () => 0n, readAttack: async () => attack('17', '9', '0xabc', true, false) });
    expect(result.attackId).toBe('17');
    expect(result.attack?.revealed).toBe(true);
    expect(result.attack?.tested).toBe(false);
  });
  it('recovers tested attacks and preserves their result', async () => {
    const result = await recoverCanonicalAttack({ challengeId: '9', account: '0xAbC', receipt: { challengeId: '9', attackId: '17' }, readActive: async () => 0n, readAttack: async () => attack('17', '9', '0xabc', true, true, 'BYPASS') });
    expect(result.attackId).toBe('17');
    expect(result.attack?.tested).toBe(true);
    expect(result.attack?.result).toBe('BYPASS');
  });
  it('rejects malformed, cross-challenge, cross-wallet, and missing saved IDs', async () => {
    expect(parseLocalAttackReceipt('{bad')).toBeNull();
    for (const attackId of ['abc', '-1', '0']) {
      const result = await recoverCanonicalAttack({ challengeId: '9', account: '0xabc', receipt: { challengeId: '9', attackId }, readActive: async () => 0n, readAttack: async () => attack('1') });
      expect(result.attackId).toBe('0');
    }
    const otherChallenge = await recoverCanonicalAttack({ challengeId: '9', account: '0xabc', receipt: { challengeId: '9', attackId: '17' }, readActive: async () => 0n, readAttack: async () => attack('17', '10') });
    expect(otherChallenge.attackId).toBe('0');
    const otherWallet = await recoverCanonicalAttack({ challengeId: '9', account: '0xabc', receipt: { challengeId: '9', attackId: '17' }, readActive: async () => 0n, readAttack: async () => attack('17', '9', '0xdef') });
    expect(otherWallet.attackId).toBe('0');
  });
});
