# Deployment — Studionet only

Network: Studionet; chain ID `61999`; RPC `https://studio.genlayer.com/api`; explorer `https://explorer-studio.genlayer.com`.

The changed Arena source SHA-256 is `B5B699EC75BF6B69604A2C7D054AECDF1C7955D779A21107E989F221ECA94E7A`; Vault SHA-256 is `63FB9CC78F89E42E3085B972668333CD371AF09B76E8F2C207471F8EF0DD8CC0`. Both schemas were generated successfully before deployment.

## Current source-matched deployment

- Arena: `0x57Af04B020861de59EBf12B0079A44333fdD897E`; deployment tx `0xaa4e635ad1c90756466c7b169984f6182e2dbddf5479e84878c95f453eed03b3`; `FINALIZED` / `SUCCESS`.
- Vault: `0x4c98d293DD8E239BA9888361ECd612a10382E420`; deployment tx `0x3c7f38f921fbe9942c8a26512d130aa7fefea8a3aa734de5569dabe0a3822702`; `FINALIZED` / `SUCCESS`.
- Binding: tx `0x79f0a0de5b87fbbea8158ac3b5c038ecbc929ca6d3106217fb2b2cf43040a6c3`; `FINALIZED` / `SUCCESS`.

## Fresh lifecycle evidence

Challenge `1` was created, funded with exactly `0.1 GEN`, synchronized through the retry path, activated, committed, delayed for the full 900 seconds, revealed, tested, and read back canonically. The final verdict was `NO_BYPASS`; no payout was eligible. Exact transaction records and readback are in `artifacts/live-lifecycle.json`.

Expiry model tests verify that both revealed and unrevealed pre-expiry commitments block `expire()` during the maximum reveal window, while tested attacks and elapsed windows no longer block it.

Vault transfers are modeled as exactly-once `TRANSFER_DISPATCHED` state transitions. GenLayer external value transfers are asynchronous; recipient-side settlement is external evidence and is never represented as synchronous `PAID` state. This lifecycle did not create an eligible transfer-dispatch case.

The frontend production deployment is `https://cantraparena.vercel.app`. Its Vercel environment must use the Arena and Vault addresses above.
