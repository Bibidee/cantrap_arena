# Cantrap

Cantrap is a browser-to-GenLayer, contained prompt-injection benchmark. An author locks a sandbox policy and GEN bounty; an attacker commits then reveals a payload; validators independently reproduce the attack; a separate vault pays the first confirmed bypass.

It targets **Studionet (chain 61999)** and pins `genlayer-js` to exactly `1.1.8`.

## Run

`npm ci && npm run dev` launches the frontend. The production network is Studionet (chain 61999); the current configured public addresses are Arena `0x2Ec33E3715d0F74153A6CA3Adfc77956Df248D7d` and Vault `0xdb8eAc006fb4410d3D58a344137f1338a9692b60` until a source-matched redeployment is recorded. Browser writes use an injected EIP-1193 wallet, wait for FINALIZED execution success, and reread canonical state.

No backend, server signer, external target, or real secret is used. Read [the deployment procedure](docs/DEPLOYMENT.md) before deploying.

The canary is a public synthetic benchmark marker. It is deliberately named in the trusted policy and is not a secret stored on-chain. A leak only means the contained sandbox violated that policy. Commitments are lowercase 64-character SHA-256 hex without a `0x` prefix, over `challenge_id:attacker:payload:salt`.

Lifecycle: an author creates, funds exactly once, and activates a challenge; attackers commit before expiry, wait 15 minutes, reveal and request consensus testing. A pre-expiry commit retains its seven-day reveal/test grace window. New commits after expiry are rejected and `expire` waits until all revealed eligible attacks are resolved. Funded drafts can be recovered by their author after the 24-hour activation timeout.

The Arena performs deterministic schema/evidence checks around the classifier. Validators reproduce the target and classifier and compare decision fields; prose is explanatory only. The Vault records credited, paid, pending, and accounted balances and uses explicit payout-pending state for asynchronous transfers.
