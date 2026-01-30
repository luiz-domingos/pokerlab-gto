/**
 * ENGINE.JS - O Coração do PokerLab (Orquestrador)
 */

let maoAtual = [];
let boardAtual = [];
let posicaoSua = "";
let acaoCorreta = "";
let hits = 0;
let errors = 0;

// Configuração do Backend Python
const PYTHON_URL = "http://localhost:8000/avaliar-posflop";

async function novoCenario() {
    // 1. Limpar Board e UI
    limparMesa();
    
    // 2. Gerar Mão e Posição (Simulando o Deck API ou Local)
    posicaoSua = ['UTG', 'MP', 'CO', 'BTN', 'SB'][Math.floor(Math.random() * 5)];
    maoAtual = gerarMaoAleatoria(); // Ex: ["As", "Kd"]
    
    // 3. Definir Ação Correta no Pré-Flop (Consultando ranges.js)
    acaoCorreta = consultarGTO(posicaoSua, maoAtual);

    // 4. Atualizar Visual
    ui.highlightPosition(posicaoSua);
    renderizarCartasJogador(maoAtual);
    ui.updateFeedback("Decida sua ação Pré-Flop...", "#fff");
}

function verificarAcao(acaoUsuario) {
    if (acaoUsuario === acaoCorreta) {
        hits++;
        document.getElementById('hits').innerText = hits;
        
        // SE ACERTOU E FOI CALL OU RAISE -> VAMOS PARA O FLOP
        if (acaoUsuario === 'CALL' || acaoUsuario === 'RAISE') {
            ui.updateFeedback("Correto! Indo para o Flop...", "var(--green)");
            setTimeout(iniciarPosFlop, 1000);
        } else {
            ui.updateFeedback("Fold Correto! Próxima mão.", "var(--green)");
            setTimeout(novoCenario, 1500);
        }
    } else {
        errors++;
        document.getElementById('errors').innerText = errors;
        ui.updateFeedback(`Erro! O correto era ${acaoCorreta}`, "var(--red)");
        setTimeout(novoCenario, 2000);
    }
}

async function iniciarPosFlop() {
    // 1. Gerar 3 cartas para o Flop
    boardAtual = gerarBoard(3);
    renderizarBoard(boardAtual);

    // 2. Chamar o Cérebro Python para analisar a força da mão
    ui.updateFeedback("Python analisando textura do bordo...", "var(--accent)");
    
    try {
        const analise = await consultarBackendPython(maoAtual, boardAtual);
        if (analise) {
            ui.updateFeedback(`Flop: ${analise.mao_texto} | Sugestão: ${analise.sugestao}`, "var(--accent)");
        }
    } catch (e) {
        ui.updateFeedback("Erro ao conectar com Backend Python", "var(--red)");
    }
}

// --- FUNÇÕES AUXILIARES ---

async function consultarBackendPython(mao, board) {
    const response = await fetch(PYTHON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mao: mao, board: board })
    });
    return await response.json();
}

function gerarMaoAleatoria() {
    const cartas = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
    const naipes = ['s', 'h', 'd', 'c'];
    return [
        cartas[Math.floor(Math.random()*13)] + naipes[Math.floor(Math.random()*4)],
        cartas[Math.floor(Math.random()*13)] + naipes[Math.floor(Math.random()*4)]
    ];
}

function gerarBoard(qtd) {
    const cartas = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
    const naipes = ['s', 'h', 'd', 'c'];
    let b = [];
    while(b.length < qtd) {
        let c = cartas[Math.floor(Math.random()*13)] + naipes[Math.floor(Math.random()*4)];
        if(!b.includes(c) && !maoAtual.includes(c)) b.push(c);
    }
    return b;
}

// Renderiza as cartas do jogador com Naipes
function renderizarCartasJogador(mao) {
    const naipesIcones = { 's': '♠️', 'h': '❤️', 'd': '♦️', 'c': '♣️' };
    
    mao.forEach((c, i) => {
        const el = document.getElementById(`card-v${i+1}`);
        const valor = c[0].replace('T','10');
        const naipe = c[1];
        
        el.innerHTML = `${valor}<span class="card-suit">${naipesIcones[naipe]}</span>`;
        el.className = `card-visual ${ (naipe === 'h' || naipe === 'd') ? 'txt-red' : 'txt-black' }`;
    });
}

// Renderiza o Board (Flop) com Naipes
function renderizarBoard(board) {
    const naipesIcones = { 's': '♠️', 'h': '❤️', 'd': '♦️', 'c': '♣️' };
    
    board.forEach((c, i) => {
        const el = document.getElementById(`flop-${i+1}`);
        const valor = c[0].replace('T','10');
        const naipe = c[1];
        
        el.innerHTML = `${valor}<span style="font-size: 14px; display: block;">${naipesIcones[naipe]}</span>`;
        el.className = `card-visual mini ${ (naipe === 'h' || naipe === 'd') ? 'txt-red' : 'txt-black' }`;
        el.style.display = "flex";
    });
}

// Mostra a aposta do Vilão ou a sua
function exibirAposta(valor, tipo = 'vilao') {
    const ficha = document.getElementById('ficha-vilao');
    const valorEl = document.getElementById('valor-bet');
    
    if (ficha && valorEl) {
        valorEl.innerText = valor + "bb";
        ficha.style.display = 'flex';
        // Se for a nossa aposta, podemos mudar a cor da ficha ou a posição no futuro
    }
}

