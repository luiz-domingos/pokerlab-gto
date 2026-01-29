/**
 * ENGINE.JS - Orquestrador Central
 */
let maoAtual = "";
let posicaoSua = "";
let acaoCorreta = "";
let hits = 0;
let errors = 0;

// Função para iniciar o jogo e resetar o estado
function novoCenario() {
    // 1. Definição de Posição
    const posicoes = ["UTG", "MP", "CO", "BTN", "SB"];
    posicaoSua = posicoes[Math.floor(Math.random() * posicoes.length)];
    
    // 2. Sorteio da Mão
    const r = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
    let v1 = r[Math.floor(Math.random()*13)];
    let v2 = r[Math.floor(Math.random()*13)];
    let sufixo = (v1 === v2) ? "" : (Math.random() > 0.5 ? "s" : "o");
    
    // Normaliza (AK em vez de KA)
    if (r.indexOf(v1) < r.indexOf(v2)) {
        maoAtual = v1 + v2 + sufixo;
    } else {
        maoAtual = v2 + v1 + sufixo;
    }

    // 3. Renderização Visual (via api/deck.js)
    if (typeof deckAPI !== 'undefined' && deckAPI.renderizar) {
        deckAPI.renderizar(maoAtual);
    } else {
        console.error("deckAPI não encontrada. Verifique api/deck.js");
        document.getElementById('display-mao-treino').innerText = maoAtual; // fallback
    }

    // 4. Lógica de Vilão e UI
    const isRaise = Math.random() > 0.7; // 30% de chance de raise
    ui.updateVillainAction(isRaise ? "🚨 UTG Raise" : "✅ Mesa em Fold", isRaise ? "#ff7675" : "#888", isRaise);
    ui.highlightPosition(posicaoSua);

    // 5. Definição da Ação GTO (via ranges.js)
    if (typeof ranges !== 'undefined') {
        const rangeRFI = ranges.RFI[posicaoSua] || [];
        acaoCorreta = rangeRFI.includes(maoAtual) ? "RAISE" : "FOLD";
    }

    // Reset de feedback
    ui.updateFeedback("Sua decisão?", "white");
}

// Função chamada pelos botões FOLD/CALL/RAISE
function verificarAcao(acaoUsuario) {
    if (!maoAtual) return;

    // Cálculo de Equity (via api/solver.js)
    let equity = (typeof pokerSolver !== 'undefined') ? pokerSolver.calcularEquity(maoAtual) : "50";

    if (acaoUsuario === acaoCorreta) {
        hits++;
        ui.updateFeedback(`CORRETO! ✅ Equity: ${equity}%`, "#22c55e");
    } else {
        errors++;
        ui.updateFeedback(`ERRO! ❌ Era ${acaoCorreta}. Equity: ${equity}%`, "#ef4444");
    }

    // Atualiza Placar
    document.getElementById('hits').innerText = hits;
    document.getElementById('errors').innerText = errors;

    // Próxima mão após delay
    setTimeout(novoCenario, 1500);
}

// Integração com Stake (via api/exchange.js)
function atualizarStakeBRL() {
    const input = document.getElementById('input-stake');
    const display = document.getElementById('stake-brl');
    if (input && display && typeof exchangeAPI !== 'undefined') {
        const total = input.value * exchangeAPI.cotacao;
        display.innerText = `R$ ${total.toFixed(2)}`;
    }
}