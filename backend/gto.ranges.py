# gto_ranges.py
RANGES = {
    "PREMIUM": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AKo", "AQs", "AQo"],
    "STRONG": ["99", "88", "AJs", "AJo", "KQs", "KJo"],
}

def get_preflop_action(mao_id):
    if mao_id in RANGES["PREMIUM"]:
        return "RAISE"
    if mao_id in RANGES["STRONG"]:
        return "RAISE" # Ou lógica de 3-bet
    return "FOLD"