function limparMesa() {
    boardAtual = [];
    for(let i=1; i<=3; i++) {
        const el = document.getElementById(`flop-${i}`);
        el.innerText = "";
        el.style.display = "none";
    }
    document.getElementById('turn').style.display = "none";
    document.getElementById('river').style.display = "none";
}

function consultarGTO(posicao, mao) {
    // 1. Organiza a mão (ex: 'As', 'Kd' -> 'AKs' ou 'AKo')
    const valor1 = mao[0][0];
    const valor2 = mao[1][0];
    const naipe1 = mao[0][1];
    const naipe2 = mao[1][1];
    
    // Ordem de força para o índice da tabela
    const ordem = "AKQJT98765432";
    let maoFormatada = "";
    
    if (ordem.indexOf(valor1) < ordem.indexOf(valor2)) {
        maoFormatada = valor1 + valor2 + (naipe1 === naipe2 ? 's' : 'o');
    } else {
        maoFormatada = valor2 + valor1 + (naipe1 === naipe2 ? 's' : 'o');
    }

    // 2. Consulta o objeto global 'ranges' (do seu arquivo ranges.js)
    if (ranges[posicao] && ranges[posicao].includes(maoFormatada)) {
        return "RAISE";
    }
    
    return "FOLD";
}
// No início do engine.js, garante que as apostas apareçam
let valorPote = 0;

function verificarAcao(acaoUsuario) {
    if (acaoUsuario === acaoCorreta || (boardAtual.length > 0)) {
        // Se estivermos no Pós-Flop, aceitamos a decisão e consultamos o Python
        if (boardAtual.length > 0) {
            processarDecisaoPosFlop(acaoUsuario);
            return;
        }

        hits++;
        document.getElementById('hits').innerText = hits;
        
        if (acaoUsuario === 'CALL' || acaoUsuario === 'RAISE') {
            ui.updateFeedback("Correto! Indo para o Flop...", "var(--green)");
            setTimeout(iniciarPosFlop, 1000);
        } else {
            ui.updateFeedback("Fold Correto!", "var(--green)");
            setTimeout(novoCenario, 1500);
        }
    } else {
        errors++;
        document.getElementById('errors').innerText = errors;
        ui.updateFeedback(`Erro! O correto era ${acaoCorreta}`, "var(--red)");
        setTimeout(novoCenario, 2000);
    }
}

async function iniciarPosFlop() {
    // 1. Mostrar o botão de CHECK que estava escondido
    document.getElementById('btn-check').style.display = 'block';
    
    // 2. Gerar Board e Renderizar (Com os naipes que corrigimos)
    boardAtual = gerarBoard(3);
    renderizarBoard(boardAtual);

    // 3. Chamar Python
    const analise = await consultarBackendPython(maoAtual, boardAtual);
    ui.updateFeedback(`Análise: ${analise.mao_texto}`, "var(--accent)");
    
    // Exibir aposta do vilão (ex: vilão deu check ou apostou)
    if(Math.random() > 0.5) {
        exibirAposta(0); // Vilão deu Check
        ui.updateFeedback("Vilão deu Check. Sua vez.", "white");
    } else {
        exibirAposta(2.5); // Vilão apostou 2.5bb
        ui.updateFeedback("Vilão apostou 2.5bb. Fold, Call ou Raise?", "white");
    }
    document.getElementById('sizing-bar').style.display = 'flex';
document.getElementById('btn-check').style.display = 'block';
document.getElementById('btn-raise').innerText = 'BET'; // Muda o texto de Raise para Bet
}

// Limpar mesa precisa esconder o Check para o próximo Pré-Flop
function limparMesa() {
    boardAtual = [];
    document.getElementById('btn-check').style.display = 'none';
    document.getElementById('ficha-vilao').style.display = 'none';
    // ... restante do código de limpar cartas
}
function renderizarCartasJogador(mao) {
    const icones = { 's': '♠', 'h': '♥', 'd': '♦', 'c': '♣' };
    mao.forEach((c, i) => {
        const el = document.getElementById(`card-v${i+1}`);
        const valor = c[0].replace('T','10');
        const naipe = c[1];
        
        el.innerHTML = `<div>${valor}</div><div class="card-suit">${icones[naipe]}</div>`;
        el.className = `card-visual ${ (naipe === 'h' || naipe === 'd') ? 'txt-red' : 'txt-black' }`;
    });
}
async function consultarBrainPython(mao, board, pote) {
    const isIP = (posicaoSua !== 'SB' && posicaoSua !== 'BB'); // Simplificação de posição
    
    const response = await fetch('http://localhost:8000/avaliar-posflop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mao: mao, 
            board: board, 
            pote: pote,
            em_posicao: isIP,
            acao_vilao: 'CHECK' // Aqui você pode alternar conforme o cenário
        })
    });
    return await response.json();

}
async function processarDecisaoPosFlop() {
    let poteAtual = parseFloat(document.getElementById('valor-pote').innerText);
    
    // Mostra o feedback de "Pensando..."
    ui.updateFeedback("PyPoker analisando equidade...", "var(--accent)");

    const response = await fetch('http://localhost:8000/avaliar-posflop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mao: maoAtual, 
            board: boardAtual, 
            pote: poteAtual,
            posicao: posicaoSua
        })
    });

    const data = await response.json();
    
    // Atualiza a tela com a matemática real
    ui.updateFeedback(
        `Equidade: ${data.equidade}% | Sugestão: ${data.sugestao}`, 
        data.cor
    );
}