# GenLayer Portal submission draft

This is a draft for the Project Explorer form. The links below point to the current source-matched Studionet deployments.

## Identity

- Project name: Cantrap Arena
- Primary tag: AI & Agents
- Tag 1: Developer Tools
- Tag 2: Other
- Logo: GenLayer default logo is acceptable; use a custom mark only if desired.

## Project summary

Contained GenLayer benchmark: validators reproduce prompt-injection attacks while a vault dispatches a fixed GEN bounty for the first confirmed bypass.

## Description

Cantrap Arena is a contained adversarial benchmark for prompt-injection resilience. Authors publish a fixed task, trusted policy, forbidden behavior, synthetic public canary, expiry, and GEN bounty on GenLayer. Attackers commit a payload hash, wait the protocol delay, reveal the payload and salt, and request a consensus test. Independent GenLayer validators reproduce the target execution and an isolated adjudicator returns strict BYPASS, NO_BYPASS, or INCONCLUSIVE results with bounded evidence. Arena stores the canonical challenge and attack result; a separate Vault escrows the exact bounty and permits only the canonical winner to dispatch it. The benchmark uses synthetic markers only: no credentials, private secrets, third-party targeting, or arbitrary code execution.

## Demo video

Optional. Leave blank unless a hosted walkthrough is available.

## How-to

Heading: Reproduce the benchmark

1. Open the challenge wall and select challenge #001.
2. Connect an injected wallet on Studionet (chain 61999).
3. Open Attack Lab, enter a payload, generate the commitment, and commit.
4. Wait the 900-second reveal delay, then reveal and run the consensus test.
5. Refresh the page; the canonical attack ID is recovered from Arena and the final result is read back from chain.

## Review verification

Reviewers should see challenge 1 with a canonical post-reload attack ID, recovered reveal/test controls, and a finalized adjudication result.

Contract link 1: https://explorer-studio.genlayer.com/address/0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5

Contract link 2: https://explorer-studio.genlayer.com/address/0xB710761d231671C1998462B8D379BBE223BEc899

## Project links

- Website: https://cantraparena.vercel.app
- GitHub: https://github.com/Bibidee/cantrap_arena
