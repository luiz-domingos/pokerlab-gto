/**
 * DASHBOARD.JS - Lógica de Gráficos e Estatísticas
 */

const dashboard = {
    chartAcertos: null,
    chartPosicoes: null,

    init() {
        this.renderAcertos();
        this.renderPosicoes();
    },

    // Gráfico de Pizza: Acertos vs Erros
    renderAcertos() {
        const ctx = document.getElementById('chart-acertos').getContext('2d');
        this.chartAcertos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Acertos', 'Erros'],
                datasets: [{
                    data: [85, 15], // Dados de teste
                    backgroundColor: ['#22c55e', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#888' } },
                    title: { display: true, text: 'Taxa de Acerto Geral', color: '#fff' }
                }
            }
        });
    },

    // Gráfico de Barras: Erros por Posição
    renderPosicoes() {
        const ctx = document.getElementById('chart-posicoes').getContext('2d');
        this.chartPosicoes = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'],
                datasets: [{
                    label: 'Frequência de Erros',
                    data: [2, 5, 3, 8, 12, 4], // Dados de teste
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#222' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888' } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Erros por Posição', color: '#fff' }
                }
            }
        });
    }
};

// Inicializa quando a aba de Dashboard for aberta (via ui.js)
// Por enquanto, vamos rodar ao carregar para teste
window.addEventListener('load', () => {
    if (document.getElementById('chart-acertos')) {
        dashboard.init();
    }
});