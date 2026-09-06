export async function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> { return await Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('RPC request timed out')), ms))]); }
export function isRecord(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object'; }
