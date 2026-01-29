const exchangeAPI = {
    cotacao: 5.00,
    async buscarCotacao() {
        try {
            const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
            const data = await res.json();
            this.cotacao = parseFloat(data.USDBRL.high);
            console.log("Cotação atualizada: R$ " + this.cotacao.toFixed(2));
            if(document.getElementById('stake-brl')) engine.atualizarStakeBRL();
        } catch (e) { console.error("Erro na API de Câmbio", e); }
    }
};
exchangeAPI.buscarCotacao();