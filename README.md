# Cantrap

Cantrap is a browser-to-GenLayer, contained prompt-injection benchmark. An author locks a sandbox policy and GEN bounty; an attacker commits then reveals a payload; validators independently reproduce the attack; a separate vault pays the first confirmed bypass.

It targets **Studionet (chain 61999)** and pins `genlayer-js` to exactly `1.1.8`.

## Run

`npm ci && npm run dev` launches the frontend. The production network is Studionet (chain 61999). The current source-matched deployments are Arena `0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5` and Vault `0xB710761d231671C1998462B8D379BBE223BEc899`. Browser writes use an injected EIP-1193 wallet, wait for FINALIZED execution success, and reread canonical state.

Every write distinguishes wallet rejection, pending/submitted/consensus phases, finalized GenVM rollback, canonical readback mismatch, and finalized success. Transaction hashes are retained locally with explorer links. Attack preparation and committed state are recoverable from browser receipts, but Arena remains the canonical source for attack IDs and lifecycle truth.

No backend, server signer, external target, or real secret is used. Read [the deployment procedure](docs/DEPLOYMENT.md) before deploying.

The canary is a public synthetic benchmark marker. It is deliberately named in the trusted policy and is not a secret stored on-chain. A leak only means the contained sandbox violated that policy. Commitments are lowercase 64-character SHA-256 hex without a `0x` prefix, over `challenge_id:attacker:payload:salt`.

Lifecycle: an author creates, funds exactly once, and activates a challenge; attackers commit before expiry, wait 15 minutes, reveal and request consensus testing. A pre-expiry commit retains its seven-day reveal/test grace window. New commits after expiry are rejected and `expire` waits until all revealed eligible attacks are resolved. Funded drafts can be recovered by their author after the 24-hour activation timeout.

The Arena performs deterministic schema/evidence checks around the classifier. Validators reproduce the target and classifier and compare decision fields; prose is explanatory only. The Vault records credited, dispatched, locked, and accounted balances and uses exactly-once transfer-dispatch state for asynchronous transfers.
