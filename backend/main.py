from .data_feeder import GTODataLoader

loader = GTODataLoader()

@app.post("/avaliar")
async def avaliar(data: dict):
    mao_id = formatar_mao(data['mao']) # Ex: vira 'AKs'
    
    # Busca a decisão na base de dados e-GTO
    sugestao = loader.get_action(mao_id, data['posicao'])
    
    return {"sugestao": sugestao, "fonte": "e-GTO Open Database"}