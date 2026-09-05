# Deployment — Studionet only

Network: Studionet; chain ID `61999`; RPC `https://studio.genlayer.com/api`; explorer `https://explorer-studio.genlayer.com`.

Before a funded deployment, run Python compile/static checks and use Studio schema generation for both sources. Record source byte count and SHA-256. Deploy Arena with the zero address as `vault_address`, deploy Vault with the Arena address, then call `Arena.bind_vault(Vault address)` before the first challenge. Set `NEXT_PUBLIC_ARENA_ADDRESS` and `NEXT_PUBLIC_VAULT_ADDRESS`. Run an exact-value fund, Arena activation, commit, reveal, test, and final readback. Record only actual tx hashes, execution results, and addresses.

## Current source-matched deployment evidence

The unlocked CLI account `0x79b3Ecbe6a65bee93b2fcda78e6909892671507F` deployed and finalized the current sources on Studionet:

- Arena: `0xC320CB34624CBDCF7d177a50b524E0013387DDB2`; deployment tx `0xb5c55627f91c48c934b46582c4544991ffe4d401cd8c13e46e106262816de851`; finalized with execution `SUCCESS`.
- Vault: `0xd29f81074761d2e3CfC301d3E883570c4C2690A4`; deployment tx `0x00246dd6e3ab69f4408954e2056f71349636824f56de2f401d8ce72b35a7dd3f`; finalized with execution `SUCCESS`.
- Arena/Vault binding: tx `0x1e049f060e9ce0dadf4359e3c65994380fffe0c447c217efe802c0877c676dcb`; finalized with execution `SUCCESS`.

Current source evidence: Arena SHA-256 `268BB662B011BEAF84BEB0FD3D0638FC884531EA4543CA56B11AFC0F5EDE2914`; Vault SHA-256 `4436A0D42F633E96CE6E85E902C6E59CCC00CD60099A605A4061377F05415D30`.

## Live lifecycle evidence

Challenge `1` was created by the current Arena, funded with exactly `0.1 GEN`, synchronized through the retry path after the initial asynchronous notification did not update Arena, activated, committed, delayed for the full 900 seconds, revealed, and tested. Finalized successful transactions are recorded in `artifacts/live-lifecycle.json`.

- Funding: `0xe41137596bf27cb43e97fec7f679e0748b4154b3bcdc99bebb219e6376939d86`
- Activation: `0x70816efd12e5ce153809f79e7acbe1f00c0a00888b3dfa95b80f36cd981d30e2`
- Commit: `0x467fe2ee2c5e792502b6ede2c28abc4479ce033e626f623a91048a6489a4b72f`
- Reveal: `0x4419025e1d67290854eb633e7a438ace716878a8d7344b2d641edf2ccaaca9d2`
- Test: `0x845358c9dc49e4a4bac6bf6bbabe234098c8ceabc0ef8acc0aa9cff9cec57b94`

The authoritative final readback was `NO_BYPASS`; the model refused the injected payload, so no bounty claim was eligible. The challenge remains ACTIVE and no refund was eligible. Full machine-readable source-matched evidence is in `artifacts/live-lifecycle.json`.

The first attempted Arena and Vault deployments were rejected at execution because raw `dict` values were not valid persistent GenVM types. Those failed addresses are intentionally not configured; the deployed addresses above use JSON-string storage and were revalidated on-chain.
