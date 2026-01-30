/**
 * ENGINE.JS COMPLETO - PokerLab Pro
 */

// No topo do engine.js, adicione esta variável de controle
let acaoVilaoAtual = "CHECK";

async function iniciarPosFlop() {
    // 1. Reset visual e exibição de controles
    document.getElementById('btn-check').style.display = 'block';
    document.getElementById('sizing-bar').style.display = 'flex';
    document.getElementById('btn-raise').innerText = 'BET';

    // 2. Gerar Board e Pote
    estadoJogo.fase = "FLOP";
    estadoJogo.pote = 6.5; 
    estadoJogo.board = gerarBoard(3);
    document.getElementById('valor-pote').innerText = estadoJogo.pote + " bb";
    renderizarBoard(estadoJogo.board);

    // 3. SORTEIO DA AÇÃO DO VILÃO (Simulação de Gameplay)
    // 60% Check / 40% Bet
    const sorteio = Math.random();
    if (sorteio > 0.6) {
        acaoVilaoAtual = "BET";
        const valorApostaVilao = (estadoJogo.pote * 0.5).toFixed(1); // Vilão aposta meio pote
        exibirApostaVilao(valorApostaVilao);
        ui.updateFeedback(`Vilão apostou ${valorApostaVilao}bb. Sua ação?`, "var(--red)");
        document.getElementById('btn-check').style.display = 'none'; // Se ele betou, não existe Check
    } else {
        acaoVilaoAtual = "CHECK";
        document.getElementById('ficha-vilao').style.display = 'none';
        ui.updateFeedback("Vilão deu Check. Sua vez.", "white");
    }
}

function exibirApostaVilao(valor) {
    const ficha = document.getElementById('ficha-vilao');
    const txt = document.getElementById('valor-bet');
    txt.innerText = valor + "bb";
    ficha.style.display = 'flex';
}

async function verificarAcao(acaoUsuario) {
    // Envia a ação do vilão para o Python decidir se sua resposta é boa
    const resposta = await fetch('http://localhost:8000/avaliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mao: estadoJogo.mao, 
            board: estadoJogo.board,
            acao_vilao: acaoVilaoAtual // Informa ao cérebro o que o vilão fez
        })
    });
    
    const analise = await resposta.json();
    // ... restante da lógica de hits/errors ...
}

let estadoJogo = {
    mao: [],
    board: [],
    posicao: "",
    pote: 0,
    fase: "PREFLOP" // PREFLOP, FLOP, TURN, RIVER
};

async function novoCenario() {
    limparInterface();
    
    estadoJogo.mao = gerarMaoAleatoria();
    estadoJogo.board = [];
    estadoJogo.fase = "PREFLOP";
    estadoJogo.pote = 1.5; // Blinds
    estadoJogo.posicao = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'][Math.floor(Math.random() * 6)];

    renderizarCartasJogador(estadoJogo.mao);
    document.getElementById('valor-pote').innerText = estadoJogo.pote + " bb";
    ui.highlightPosition(estadoJogo.posicao);
    ui.updateFeedback(`Sua posição: ${estadoJogo.posicao}. O que fazer?`, "#fff");
}

async function verificarAcao(acaoUsuario) {
    const resposta = await fetch('http://localhost:8000/avaliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mao: estadoJogo.mao, board: estadoJogo.board })
    });
    
    const analise = await resposta.json();
    const acaoGTO = analise.sugestao.includes(acaoUsuario) || (acaoUsuario === 'RAISE' && analise.sugestao.includes('BET'));

    if (acaoGTO) {
        ui.updateFeedback(`✅ Correto! ${analise.mao_texto}`, "var(--green)");
        if (estadoJogo.fase === "PREFLOP" && acaoUsuario !== "FOLD") {
            setTimeout(irParaFlop, 1000);
        }
    } else {
        ui.updateFeedback(`❌ Erro! O Solver sugere ${analise.sugestao}`, "var(--red)");
    }
}

function irParaFlop() {
    estadoJogo.fase = "FLOP";
    estadoJogo.pote = 6.5; // Simula pote de um aumento
    estadoJogo.board = gerarBoard(3);
    
    document.getElementById('valor-pote').innerText = estadoJogo.pote + " bb";
    renderizarBoard(estadoJogo.board);
    
    // UI Pós-flop
    document.getElementById('btn-check').style.display = 'block';
    document.getElementById('sizing-bar').style.display = 'flex';
    ui.updateFeedback("Flop na mesa. Sua ação?", "var(--accent)");
}

// --- UTILITÁRIOS ---

function gerarMaoAleatoria() {
    const cartas = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
    const naipes = ['s', 'h', 'd', 'c'];
    let m = [];
    while(m.length < 2) {
        let c = cartas[Math.floor(Math.random()*13)] + naipes[Math.floor(Math.random()*4)];
        if(!m.includes(c)) m.push(c);
    }
    return m;
}

function gerarBoard(qtd) {
    const cartas = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
    const naipes = ['s', 'h', 'd', 'c'];
    let b = [];
    while(b.length < qtd) {
        let c = cartas[Math.floor(Math.random()*13)] + naipes[Math.floor(Math.random()*4)];
        if(!b.includes(c) && !estadoJogo.mao.includes(c)) b.push(c);
    }
    return b;
}

function renderizarCartasJogador(mao) {
    const icones = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    mao.forEach((c, i) => {
        const el = document.getElementById(`card-v${i+1}`);
        const valor = c[0].replace('T','10');
        el.innerHTML = `<div>${valor}</div><div style="font-size:20px">${icones[c[1]]}</div>`;
        el.className = `card-visual ${ (c[1]==='h'||c[1]==='d') ? 'txt-red' : 'txt-black' }`;
    });
}

function renderizarBoard(board) {
    const icones = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    board.forEach((c, i) => {
        const el = document.getElementById(`flop-${i+1}`);
        el.innerHTML = `${c[0].replace('T','10')}${icones[c[1]]}`;
        el.className = `card-visual mini ${ (c[1]==='h'||c[1]==='d') ? 'txt-red' : 'txt-black' }`;
        el.style.display = "flex";
    });
}

function limparInterface() {
    for(let i=1; i<=3; i++) document.getElementById(`flop-${i}`).style.display = "none";
    document.getElementById('btn-check').style.display = 'none';
    document.getElementById('sizing-bar').style.display = 'none';
}
async function verificarAcao(acaoUsuario) {
    try {
        const resposta = await fetch('http://localhost:8000/avaliar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                mao: estadoJogo.mao, 
                board: estadoJogo.board,
                acao_vilao: acaoVilaoAtual 
            })
        });

        const analise = await resposta.json();

        if (analise.error || analise.sugestao === "ERRO_BACKEND") {
            ui.updateFeedback("⚠️ Backend Offline - Verifique o Terminal", "var(--gold)");
            return;
        }

        // Validação flexível: Se o solver diz RAISE e vc deu RAISE, ou diz BET e vc deu RAISE
        const acerto = analise.sugestao.includes(acaoUsuario) || 
                      (acaoUsuario === 'RAISE' && analise.sugestao.includes('BET'));

        if (acerto) {
            ui.updateFeedback(`✅ Correto! ${analise.mao_texto}`, "var(--green)");
            // Avança o jogo...
        } else {
            ui.updateFeedback(`❌ Erro! O Solver sugere ${analise.sugestao}`, "var(--red)");
        }
    } catch (e) {
        ui.updateFeedback("🔴 ERRO DE CONEXÃO: Inicie o main.py", "var(--red)");
    }
}