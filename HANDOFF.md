# Cantrap Arena Handoff

## Production release

- Frontend release commit: `ce5e2ccc97ad3827901c142b68c3b41de2946753`
- Frontend: https://cantraparena.vercel.app
- Network: Studionet (`61999`)
- Arena: `0x57Af04B020861de59EBf12B0079A44333fdD897E`
- Vault: `0x4c98d293DD8E239BA9888361ECd612a10382E420`
- Arena deployment: `0xaa4e635ad1c90756466c7b169984f6182e2dbddf5479e84878c95f453eed03b3`
- Vault deployment: `0x3c7f38f921fbe9942c8a26512d130aa7fefea8a3aa734de5569dabe0a3822702`
- Arena/Vault binding: `0x79f0a0de5b87fbbea8158ac3b5c038ecbc929ca6d3106217fb2b2cf43040a6c3`
- Arena source SHA-256: `B5B699EC75BF6B69604A2C7D054AECDF1C7955D779A21107E989F221ECA94E7A`
- Vault source SHA-256: `63FB9CC78F89E42E3085B972668333CD371AF09B76E8F2C207471F8EF0DD8CC0`

## Verification

- GitHub Actions run `34108417752`: success on the release commit.
- Frontend: 18 tests passed; lint and typecheck passed; Vercel production build is ready.
- Contract source compilation and protocol tests passed in CI.
- Challenge page `#001` reads the canonical bounty as `0.01 GEN`.
- Vercel deployment uses the source-matched Arena and Vault addresses above.

## Live lifecycle

The recorded Studionet lifecycle is:

`create → fund → retry funding notification → activate → commit → wait 900 seconds → reveal → test → canonical readback`.

Challenge `1` funded exactly `0.01 GEN`. The canonical attack ID is `2` after reload. The finalized result is `NO_BYPASS`, with semantic `NO` and class `NONE`; the challenge has no winner. The complete transaction register is in [`artifacts/live-lifecycle.json`](artifacts/live-lifecycle.json).

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
