# Reviewer demo

1. Open `/challenges` and inspect a sealed specimen.
2. Open its attack lab, write safe sandbox content, generate a commitment, download the receipt, and explicitly opt in to local salt persistence.
3. Commit from a wallet on 61999; the UI shows signature, submission, consensus, finalization, execution, explorer link, and readback phases.
4. After delay, reveal and run the test.
5. Inspect the result: independent target/classifier replay is required for `BYPASS`; an exact canary leak or confirmed material semantic violation is necessary.
6. The first finalized bypass alone can call the Vault claim. A clean expired challenge refunds its author; an unfunded activation timeout exposes the author-only unactivated refund. Remember that the canary is a public synthetic benchmark marker, not hidden secret storage.
