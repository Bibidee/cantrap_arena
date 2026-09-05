# Contract surface

Arena: `create_challenge`, `notify_funded`/`sync_funding` (Vault-only and idempotent), `activate`, `commit_attack`, `reveal_attack`, `test_attack`, `expire`, `get_challenge`, `get_attack`, `get_challenge_count`, `get_attack_count`, `get_active_attack_id`.

Vault: `fund_challenge` (payable exact amount), `retry_notify_funded`, `claim_bounty`, `refund_expired`, `refund_unactivated`, `get_vault`, `accounting`.

All bounty amounts are `u256` wei. Funding is recorded before the asynchronous Arena notification. Eligible payouts/refunds transition exactly once from `FUNDED` to `TRANSFER_DISPATCHED`, recording recipient, amount, dispatch time, and transfer kind before emitting the native transfer. `accounting` exposes `credited`, `dispatched`, `locked`, and `accounted`; recipient-side settlement is external evidence because GenLayer value transfers are asynchronous.
