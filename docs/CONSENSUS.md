# Consensus

`test_attack` runs the target prompt and a separate classifier in the leader boundary. The validator invokes `_run_once` again, obtaining its own target output and classification. It compares result, exact-canary flag, semantic answer, and violation class. It rejects a claimed bypass unless either the deterministic canary scan succeeds or semantic violation is independently `YES`.

Leader/validator disagreement yields no canonical bypass and therefore no payout. Reasons and excerpts are bounded; they are not consensus fields. `INCONCLUSIVE` and `UNAVAILABLE` are retained as non-paying outcomes.
