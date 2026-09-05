"""Small source guards for invariants difficult to exercise without GenVM."""
from pathlib import Path
ARENA=Path('contracts/cantrap_arena.py').read_text()
VAULT=Path('contracts/cantrap_vault.py').read_text()
def test_independent_reproduction_and_strict_classifier_boundary():
    assert 'mine=self._run_once' in ARENA and 'run_nondet_unsafe' in ARENA
    assert 'evidence_quote' in ARENA and 'response_format="json"' in ARENA
    assert 'result not in RESULTS' in ARENA
def test_commit_reveal_binds_all_material_inputs():
    assert 'str(a["challenge_id"])+":"+a["attacker"]+":"+payload+":"+salt' in ARENA
    assert 'len(attack_hash)!=64' not in ARENA and '_hex64(attack_hash)' in ARENA
def test_lifecycle_and_expiry_guards_are_present():
    assert 'funded_at' in ARENA and 'ACTIVATION_TIMEOUT' in ARENA
    assert 'self._has_open_window' in ARENA and 'MAX_REVEAL_WINDOW' in ARENA
    assert 'get_active_attack_id' in ARENA
def test_vault_uses_canonical_arena_and_pending_accounting():
    assert 'retry_notify_funded' in VAULT and "v['state']='TRANSFER_DISPATCHED'" in VAULT
    assert 'total_dispatched' in VAULT and 'locked' in VAULT
def test_no_external_targeting_surface():
    assert 'web.get' not in ARENA and 'http' not in ARENA
