# Deployment — Studionet only

Network: Studionet; chain ID `61999`; RPC `https://studio.genlayer.com/api`; explorer `https://explorer-studio.genlayer.com`.

The contract source commit is `1cf7f6a`. Arena SHA-256 is `36D42B0B24DC4F8572DD83939B775E0F086EE1BAEEC1DD64FA83AC4D130C8ABD`; Vault SHA-256 is `63FB9CC78F89E42E3085B972668333CD371AF09B76E8F2C207471F8EF0DD8CC0`. Both schemas were generated successfully before deployment.

## Current source-matched deployment

- Arena: `0xf686419939E13cBC7CDfA9657741c46FE0Fa213B`; deployment tx `0x9c6036739432813105b39309c41ab2174f9238821b304170e26a2ce5f7c2bf93`; `FINALIZED` / `SUCCESS`.
- Vault: `0x728A33026730d1B04E2D698Cd4aD90541FE27D94`; deployment tx `0x8e0ab02ae47d2f276cc6e03f0253848183d1f2b68f9791613b8d8a96553665ef`; `FINALIZED` / `SUCCESS`.
- Binding: tx `0x42ccc600eaf66ae6a4019c573085875a37833ed6eb0aa52379e10e7dc429d82f`; `FINALIZED` / `SUCCESS`.

## Fresh lifecycle evidence

Challenge `1` was created, funded with exactly `0.1 GEN`, synchronized through the retry path, activated, committed, delayed for the full 900 seconds, revealed, tested, and read back canonically. The final verdict was `NO_BYPASS`; no payout was eligible. Exact transaction records and readback are in `artifacts/live-lifecycle.json`.

Expiry model tests verify that both revealed and unrevealed pre-expiry commitments block `expire()` during the maximum reveal window, while tested attacks and elapsed windows no longer block it.

Vault transfers are modeled as exactly-once `TRANSFER_DISPATCHED` state transitions. GenLayer external value transfers are asynchronous; recipient-side settlement is external evidence and is never represented as synchronous `PAID` state. This lifecycle did not create an eligible transfer-dispatch case.

The frontend production deployment is `https://cantraparena.vercel.app`. Vercel deployment identifiers and current environment configuration are managed by the linked `bibidees-projects/cantrap_arena` project. Vercel normalizes the requested underscore project name into the public alias `cantraparena.vercel.app`.
