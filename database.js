/**
 * DATABASE.JS - Persistência e Integração Cloud
 */
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto.firebaseio.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "00000000",
    appId: "1:0000000:web:0000"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const dbService = {
    // Salva cada jogada realizada no treino
    salvarJogada(mao, posicao, acaoUsuario, correta) {
        const novaJogadaRef = db.ref('sessoes').push();
        novaJogadaRef.set({
            mao,
            posicao,
            acaoUsuario,
            correta,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    },

    // Busca dados para o Dashboard
    async buscarEstatisticas() {
        const snapshot = await db.ref('sessoes').once('value');
        return snapshot.val() || {};
    }
};