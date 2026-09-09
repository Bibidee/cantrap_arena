# Cantrap Arena Handoff (fresh source-matched deployment)

This handoff records the fresh source-matched deployment and live lifecycle.

## Production release

- Frontend release commit: updated after this deployment
- Frontend: https://cantraparena.vercel.app
- Network: Studionet (`61999`)
- Arena: `0xf2729bBCe3327f13e7aff034b8528c84f59a18E7`
- Vault: `0x430a238E058397e045aB972cB7e933a3F70091a2`
- Arena deployment: `0xd865d6b53d9cebe19cb3193fa873a544f71aaf994ad179bb00e8d5b09223960d`
- Vault deployment: `0x4ee53e36f0ef3f65047d9d0fa1b2e8591fb14199df50aeea7494e2416ad85649`
- Arena/Vault binding: `0x3b002f5d15cb591ca57b9810e8840a0359dabc446ffd8180970121f62c7e6f00`
- Arena source SHA-256: `7D0FFDD2D0A50F3A46AFEA22BE31F194A26E8E0C695BA45B7CABFD4670845F12`
- Vault source SHA-256: `BCEA1CB17D972F94D673B13A4FDAF8C7AFA9728FF9A282679BD02801E0F7DB5E`

## Verification

- GitHub Actions run: pending final release commit.
- Frontend: 22 tests passed; lint and typecheck passed; Vercel production build is ready.
- Contract source compilation and protocol tests passed in CI.
- Challenge page `#001` reads the canonical bounty as `0.01 GEN`.
- The hosted frontend must be redeployed with the addresses above before the UI evidence transaction is recorded.

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
