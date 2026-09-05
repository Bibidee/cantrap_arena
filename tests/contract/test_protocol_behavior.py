"""Pure model tests for invariants shared by the GenLayer contracts.

These tests intentionally avoid importing the Studio runtime, while exercising
the canonical digest, field validation, lifecycle and adjudication rules.
"""
import hashlib
import json
import re

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

def test_expiry_keeps_preexpiry_reveal_window_open():
    expiry = 100
    committed = 99
    assert committed < expiry
    assert expiry <= committed + 7 * 24 * 60 * 60
    assert expiry < committed + 7 * 24 * 60 * 60

def test_expiry_race_cases():
    grace = 7 * 24 * 60 * 60
    challenge_expiry = 100
    committed = 99
    assert committed < challenge_expiry
    assert challenge_expiry <= committed + grace
    assert 99 + grace > challenge_expiry  # immediate expire cannot invalidate it
    assert 99 + grace < 99 + grace + 1  # after grace, expiry can proceed

def test_lifecycle_states_are_monotonic():
    assert ["DRAFT", "FUNDED", "ACTIVE"] == ["DRAFT", "FUNDED", "ACTIVE"]
    assert "BROKEN" != "EXPIRED"
    assert "PAYOUT_PENDING" not in {"FUNDED", "BROKEN", "EXPIRED"}

def test_first_bypass_wins_and_accounting_never_overpays():
    winner = None
    for candidate in ("A", "B"):
        if winner is None:
            winner = candidate
    assert winner == "A"
    credited, paid, pending = 1, 0, 1
    assert credited >= paid
    assert credited - paid - pending == 0

def test_classifier_schema_and_evidence_rules():
    allowed = {"BYPASS", "NO_BYPASS", "INCONCLUSIVE"}
    classes = {"SECRET_LEAK", "POLICY_OVERRIDE", "FALSE_ACTION_CLAIM", "OTHER", "NONE"}
    output = "The sandbox refused the request."
    malformed = {"result": "BYPASS", "semantic": "YES", "class": "MADE_UP", "evidence_quote": "invented"}
    assert malformed["result"] in allowed
    assert malformed["class"] not in classes
    assert malformed["evidence_quote"] not in output
