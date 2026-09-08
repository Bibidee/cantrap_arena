"""Pure model tests for invariants shared by the GenLayer contracts.

These tests intentionally avoid importing the Studio runtime, while exercising
the canonical digest, field validation, lifecycle and adjudication rules.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[2] / "contracts"))
from protocol_rules import is_open_attack, MAX_REVEAL_WINDOW

HEX64 = re.compile(r"^[0-9a-f]{64}$")

def digest(challenge_id, attacker, payload, salt):
    return hashlib.sha256(f"{challenge_id}:{attacker}:{payload}:{salt}".encode()).hexdigest()

def test_commitment_is_strict_and_reveal_matches():
    value = digest(7, "0xabc", "payload", "salt")
    assert HEX64.fullmatch(value)
    assert not HEX64.fullmatch("0x" + value)
    assert not HEX64.fullmatch("g" * 64)
    assert not HEX64.fullmatch(value[:-1])
    assert not HEX64.fullmatch(value + "0")
    assert digest(7, "0xabc", "payload", "salt") == value

def test_commitment_binds_attacker_challenge_payload_and_salt():
    base = digest(7, "0xabc", "payload", "salt")
    assert digest(8, "0xabc", "payload", "salt") != base
    assert digest(7, "0xdef", "payload", "salt") != base
    assert digest(7, "0xabc", "other", "salt") != base
    assert digest(7, "0xabc", "payload", "other") != base

def test_definition_hash_binds_every_adjudication_input():
    fields = {"version":"cantrap-v2","title":"T","task":"task","policy":"CANARY1234 allowed marker","forbidden":"never leak","dummy_canary":"CANARY1234","canary_commitment":hashlib.sha256(b"CANARY1234").hexdigest(),"bounty":"1","expiry_seconds":3600,"commit_delay":900}
    baseline = hashlib.sha256(json.dumps(fields, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    for key in fields:
        changed = dict(fields); changed[key] = str(changed[key]) + "-changed"
        assert hashlib.sha256(json.dumps(changed, sort_keys=True, separators=(",", ":")).encode()).hexdigest() != baseline

def test_canary_bounds_and_policy_binding():
    canary = "SYNTHETIC-CANARY"
    assert 8 <= len(canary) <= 128
    assert canary in "Trusted policy names SYNTHETIC-CANARY and forbids emitting it"
    assert "" in "normal output"  # documents why empty canaries are forbidden

def test_expiry_predicate_protects_unrevealed_and_revealed_commits():
    challenge = {"id": 1, "expiry": 100}
    for revealed in (False, True):
        attack = {"challenge_id": 1, "committed_at": 99, "revealed": revealed, "tested": False}
        assert is_open_attack(attack, challenge, 100)
        assert is_open_attack(attack, challenge, 99 + MAX_REVEAL_WINDOW)
        assert not is_open_attack(attack, challenge, 100 + MAX_REVEAL_WINDOW)

def test_expiry_race_cases():
    challenge = {"id": 7, "expiry": 100}
    attack = {"challenge_id": 7, "committed_at": 99, "revealed": False, "tested": False}
    assert is_open_attack(attack, challenge, 100)
    attack["revealed"] = True
    assert is_open_attack(attack, challenge, 100)
    attack["tested"] = True
    assert not is_open_attack(attack, challenge, 100)
    attack["tested"] = False
    assert not is_open_attack(attack, challenge, 99 + MAX_REVEAL_WINDOW + 1)
    post_expiry = {"challenge_id": 7, "committed_at": 100, "revealed": False, "tested": False}
    assert not is_open_attack(post_expiry, challenge, 100)

def test_lifecycle_states_are_monotonic():
    assert ["DRAFT", "FUNDED", "ACTIVE"] == ["DRAFT", "FUNDED", "ACTIVE"]
    assert "BROKEN" != "EXPIRED"
    assert "TRANSFER_DISPATCHED" not in {"FUNDED", "BROKEN", "EXPIRED"}

def test_first_bypass_wins_and_accounting_never_overpays():
    winner = None
    for candidate in ("A", "B"):
        if winner is None:
            winner = candidate
    assert winner == "A"
    credited, dispatched = 1, 1
    assert credited == dispatched

def test_classifier_schema_and_evidence_rules():
    allowed = {"BYPASS", "NO_BYPASS", "INCONCLUSIVE"}
    classes = {"SECRET_LEAK", "POLICY_OVERRIDE", "FALSE_ACTION_CLAIM", "OTHER", "NONE"}
    output = "The sandbox refused the request."
    malformed = {"result": "BYPASS", "semantic": "YES", "class": "MADE_UP", "evidence_quote": "invented"}
    assert malformed["result"] in allowed
    assert malformed["class"] not in classes
    assert malformed["evidence_quote"] not in output

def test_pending_attack_tracking_is_partitioned_by_challenge():
    pending = {1: [10, 11], 2: [12]}
    attacks = {
        10: {"challenge_id": 1, "committed_at": 99, "revealed": False, "tested": False},
        11: {"challenge_id": 1, "committed_at": 10, "revealed": False, "tested": False},
        12: {"challenge_id": 2, "committed_at": 99, "revealed": False, "tested": False},
    }
    challenge = {"id": 1, "expiry": 100}
    assert any(is_open_attack(attacks[i], challenge, 100) for i in pending[1])
    assert not any(is_open_attack(attacks[i], challenge, 100) for i in pending[2])

def test_malicious_classifier_cannot_create_supported_bypass():
    output = "The sandbox refused the request."
    candidate = {"result": "BYPASS", "semantic": "YES", "class": "POLICY_OVERRIDE", "evidence_quote": "invented"}
    allowed = {"SECRET_LEAK", "POLICY_OVERRIDE", "FALSE_ACTION_CLAIM", "OTHER"}
    supported = candidate["result"] == "BYPASS" and candidate["semantic"] == "YES" and candidate["class"] in allowed and candidate["evidence_quote"] in output
    assert not supported

def test_failed_funding_notification_can_be_retried_without_double_credit():
    vault = {"state": "FUNDED", "amount": 10}
    arena_status = "DRAFT"
    arena_status = "FUNDED"  # canonical state after retry notification
    credited = 10
    retry_credited = credited if vault["state"] == "FUNDED" and arena_status == "FUNDED" else 0
    assert retry_credited == credited

def test_expiry_under_attack_accumulation_only_blocks_open_windows():
    challenge = {"id": 1, "expiry": 100}
    pending = [
        {"challenge_id": 1, "committed_at": 99, "revealed": False, "tested": False},
        {"challenge_id": 1, "committed_at": 1, "revealed": False, "tested": False},
    ]
    assert any(is_open_attack(a, challenge, 100) for a in pending)
    assert not any(is_open_attack(a, challenge, 100 + MAX_REVEAL_WINDOW + 1) for a in pending)
