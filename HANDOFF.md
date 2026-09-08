# Cantrap Arena Handoff (fresh local hardening deployment)

This handoff records the fresh local hardening deployment and live lifecycle. Changes are intentionally uncommitted and have not been pushed.

## Production release

- Frontend release commit: `ce5e2ccc97ad3827901c142b68c3b41de2946753`
- Frontend: https://cantraparena.vercel.app
- Network: Studionet (`61999`)
- Arena: `0xa86fb6dA08f1A931e11E863f1Bf8A846F2F5B8B5`
- Vault: `0xB710761d231671C1998462B8D379BBE223BEc899`
- Arena deployment: `0xf2b73085192ac8775f3cfea1f9e9ba09f509b3168d25940f4546470bce241009`
- Vault deployment: `0xd00ae6fe426b70516a0adaadd2e9f9224833bf023f561feb9ec8b833af70fe2f`
- Arena/Vault binding: `0xb9484d5248b649b7e8de5c8af002ba15307bbe8f3d1d83927253ec1506445cbf`
- Arena source SHA-256: `5BBD1F0D9F53E7FAA89624B371464034D1446AAC46D0A91DFB07CAD7C4395E7F`
- Vault source SHA-256: `85D7B8B8BA6908A4250CEABBB2FC9BFBF365EA27F5F7D7A638BFBFD7E57D9CC1`

## Verification

- GitHub Actions run `34108417752`: success on the release commit.
- Frontend: 18 tests passed; lint and typecheck passed; Vercel production build is ready.
- Contract source compilation and protocol tests passed in CI.
- Challenge page `#001` reads the canonical bounty as `0.01 GEN`.
- The hosted frontend must be redeployed separately with the addresses above; no GitHub push or Vercel redeploy was performed in this local-only pass.

## Live lifecycle

The fresh Studionet lifecycle is:

`create → fund → retry funding notification → activate → commit → wait 900 seconds → reveal → test → canonical readback`.

Challenge `1` funded exactly `0.01 GEN`. The canonical attack ID is `1` after reload. The finalized result is `NO_BYPASS`, with semantic `NO` and class `NONE`; the challenge has no winner. The complete transaction register is in [`artifacts/live-lifecycle.json`](artifacts/live-lifecycle.json).

The lifecycle also includes a passed expiry-boundary regression and a failed early reveal boundary transaction. No payout dispatch was eligible because the final verdict was `NO_BYPASS`.

## Safety and frontend safeguards

- Canaries are public synthetic benchmark markers; no credentials or private secrets are used.
- Target output is treated as untrusted data by adjudication.
- Classifier results require strict enums, bounded evidence, and deterministic support.
- Writes are followed by canonical contract rereads before the UI reports success.
- Vault transfer states are represented as `TRANSFER_DISPATCHED`; the UI does not claim recipient settlement.
- Local attack receipts are clearly labeled as browser-local and are not presented as complete wallet history.

## Evidence matrix

| Criterion | Implementation | Test / live evidence | Documentation |
|---|---|---|---|
| Commit/reveal | `components/attack-lab.tsx`, Arena contract | lifecycle commit/reveal txs; reload recovered attack `2` | `docs/CONTRACT_SURFACE.md` |
| Validator adjudication | Arena adjudication pipeline | finalized `NO_BYPASS` readback | `docs/CONSENSUS.md` |
| Exact bounty escrow | Vault contract and funding flow | funding tx plus retry notification | `docs/DEPLOYMENT.md` |
| Expiry safety | Arena expiry guards | expiry regression `PASS` | `docs/SECURITY.md` |
| Source matching | deployed Arena/Vault artifacts | deployment receipts and source hashes | this handoff |
| Production UI | challenge wall and challenge page | live `#001` shows `0.01 GEN` | `README.md` |

## Known limitation

The captured lifecycle did not produce a `BYPASS`, so a live bounty transfer dispatch was not eligible. The Vault claim/refund paths remain guarded by canonical winner, status, and timeout checks.
