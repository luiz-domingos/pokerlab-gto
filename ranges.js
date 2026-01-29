const ranges = {
    "RFI": {
        "UTG": ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "AKs", "AQs", "AJs", "ATs", "KQs", "KJs", "QJs", "JTs", "AKo", "AQo", "AJo"],
        "MP": ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "AKs", "AQs", "AJs", "ATs", "A9s", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs", "T9s", "AKo", "AQo", "AJo", "KQo"],
        "CO": ["22", "33", "44", "55", "66", "77", "88", "99", "TT", "JJ", "QQ", "KK", "AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "K9s", "QJs", "QTs", "Q9s", "JTs", "J9s", "T9s", "98s", "87s", "76s", "AKo", "AQo", "AJo", "ATo", "KQo", "KTo", "QTo", "JTo"],
        "BTN": ["22", "33", "44", "55", "66", "77", "88", "99", "TT", "JJ", "QQ", "KK", "AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "JTs", "J9s", "J8s", "T9s", "T8s", "98s", "97s", "87s", "86s", "76s", "65s", "54s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KTo", "KJo", "QTo", "QJo", "JTo"],
        "SB": ["22", "33", "44", "55", "66", "77", "88", "99", "TT", "JJ", "QQ", "KK", "AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "QJs", "QTs", "Q9s", "JTs", "J9s", "T9s", "98s", "87s", "76s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KTo", "QTo", "JTo"]
    },
    "DEFESA": {
        // BTN defendendo contra Raise do UTG (Polarizado)
        "BTN_vs_UTG": {
            "3BET": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AKo"],
            "CALL": ["TT", "99", "88", "AJs", "ATs", "KQs", "KJs", "QJs", "JTs", "AQo"]
        },
        // BB defendendo contra Raise do BTN (Amplo)
        "BB_vs_BTN": {
            "3BET": ["AA", "KK", "QQ", "JJ", "TT", "AQs+", "A5s", "A4s", "A3s", "AKo", "KJs"],
            "CALL": ["99", "88", "77", "66", "55", "44", "33", "22", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A2s", "KQs", "K9s", "QJs", "T9s", "98s", "87s", "76s", "AQo", "AJo", "ATo", "KQo", "KJo"]
        }
    }
};