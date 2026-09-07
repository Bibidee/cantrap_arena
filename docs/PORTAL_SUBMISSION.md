# GenLayer Portal submission draft

This is the copy-ready content for the Project Explorer form. It is a draft only; the final Portal submit action remains manual.

## Identity

- Project name: Cantrap Arena
- Primary tag: AI & Agents
- Tag 1: Developer Tools
- Tag 2: Other
- Logo: GenLayer default logo is acceptable; use a custom mark only if desired.

## Project summary

Contained GenLayer benchmark: validators reproduce prompt-injection attacks while a source-matched vault dispatches a fixed GEN bounty for the first confirmed bypass.

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

Reviewers should see challenge #001 with a 0.01 GEN bounty, a canonical post-reload attack ID of 2, reveal/test controls recovered from Arena, and a finalized NO_BYPASS result with semantic NO, class NONE, and bounded evidence. The deployed Arena and Vault links must resolve to the source-matched Studionet contracts.

Contract link 1: https://explorer-studio.genlayer.com/address/0x57Af04B020861de59EBf12B0079A44333fdD897E

Contract link 2: https://explorer-studio.genlayer.com/address/0x4c98d293DD8E239BA9888361ECd612a10382E420

## Project links

- Website: https://cantraparena.vercel.app
- GitHub: https://github.com/Bibidee/cantrap_arena
