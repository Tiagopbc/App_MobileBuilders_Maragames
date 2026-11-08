// Em JavaScript, como os outros testes que leem imagens: o Node lê o arquivo.
const { join } = require('path');

const { lerPng } = require('../test/png');

// O lobinho da carta de jogador tem dois dentes. No arquivo original o branco deles estava quase
// transparente, e o fundo escuro da carta aparecia por dentro: os dentes saíam escuros. Este teste
// garante que o interior de cada dente é opaco e branco, como o resto do lobinho que não é vazado.

const { largura, altura, pixels } = lerPng(join(__dirname, '..', '..', 'assets', 'images', 'mascote-beast.png'));

const ponto = (x, y) => {
    const i = (y * largura + x) * 4;
    return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], alfa: pixels[i + 3] };
};

// O meio de cada dente, em pontos do arquivo de 615 por 815 (a proporção que a carta usa).
const DENTES = [
    { nome: 'de cima à esquerda', x: 238, y: 405 },
    { nome: 'de cima à direita', x: 331, y: 401 },
];

it('o arquivo continua com 615 por 815, a proporção que a carta usa', () => {
    expect([largura, altura]).toEqual([615, 815]);
});

describe.each(DENTES)('o dente $nome', ({ x, y }) => {
    it('é opaco no meio: o fundo da carta não aparece por dentro', () => {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) expect(ponto(x + dx, y + dy).alfa).toBe(255);
        }
    });

    it('é branco no meio', () => {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const { r, g, b } = ponto(x + dx, y + dy);
                expect(Math.min(r, g, b)).toBeGreaterThanOrEqual(240);
            }
        }
    });
});
