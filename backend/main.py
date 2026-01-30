from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pypokerengine.players import BasePokerPlayer
from pypokerengine.utils.card_utils import Card, Deck
from pypokerengine.api.hand_handle import estimate_hand_strength
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/avaliar-posflop")
async def avaliar_mao(data: dict):
    try:
        # 1. Converter cartas para o formato PyPoker (ex: 'Ah' -> 'HA')
        def to_pypoker(c):
            # PyPoker usa 'SA', 'H2', 'D10', etc.
            rank = c[0].replace('T', '10')
            suit = c[1].upper()
            return f"{suit}{rank}"

        hole_card = [to_pypoker(c) for c in data['mao']]
        community_card = [to_pypoker(c) for c in data['board']]
        
        # 2. Simular Equidade (Hand Strength) usando Monte Carlo (1000 simulações)
        # Isso retorna um valor entre 0 e 1 (ex: 0.75 = 75% de chance de ganhar)
        strength = estimate_hand_strength(hole_card, community_card, 1000, 2)
        
        # 3. Lógica de Decisão Profissional (Gameplay)
        pote = data.get('pote', 0)
        if strength > 0.65:
            sugestao = "BET 75% POT"
            cor = "var(--green)"
        elif strength > 0.35:
            sugestao = "CHECK/CALL"
            cor = "var(--gold)"
        else:
            sugestao = "CHECK/FOLD"
            cor = "var(--red)"
            
        return {
            "status": "sucesso",
            "equidade": round(strength * 100, 2),
            "sugestao": sugestao,
            "cor": cor
        }
    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)