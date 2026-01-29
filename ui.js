/**
 * UI.JS - Gerenciamento da Interface e Feedback Visual
 */

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

window.onload = function() {
    ui.gerarGridConsulta();
};

const ui = {
    // Troca entre Tabelas, Treinador e Lab
    trocarAba: function(id) {
        document.querySelectorAll('.tab-content').forEach(aba => aba.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    // Gera a tabela 13x13 na aba de consulta
    gerarGridConsulta: function() {
        const grid = document.getElementById('grid-consulta');
        if (!grid) return;
        grid.innerHTML = "";
        for (let r = 0; r < 13; r++) {
            for (let c = 0; c < 13; c++) {
                const cell = document.createElement('div');
                let hand = (r === c) ? ranks[r]+ranks[c] : (r < c) ? ranks[r]+ranks[c]+'s' : ranks[c]+ranks[r]+'o';
                cell.className = 'cell';
                cell.innerText = hand;
                cell.id = "grid-" + hand;
                grid.appendChild(cell);
            }
        }
    },

    // Marca o range selecionado na tabela (RFI)
    marcarRange: function(pos) {
        this.limparGrid();
        // Nota: O engine.js pode expandir ranges com "+", aqui usamos a lista direta
        const range = ranges.RFI[pos] || [];
        range.forEach(h => {
            const el = document.getElementById("grid-" + h);
            if (el) el.classList.add('raise-cell');
        });
    },

    limparGrid: function() {
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('raise-cell'));
    },

    // --- FUNÇÕES REQUISITADAS PELA ENGINE ---

    // Atualiza o texto de feedback (Acertou/Errou + Equity)
    updateFeedback: function(msg, color) {
        const feedEl = document.getElementById('feedback-treino');
        if (feedEl) {
            feedEl.innerText = msg;
            feedEl.style.color = color;
        }
    },

    // Mostra/Esconde a ficha e a ação do vilão na mesa
    updateVillainAction: function(msg, color, showFicha) {
        const ficha = document.getElementById('ficha-vilao');
        const legenda = document.getElementById('acao-vilao');
        
        if (ficha) ficha.style.display = showFicha ? 'flex' : 'none';
        if (legenda) {
            legenda.innerText = msg;
            legenda.style.color = color;
        }
    },

    // Destaca o slot do jogador que deve agir
    highlightPosition: function(pos) {
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('active-pos'));
        const slotAtivo = document.getElementById('pos-' + pos);
        if (slotAtivo) slotAtivo.classList.add('active-pos');
    }
};

// Atalhos globais para os botões do HTML continuarem funcionando
function trocarAba(id) { ui.trocarAba(id); }
function marcarRange(pos) { ui.marcarRange(pos); }
function limparGrid() { ui.limparGrid(); }