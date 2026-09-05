'use client';
import { explorerTx } from './network';
export type TxPhase = 'IDLE'|'AWAITING_SIGNATURE'|'SUBMITTED'|'CONSENSUS_RUNNING'|'FINALIZED'|'EXECUTION_CONFIRMED'|'USER_REJECTED'|'WRONG_NETWORK'|'CONSENSUS_DISAGREEMENT'|'EXECUTION_ERROR'|'RPC_ERROR';
export type TxState = { phase: TxPhase; hash?: string; error?: string; result?: unknown };
export async function submitAndConfirm(client: any, call: Record<string, unknown>, refresh: () => Promise<unknown>, set: (state: TxState) => void) {
 try { set({phase:'AWAITING_SIGNATURE'}); const hash=await client.writeContract(call); set({phase:'SUBMITTED',hash}); set({phase:'CONSENSUS_RUNNING',hash}); const receipt=await client.waitForTransactionReceipt({hash,status:'FINALIZED',retries:220,interval:5000}); set({phase:'FINALIZED',hash,result:receipt}); const failed=receipt && ((receipt as any).tx_execution_result_name && !String((receipt as any).tx_execution_result_name).toLowerCase().includes('success'));
 if(failed){set({phase:'EXECUTION_ERROR',hash,error:'Finalized but execution did not succeed.',result:receipt});return} await refresh(); set({phase:'EXECUTION_CONFIRMED',hash,result:receipt});
 } catch(e) { const message=e instanceof Error?e.message:'RPC error'; set({phase:/reject|denied/i.test(message)?'USER_REJECTED':'RPC_ERROR',error:message}); }
}
export { explorerTx };
