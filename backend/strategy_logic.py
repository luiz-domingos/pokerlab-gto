# strategy_logic.py
def decide_action(strength, position, pot_odds, opponent_action):
    # Lógica de Solver: Se a força da mão justifica o risco
    if strength > 0.8:
        return "RAISE" if opponent_action == "CHECK" else "3-BET"
    
    if strength > 0.4 and pot_odds < strength:
        return "CALL"
        
    return "FOLD"