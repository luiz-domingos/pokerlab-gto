const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
let maoAtual = "", posicaoSua = "", posicaoVilao = "", acaoCorreta = "";
let acertos = 0, erros = 0;
const todasAsMaos = [];

window.onload = function() {
    gerarGrid();
};

function gerarGrid() {
    const gridConsulta = document.getElementById('grid-consulta');
    if (!gridConsulta) return;
    gridConsulta.innerHTML = "";
    for (let r = 0; r < 13; r++) {
        for (let c = 0; c < 13; c++) {
            const cell = document.createElement('div');
            let hand = (r === c) ? ranks[r]+ranks[c] : (r < c) ? ranks[r]+ranks[c]+'s' : ranks[c]+ranks[r]+'o';
            cell.className = 'cell';
            cell.innerText = hand;
            cell.id = "grid-" + hand;
            gridConsulta.appendChild(cell);
            todasAsMaos.push(hand);
        }
    }
}

function trocarAba(idAba) {
    document.querySelectorAll('.tab-content').forEach(aba => aba.classList.remove('active'));
    document.getElementById(idAba).classList.add('active');
}

function marcarRange(posicao) {
    limparGrid();
    const range = ranges.RFI[posicao]; // Note: Usando ranges.RFI aqui
    if (range) {
        range.forEach(hand => {
            const el = document.getElementById("grid-" + hand);
            if (el) el.classList.add('raise');
        });
    }
}

function limparGrid() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('raise'));
}

function novoCenario() {
    const posicoes = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
    posicaoSua = posicoes[Math.floor(Math.random() * posicoes.length)];
    
    const indexSua = posicoes.indexOf(posicaoSua);
    const agressores = posicoes.slice(0, indexSua);
    const displayVilao = document.getElementById('acao-vilao');

    if (agressores.length > 0 && Math.random() > 0.5) {
        posicaoVilao = agressores[Math.floor(Math.random() * agressores.length)];
        displayVilao.innerText = `🚨 ${posicaoVilao} deu Raise`;
        displayVilao.style.color = "#ef4444";
        definirAcaoCorreta("DEFESA");
    } else {
        posicaoVilao = null;
        displayVilao.innerText = "✅ Mesa em FOLD";
        displayVilao.style.color = "#94a3b8";
        definirAcaoCorreta("RFI");
    }

    maoAtual = todasAsMaos[Math.floor(Math.random() * todasAsMaos.length)];
    document.getElementById('display-mao').innerText = maoAtual;
    document.getElementById('txt-posicao').innerText = posicaoSua;
    
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('active-pos'));
    document.getElementById('pos-' + posicaoSua).classList.add('active-pos');
}

function definirAcaoCorreta(tipo) {
    if (tipo === "RFI") {
        acaoCorreta = (ranges.RFI[posicaoSua] || []).includes(maoAtual) ? "RAISE" : "FOLD";
    } else {
        const cenario = (ranges.DEFESA[`${posicaoSua}_vs_${posicaoVilao}`]) || { "3BET": [], "CALL": [] };
        if (cenario["3BET"].includes(maoAtual)) acaoCorreta = "RAISE";
        else if (cenario["CALL"].includes(maoAtual)) acaoCorreta = "CALL";
        else acaoCorreta = "FOLD";
    }
}

function verificar(acao) {
    if (!maoAtual) return;
    const feedback = document.getElementById('feedback');
    if (acao === acaoCorreta) {
        acertos++;
        document.getElementById('hits').innerText = acertos;
        feedback.innerText = "Boa!"; feedback.style.color = "#22c55e";
    } else {
        erros++;
        document.getElementById('errors').innerText = erros;
        feedback.innerText = `Erro! Era ${acaoCorreta}`; feedback.style.color = "#ef4444";
    }
    setTimeout(novoCenario, 1500);
}