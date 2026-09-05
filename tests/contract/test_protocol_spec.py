"""Static reviewer-oriented protocol assertions. Live tests are opt-in (see docs/DEPLOYMENT.md)."""
from pathlib import Path
ARENA=Path('contracts/cantrap_arena.py').read_text(); VAULT=Path('contracts/cantrap_vault.py').read_text()
def test_independent_reproduction(): assert 'mine=self._run_once' in ARENA and 'run_nondet_unsafe' in ARENA
def test_commit_reveal_binds_attacker_payload_and_salt(): assert 'challenge_id"])+":"+str(a["attacker"])+":"+payload+":"+salt' in ARENA
def test_first_break_and_exact_once_claim(): assert "c['status']!='BROKEN'" in VAULT and "v['claimed']" in VAULT
def test_vault_accounting_exists(): assert 'total_credited' in VAULT and 'total_paid' in VAULT
def test_no_external_targeting_surface(): assert 'web.get' not in ARENA and 'http' not in ARENA
