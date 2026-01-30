# backend/data_feeder.py
import json
import os

class GTODataLoader:
    def __init__(self):
        self.ranges_path = os.path.join(os.path.dirname(__file__), 'data/ranges_gto.json')
        self.data = self.load_data()

    def load_data(self):
        if os.path.exists(self.ranges_path):
            with open(self.ranges_path, 'r') as f:
                return json.load(f)
        return {}

    def get_action(self, hand_id, position, action_to_me="OPEN"):
        """
        Consulta o banco de dados e-GTO
        Ex: hand_id='AKs', position='UTG'
        """
        # Se não encontrar no banco, usamos uma regra de segurança (Hardcoded)
        premium = ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AKo", "AQs"]
        if hand_id in premium:
            return "RAISE"
            
        return self.data.get(position, {}).get(hand_id, "FOLD")