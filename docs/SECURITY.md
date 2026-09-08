# Security and safe scope

Cantrap operates only on benchmark prompts stored in its own Arena. It does not scan websites, execute code, handle credentials, or contact external systems. Canary strings must be synthetic test values: contract state is public and never a suitable secret store.

Commitment hashes bind challenge, attacker address, payload, and salt as lowercase 64-character hex without `0x`. Payloads remain absent until reveal; only the attacker can reveal. The canary is public synthetic data, never a credential or hidden secret. Winner and payout recipient are read from stored Arena state, never supplied by the caller. Classifier output is an adversarial boundary: exact enums, bounded evidence, and substring checks are required, and validators reproduce the full decision. Vault funding notification is asynchronous and retryable; payouts use exactly-once `TRANSFER_DISPATCHED` accounting, while recipient-side settlement is verified externally rather than represented as synchronous `PAID` state.

Frontend transaction handling treats a finalized transaction with a GenVM exception, rollback, or unsuccessful execution result as failure. A green completion state is shown only after the affected Arena/Vault readback matches the expected mutation.

Vault binding is either supplied atomically at Arena construction or initialized once by the deployer; an unbound Arena cannot create challenges. Pending reveal/test windows are tracked per challenge, preventing unrelated attacks from affecting expiry checks. Cross-contract funding notification failures remain recoverable through the idempotent retry path.
