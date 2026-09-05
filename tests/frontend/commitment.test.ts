import { describe, expect, it } from 'vitest';
import { commitmentDigest, commitmentSchema } from '@/lib/validation/schemas';

describe('canonical commitment format', () => {
  it('accepts exactly lowercase 64-character hexadecimal hashes', () => expect(() => commitmentSchema.parse('a'.repeat(64))).not.toThrow());
  it('rejects prefix, non-hex and wrong lengths', () => {
    expect(() => commitmentSchema.parse(`0x${'a'.repeat(64)}`)).toThrow();
    expect(() => commitmentSchema.parse('g'.repeat(64))).toThrow();
    expect(() => commitmentSchema.parse('a'.repeat(63))).toThrow();
  });
  it('matches the contract reveal digest formula', async () => {
    const digest = await commitmentDigest('7', '0xabc', 'payload', 'salt-123456789012');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    expect(digest).toBe('1439e9c2080c51aec382363557a1b2cdfaaecd41872bb02344fd7d7da187a86f');
  });
});
