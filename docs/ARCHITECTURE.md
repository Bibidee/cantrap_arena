# Architecture

`CantrapArena` is the canonical registry for immutable challenge definitions, public synthetic canary markers, hash commitments, reveal/test grace windows, test results, and first winner. `CantrapVault` receives the exact bounty, records funding before its asynchronous Arena notification, reads the Arena’s final winner, and emits the fixed payout. The app reads counts and records from the deployed contracts and uses only the connected wallet for writes.

The contracts are deliberately separate: the Arena has the semantic/non-deterministic decision and cannot release funds; the Vault has custody and never invokes a model. There is no off-chain verdict service.
