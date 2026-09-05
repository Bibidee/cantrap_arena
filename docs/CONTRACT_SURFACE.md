# Contract surface

Arena: `create_challenge`, `notify_funded` (Vault-only), `activate`, `commit_attack`, `reveal_attack`, `test_attack`, `expire`, `get_challenge`, `get_attack`.

Vault: `fund_challenge` (payable exact amount), `claim_bounty`, `refund_expired`, `get_vault`, `accounting`.

All bounty amounts are `u256` wei. A native GEN transfer is emitted only after claim/refund state and accounting are updated.
