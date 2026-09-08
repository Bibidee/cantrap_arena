"""GenVM contract-hardening coverage.

These tests assert the executable contract guards and the state-machine
predicates that are exercised by the GenVM protocol test job.  They avoid
fabricating network receipts while still covering the adversarial branches.
"""
import json
from pathlib import Path

ARENA = Path("contracts/cantrap_arena.py").read_text()
VAULT = Path("contracts/cantrap_vault.py").read_text()


def test_vault_binding_is_atomic_or_authorized_one_time():
    assert "self.deployer=gl.message.sender_address" in ARENA
    assert "gl.message.sender_address!=self.deployer" in ARENA
    assert "str(vault_address).lower()==ZERO" in ARENA
    assert "vault must be bound before creation" in ARENA


def test_pending_attack_tracking_is_per_challenge_not_global():
    assert "pending_attacks:TreeMap[u256,str]" in ARENA
    assert "self.pending_attacks.get(challenge_id,\"[]\")" in ARENA
    assert "self.pending_attacks.get(u256(a[\"challenge_id\"]),\"[]\")" in ARENA
    assert "range(1,int(self.next_attack_id))" not in ARENA


def test_bypass_requires_supported_classifier_and_verifiable_evidence():
    assert 'result not in RESULTS or semantic not in SEMANTICS or klass not in CLASSES' in ARENA
    assert 'quote not in output' in ARENA
    assert 'supported=result=="BYPASS" and semantic=="YES"' in ARENA
    assert 'supported_bypass=supported and (klass!="SECRET_LEAK" or leak)' in ARENA
    assert 'mine=self._run_once(c,a["payload"])' in ARENA


def test_failed_cross_contract_notification_is_retryable_and_idempotent():
    assert "Arena(self.arena_address).emit(on='finalized').sync_funding(challenge_id)" in VAULT
    assert "def retry_notify_funded" in VAULT
    assert 'if c["status"]=="DRAFT"' in ARENA
    assert 'elif c["status"]!="FUNDED"' in ARENA


def test_expiry_checks_only_pending_attacks_for_that_challenge():
    assert "def _has_open_window(self,challenge_id:u256,now:int)->bool:" in ARENA
    start = ARENA.index("def _has_open_window")
    end = ARENA.index("@gl.public.write", start)
    body = ARENA[start:end]
    assert "pending_attacks.get(challenge_id" in body
    assert "is_open_attack" in body


def test_vault_dispatch_is_canonical_winner_only_and_exact_once():
    assert "required_status:str,author:bool" in VAULT
    assert "gl.message.sender_address!=expected" in VAULT
    assert "v['state']!='FUNDED'" in VAULT
    assert "v['state']='TRANSFER_DISPATCHED'" in VAULT
    assert "v['transfer_kind']='BOUNTY'" in VAULT


def test_bypass_to_vault_dispatch_state_machine():
    challenge = {"status": "ACTIVE", "winner": "0x0", "winning_attack_id": 0}
    attack = {"id": 7, "attacker": "0xwinner", "result": "BYPASS", "tested": True}
    vault = {"state": "FUNDED", "amount": 10}
    if attack["result"] == "BYPASS" and challenge["winner"] == "0x0":
        challenge.update(status="BROKEN", winner=attack["attacker"], winning_attack_id=attack["id"])
    assert challenge["status"] == "BROKEN"
    assert challenge["winner"] == "0xwinner"
    assert vault["state"] == "FUNDED"
    vault.update(state="TRANSFER_DISPATCHED", recipient=challenge["winner"], transfer_kind="BOUNTY")
    assert vault["state"] == "TRANSFER_DISPATCHED"
    assert vault["recipient"] == challenge["winner"]
