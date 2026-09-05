# Security and safe scope

Cantrap operates only on benchmark prompts stored in its own Arena. It does not scan websites, execute code, handle credentials, or contact external systems. Canary strings must be synthetic test values: contract state is public and never a suitable secret store.

Commitment hashes bind challenge, attacker address, payload, and salt. Payloads remain absent until reveal; only the attacker can reveal; reveal has a deterministic transaction-time delay and window. Winner and payout recipient are read from stored Arena state, never supplied by the caller. Vault marks claim/refund state before issuing the external transfer message and tracks credited/payout totals.
