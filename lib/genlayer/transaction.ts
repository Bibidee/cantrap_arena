'use client';
import { explorerTx } from './network';
export type TxPhase = 'IDLE'|'AWAITING_SIGNATURE'|'SUBMITTED'|'CONSENSUS_RUNNING'|'CONSENSUS_ACCEPTED'|'FINALIZED_SUCCESS'|'EXECUTION_CONFIRMED'|'USER_REJECTED'|'WRONG_NETWORK'|'CONSENSUS_DISAGREEMENT'|'EXECUTION_ERROR'|'CANONICAL_MISMATCH'|'RPC_ERROR';
export type TxState = { phase: TxPhase; hash?: string; error?: string; result?: unknown };
type RefreshResult = unknown | boolean | { ok: boolean; error?: string };
function executionError(receipt: any): string | undefined {
  const leader = receipt?.consensus_data?.leader_receipt?.[0];
  const execution = leader?.execution_result ?? receipt?.tx_execution_result_name;
  const success = typeof execution === 'string' && /success/i.test(execution);
  if (success) return undefined;
  const detail = leader?.genvm_result?.stderr || leader?.genvm_result?.raw_error || leader?.genvm_result?.error_description || receipt?.error || execution;
  return detail ? String(detail) : 'Finalized without a successful GenVM execution result.';
}
export function classifyReceipt(receipt: any): { ok: boolean; error?: string } { const error = executionError(receipt); return error ? { ok: false, error } : { ok: true }; }
export async function submitAndConfirm(client: any, call: Record<string, unknown>, refresh: () => Promise<RefreshResult>, set: (state: TxState) => void) {
  let hash: string | undefined;
  try {
    set({ phase: 'AWAITING_SIGNATURE' }); hash = await client.writeContract(call); set({ phase: 'SUBMITTED', hash });
    if (typeof window !== 'undefined') localStorage.setItem(`cantrap:tx:${hash}`, JSON.stringify({ hash, submittedAt: Date.now(), functionName: call.functionName }));
    set({ phase: 'CONSENSUS_RUNNING', hash }); const receipt = await client.waitForTransactionReceipt({ hash, status: 'FINALIZED', retries: 220, interval: 5000 });
    const receiptCheck = classifyReceipt(receipt); if (!receiptCheck.ok) { set({ phase: 'EXECUTION_ERROR', hash, error: receiptCheck.error, result: receipt }); return; }
    set({ phase: 'CONSENSUS_ACCEPTED', hash, result: receipt }); const readback = await refresh();
    if (readback === false || (readback && typeof readback === 'object' && 'ok' in readback && readback.ok === false)) { const error = typeof readback === 'object' && readback && 'error' in readback ? String(readback.error) : 'Canonical state did not reflect the expected mutation.'; set({ phase: 'CANONICAL_MISMATCH', hash, error, result: receipt }); return; }
    set({ phase: 'FINALIZED_SUCCESS', hash, result: receipt });
  } catch (e) { const message = e instanceof Error ? e.message : 'RPC or network failure'; set({ phase: /reject|denied|user rejected/i.test(message) ? 'USER_REJECTED' : 'RPC_ERROR', hash, error: message }); }
}
export { explorerTx };
