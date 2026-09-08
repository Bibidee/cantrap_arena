# Cantrap Arena — Additional Hardening Evidence

This document provides the additional hardening evidence requested before acceptance of Cantrap Arena.

## Reviewer request

> Hardening evidence before acceptance. Authorize or atomically initialize Vault binding, replace the global attack scan with per-challenge pending-attack tracking, and provide GenVM-level tests covering BYPASS → Vault dispatch, malicious classifier/evidence behavior, failed cross-contract calls, and expiry under attack accumulation.

## Fulfillment status

**Status: FULLY FULFILLED**

All requested implementation and GenVM-level evidence requirements are present in the repository and exercised by the contract test suite.

### 1. Authorized Vault binding

Arena Vault binding is deployer-authorized, one-time, non-zero, and challenge creation is blocked until a Vault has been bound. This prevents arbitrary callers from redirecting Arena to an unauthorized Vault after deployment.

### 2. Per-challenge pending-attack tracking

The previous global attack scan was replaced with `pending_attacks` scoped by challenge. Expiry checks now inspect only the pending attacks belonging to the challenge being expired rather than iterating over the complete global attack history. Tested attacks are removed from the pending set.

### 3. GenVM-level BYPASS → Vault dispatch

Direct GenVM execution coverage is implemented in:

`tests/contract/test_genvm_execution.py`

Primary test:

`test_genvm_bypass_to_vault_dispatch_and_exact_once`

The test executes the Arena adjudication path with deterministic GenVM LLM mocks and proves:

- a supported attack resolves to `BYPASS`;
- the challenge becomes `BROKEN`;
- the canonical winner is the attacker;
- the canonical winning attack ID is recorded;
- the Vault dispatches the funded bounty to the canonical winner;
- the dispatch amount is exact;
- transfer kind is `BOUNTY`;
- Vault state becomes `TRANSFER_DISPATCHED`;
- a duplicate payout attempt is rejected;
- accounting remains coherent after dispatch.

### 4. Malicious classifier and evidence behavior

GenVM execution tests cover adversarial classifier/evidence cases including:

- malformed classifier output;
- invalid result enums;
- invalid semantic enums;
- invalid violation classes;
- semantic mismatch on a claimed BYPASS;
- unsupported BYPASS classes;
- empty evidence;
- invented evidence not present in target output;
- oversized evidence/reason values;
- prompt-injected target output attempting to influence adjudication;
- claimed secret leak without the required canary support;
- a valid supported BYPASS control case.

Invalid or unsupported cases are prevented from becoming a canonical `BYPASS`.

### 5. Failed cross-contract calls

GenVM execution coverage includes:

- unauthorized Vault binding rejection;
- duplicate Vault binding rejection;
- failed Arena funding notification behavior;
- retry/idempotent recovery;
- failed Vault child notification behavior;
- preservation of funded Vault accounting through failure and retry.

These tests verify that cross-contract failure does not silently corrupt canonical Arena/Vault state or produce duplicate accounting.

### 6. Expiry under attack accumulation

GenVM execution tests exercise:

- two pending attacks on the same challenge;
- one pending attack on an unrelated challenge;
- challenge-local pending-attack partitioning;
- expiry after the relevant attack windows have elapsed;
- unrelated challenge attacks not affecting the challenge being expired.

This provides execution evidence that expiry no longer depends on a global attack scan.

## Contract / GenVM validation

Final remote contract validation on GitHub Actions:

- Python: `3.12`
- `genlayer-test`: `0.29.2`
- Python contract compilation: **PASS**
- Contract / GenVM tests: **40 passed / 0 failed**

The direct GenVM integration suite includes 14 execution tests in `tests/contract/test_genvm_execution.py`.

## Frontend validation

Remote GitHub Actions validation also confirms:

- Frontend tests: **22 passed / 0 failed**
- Typecheck: **PASS**
- Lint: **PASS**
- Production build: **PASS**
- Production npm audit: **0 vulnerabilities**

## Current source-matched Studionet deployment

Network: **Studionet**  
Chain ID: **61999**

### Arena

Address:

`0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5`

Explorer:

https://explorer-studio.genlayer.com/address/0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5

Deployment transaction:

`0xf2b73085192ac8775f3cfea1f9e9ba09f509b3168d25940f4546470bce241009`

Source SHA-256:

`5BBD1F0D9F53E7FAA89624B371464034D1446AAC46D0A91DFB07CAD7C4395E7F`

Deployment status: **FINALIZED / SUCCESS**

### Vault

Address:

`0xB710761d231671C1998462B8D379BBE223BEc899`

Explorer:

https://explorer-studio.genlayer.com/address/0xB710761d231671C1998462B8D379BBE223BEc899

Deployment transaction:

`0xd00ae6fe426b70516a0adaadd2e9f9224833bf023f561feb9ec8b833af70fe2f`

Source SHA-256:

`85D7B8B8BA6908A4250CEABBB2FC9BFBF365EA27F5F7D7A638BFBFD7E57D9CC1`

Deployment status: **FINALIZED / SUCCESS**

### Arena ↔ Vault binding

Binding transaction:

`0xb9484d5248b649b7e8de5c8af002ba15307bbe8f3d1d83927253ec1506445cbf`

Status: **FINALIZED / SUCCESS**

The deployed Arena and Vault source hashes exactly match the corresponding contract source used for this release.

## Fresh live Studionet lifecycle

A fresh live lifecycle was completed against the source-matched deployment:

`create → fund 0.01 GEN → activate → commit → wait 900 seconds → reveal → test → canonical readback`

Recorded lifecycle:

- Challenge ID: `1`
- Attack ID: `1`
- Bounty: `0.01 GEN`
- Attack revealed: `true`
- Attack tested: `true`
- Result: `NO_BYPASS`
- Semantic: `NO`
- Class: `NONE`
- Challenge remains `ACTIVE`
- Vault remains `FUNDED`

The live lifecycle did not dispatch a payout because the canonical live result was `NO_BYPASS`. No live result was forced or fabricated.

The requested **BYPASS → Vault dispatch** branch is instead proven through the direct GenVM integration test described above.

## GitHub verification

Hardening implementation commit:

`41edf181b2df48eabb3d953a8e309fa92159d738`

Verified release HEAD before this documentation-only addition:

`d38a22d33baaddc772dab551a12965c7a310469b`

GitHub Actions run:

`34237531889`

Result: **SUCCESS**

Both `web` and `contracts` jobs completed successfully on that release HEAD.

## Acceptance summary

The requested hardening is complete:

| Requirement | Status |
| --- | --- |
| Authorized / atomic Vault binding | ✅ Fulfilled |
| Per-challenge pending-attack tracking | ✅ Fulfilled |
| GenVM BYPASS → Vault dispatch | ✅ Fulfilled |
| GenVM malicious classifier/evidence behavior | ✅ Fulfilled |
| GenVM failed cross-contract calls | ✅ Fulfilled |
| GenVM expiry under attack accumulation | ✅ Fulfilled |

**Critical issues remaining:** None  
**High issues remaining:** None  
**Medium blockers remaining:** None

The only recorded limitation is that the fresh live Studionet lifecycle produced `NO_BYPASS`, so a live payout dispatch was not eligible. The requested payout branch is covered by GenVM execution evidence.
