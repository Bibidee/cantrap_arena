# Deployment — Studionet only

Network: Studionet; chain ID `61999`; RPC `https://studio.genlayer.com/api`; explorer `https://explorer-studio.genlayer.com`.

The current source SHA-256 values are Arena `7D0FFDD2D0A50F3A46AFEA22BE31F194A26E8E0C695BA45B7CABFD4670845F12` and Vault `BCEA1CB17D972F94D673B13A4FDAF8C7AFA9728FF9A282679BD02801E0F7DB5E`.

## Fresh source-matched deployment

- Arena: `0xf2729bBCe3327f13e7aff034b8528c84f59a18E7`; deployment tx `0xd865d6b53d9cebe19cb3193fa873a544f71aaf994ad179bb00e8d5b09223960d`; `FINALIZED` / `SUCCESS`.
- Vault: `0x430a238E058397e045aB972cB7e933a3F70091a2`; deployment tx `0x4ee53e36f0ef3f65047d9d0fa1b2e8591fb14199df50aeea7494e2416ad85649`; `FINALIZED` / `SUCCESS`.
- Binding: tx `0x3b002f5d15cb591ca57b9810e8840a0359dabc446ffd8180970121f62c7e6f00`; `FINALIZED` / `SUCCESS`.

## Fresh lifecycle evidence

Challenge `1` was created, funded with exactly `0.01 GEN` (`10000000000000000` raw units), activated, committed, delayed for the full 900 seconds, revealed, tested, and read back canonically. The final verdict was `NO_BYPASS`; no payout was eligible. Exact transaction records and readback are in `artifacts/live-lifecycle.json`.

Expiry model tests verify that both revealed and unrevealed pre-expiry commitments block `expire()` during the maximum reveal window, while tested attacks and elapsed windows no longer block it.

Vault transfers are modeled as exactly-once `TRANSFER_DISPATCHED` state transitions. GenLayer external value transfers are asynchronous; recipient-side settlement is external evidence and is never represented as synchronous `PAID` state. This lifecycle did not create an eligible transfer-dispatch case.

The frontend production deployment is `https://cantraparena.vercel.app`. Its Vercel environment must use the Arena and Vault addresses above.
