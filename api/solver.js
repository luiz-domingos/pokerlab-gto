const pokerSolver = {
    calcularEquity(mao) {
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        const forca = ranks.indexOf(mao[0]) + ranks.indexOf(mao[1]);
        // Simulação de cálculo: quanto menor o index, mais forte a carta
        let equity = 100 - (forca * 3);
        if (mao.endsWith('s')) equity += 7;
        if (mao[0] === mao[1]) equity += 15;
        return Math.min(Math.max(equity, 15), 85).toFixed(1);
    }
};