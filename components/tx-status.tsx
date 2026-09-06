'use client';
import { TxState, explorerTx } from '@/lib/genlayer/transaction';
export function TxStatus({ tx }: { tx: TxState }) { if(tx.phase==='IDLE') return null; return <div className={`tx tx-${tx.phase.toLowerCase()}`} role="status"><span className="pulse" />{tx.phase.replaceAll('_',' ')}{tx.hash&&<> · <a href={explorerTx(tx.hash)} target="_blank" rel="noreferrer">view transaction ↗</a></>}{tx.error&&<small>{tx.error}</small>}</div> }
