# Cantrap

Cantrap is a browser-to-GenLayer, contained prompt-injection benchmark. An author locks a sandbox policy and GEN bounty; an attacker commits then reveals a payload; validators independently reproduce the attack; a separate vault pays the first confirmed bypass.

It targets **Studionet (chain 61999)** and pins `genlayer-js` to exactly `1.1.8`.

## Run

`npm install && npm run dev` launches the frontend. Set deployed public addresses in `.env.local` only after deployment. Browser writes use the injected EIP-1193 wallet, estimate fees, wait for finalization, inspect execution, and reread contract state.

No backend, server signer, external target, or real secret is used. Read [the deployment procedure](docs/DEPLOYMENT.md) before deploying.
