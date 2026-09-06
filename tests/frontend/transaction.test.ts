import { describe, expect, it } from 'vitest';
import { classifyReceipt } from '@/lib/genlayer/transaction';
describe('GenLayer receipt safety', () => {
  it('rejects finalized receipts with GenVM errors', () => expect(classifyReceipt({ status_name:'FINALIZED', consensus_data:{leader_receipt:[{execution_result:'ERROR',genvm_result:{stderr:'outside reveal window'}}]} })).toEqual({ok:false,error:'outside reveal window'}));
  it('accepts only successful execution results', () => expect(classifyReceipt({ status_name:'FINALIZED', consensus_data:{leader_receipt:[{execution_result:'SUCCESS'}]} })).toEqual({ok:true}));
  it('extracts rollback details', () => expect(classifyReceipt({ consensus_data:{leader_receipt:[{execution_result:'ROLLBACK',genvm_result:{error_description:'unauthorized caller'}}]} })).toEqual({ok:false,error:'unauthorized caller'}));
});
