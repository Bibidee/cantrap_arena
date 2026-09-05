# Architecture

`CantrapArena` is the canonical registry for challenge definitions, hash commitments, reveal windows, test results, and first winner. `CantrapVault` receives the exact bounty, reads the Arena’s final winner, and emits the fixed payout. The app makes unsigned public reads and uses only the connected wallet for writes.

The contracts are deliberately separate: the Arena has the semantic/non-deterministic decision and cannot release funds; the Vault has custody and never invokes a model. There is no off-chain verdict service.
