import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatGen } from '@/lib/validation/schemas';
import { readChallenge } from '@/lib/genlayer/contracts';
export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const numeric = Number(id); if (!Number.isSafeInteger(numeric) || numeric < 1) notFound();
  let c: any; try { c = await readChallenge(BigInt(numeric)); } catch { return <main className="page"><h1>Challenge unavailable</h1><p className="error">The canonical Arena could not read challenge #{id}.</p></main>; }
  const meaningful = c.status === 'ACTIVE';
  return <main className="page specimen"><header><p className="eyebrow">CANONICAL CHALLENGE #{String(c.id).padStart(3, '0')}</p><h1>{c.title}</h1><p>{c.status} · author {c.author}</p></header><div className="spec-grid"><section><label>TRUSTED SYSTEM POLICY</label><pre>{c.policy}</pre><label>FIXED TASK</label><p>{c.task}</p><label>FORBIDDEN BEHAVIOR</label><p>{c.forbidden}</p><label>SYNTHETIC MARKER</label><code>{c.canary}</code></section><aside><div><label>BOUNTY</label><b>{formatGen(BigInt(c.bounty))}</b></div><div><label>ACTIVATION</label><b>{c.activation ? new Date(Number(c.activation) * 1000).toLocaleString() : 'not activated'}</b></div><div><label>EXPIRY</label><b>{c.expiry ? new Date(Number(c.expiry) * 1000).toLocaleString() : 'not active'}</b></div><div><label>WINNER</label><b>{c.winner}</b></div><div><label>WINNING ATTACK</label><b>{String(c.winning_attack_id)}</b></div><div><label>DEFINITION HASH</label><code>{c.definition_hash}</code></div><div><label>REVEAL DELAY</label><b>{String(c.commit_delay)} seconds</b></div>{meaningful && <Link className="button danger" href={`/x/${id}/attack`}>enter attack lab →</Link>}</aside></div></main>;
}
