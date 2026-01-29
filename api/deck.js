const deckAPI = {
    naipes: [
        { s: '♠️', c: 'txt-black' }, { s: '♥️', c: 'txt-red' },
        { s: '♣️', c: 'txt-black' }, { s: '♦️', c: 'txt-red' }
    ],
    renderizar(mao) {
        const c1 = document.getElementById('card-v1'), c2 = document.getElementById('card-v2');
        const v1 = mao[0], v2 = mao[1], isSuited = mao.endsWith('s');
        
        let n1 = this.naipes[0], n2 = isSuited ? this.naipes[0] : this.naipes[1];
        if (v1 === v2) n2 = this.naipes[1];

        c1.innerHTML = `${v1}<div class="card-suit">${n1.s}</div>`;
        c1.className = `card-visual ${n1.c}`;
        c2.innerHTML = `${v2}<div class="card-suit">${n2.s}</div>`;
        c2.className = `card-visual ${n2.c}`;
    }
};