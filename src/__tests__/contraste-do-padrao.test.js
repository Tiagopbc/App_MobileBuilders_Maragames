// Em JavaScript, como o teste do padrão: lê o PNG com o Node.
const { join } = require('path');

const { Colors } = require('../constants/theme');
const { lerPng } = require('../test/png');

// O texto que fica direto sobre o fundo (sem card) também fica sobre o padrão. O ponto mais
// difícil de ler é onde um item do ladrilho cai atrás do texto: aqui ele é o pixel mais escuro
// (no claro) ou mais claro (no escuro) do ladrilho já composto sobre a cor de fundo do tema. Se o
// texto passa nos dois extremos, passa em qualquer ponto do padrão.

const LADRILHO = join(__dirname, '..', '..', 'assets', 'images', 'fundo-da-marca.png');

const canal = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminancia = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const contraste = (a, b) => {
    const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (claro + 0.05) / (escuro + 0.05);
};

// A luminância mínima e a máxima do ladrilho composto sobre o fundo.
function extremos(fundoHex) {
    const fundo = rgb(fundoHex);
    const { pixels } = lerPng(LADRILHO);
    let minimo = null;
    let maximo = null;
    for (let i = 0; i < pixels.length; i += 4) {
        const alfa = pixels[i + 3] / 255;
        const ponto = [0, 1, 2].map((c) => pixels[i + c] * alfa + fundo[c] * (1 - alfa));
        const l = luminancia(ponto);
        if (minimo === null || l < minimo.l) minimo = { l, ponto };
        if (maximo === null || l > maximo.l) maximo = { l, ponto };
    }
    return [minimo.ponto, maximo.ponto];
}

// Texto (4,5:1) e contorno de seleção (3:1), como no teste do tema.
const TEXTOS = ['text', 'textSecondary', 'textoDeApoio', 'primaria', 'lacuna'];
const CONTORNOS = ['bordaSelecionada'];

describe.each([
    ['claro', Colors.light],
    ['escuro', Colors.dark],
])('o padrão no tema %s', (_nome, cores) => {
    const pontos = extremos(cores.background);

    it.each(TEXTOS)('o texto %s passa de 4,5:1 sobre o ponto mais difícil do padrão', (nome) => {
        for (const ponto of pontos) expect(contraste(rgb(cores[nome]), ponto)).toBeGreaterThanOrEqual(4.5);
    });

    it.each(CONTORNOS)('o contorno %s passa de 3:1 sobre o ponto mais difícil do padrão', (nome) => {
        for (const ponto of pontos) expect(contraste(rgb(cores[nome]), ponto)).toBeGreaterThanOrEqual(3);
    });
});
