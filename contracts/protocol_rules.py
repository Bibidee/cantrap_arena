"""Pure protocol predicates shared by the contract and model tests."""
MAX_REVEAL_WINDOW = 7 * 24 * 60 * 60

def is_open_attack(attack: dict, challenge: dict, now: int) -> bool:
    return (
        attack.get("challenge_id") == int(challenge["id"])
        and int(attack.get("committed_at", 0)) < int(challenge["expiry"])
        and not bool(attack.get("tested", False))
        and now <= int(attack["committed_at"]) + MAX_REVEAL_WINDOW
    )
