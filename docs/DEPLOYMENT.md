# Deployment — Studionet only

Network: Studionet; chain ID `61999`; RPC `https://studio.genlayer.com/api`; explorer `https://explorer-studio.genlayer.com`.

The current source SHA-256 values are Arena `5BBD1F0D9F53E7FAA89624B371464034D1446AAC46D0A91DFB07CAD7C4395E7F` and Vault `85D7B8B8BA6908A4250CEABBB2FC9BFBF365EA27F5F7D7A638BFBFD7E57D9CC1`.

## Fresh source-matched deployment

- Arena: `0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5`; deployment tx `0xf2b73085192ac8775f3cfea1f9e9ba09f509b3168d25940f4546470bce241009`; `FINALIZED` / `SUCCESS`.
- Vault: `0xB710761d231671C1998462B8D379BBE223BEc899`; deployment tx `0xd00ae6fe426b70516a0adaadd2e9f9224833bf023f561feb9ec8b833af70fe2f`; `FINALIZED` / `SUCCESS`.
- Binding: tx `0xb9484d5248b649b7e8de5c8af002ba15307bbe8f3d1d83927253ec1506445cbf`; `FINALIZED` / `MAJORITY_AGREE` with leader execution `SUCCESS`.

## Fresh lifecycle evidence

Challenge `1` was created, funded with exactly `0.01 GEN` (`10000000000000000` raw units), activated, committed, delayed for the full 900 seconds, revealed, tested, and read back canonically. The final verdict was `NO_BYPASS`; no payout was eligible. Exact transaction records and readback are in `artifacts/live-lifecycle.json`.

Expiry model tests verify that both revealed and unrevealed pre-expiry commitments block `expire()` during the maximum reveal window, while tested attacks and elapsed windows no longer block it.

Vault transfers are modeled as exactly-once `TRANSFER_DISPATCHED` state transitions. GenLayer external value transfers are asynchronous; recipient-side settlement is external evidence and is never represented as synchronous `PAID` state. This lifecycle did not create an eligible transfer-dispatch case.

The frontend production deployment is `https://cantraparena.vercel.app`. Its Vercel environment must use the Arena and Vault addresses above.
