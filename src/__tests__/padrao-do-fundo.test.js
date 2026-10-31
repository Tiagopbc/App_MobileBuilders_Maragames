// Em JavaScript, como o teste das cores: lê os arquivos com o Node.
const { readFileSync } = require('fs');
const { join } = require('path');

const { lerPng } = require('../test/png');

// O padrão da Beast Maragames atrás das telas, nos dois temas: um ladrilho de 300 pt, que o
// `FundoDaMarca` repete. A opacidade dos itens (ícones, lobo e logo) fica no SVG de origem e já vem
// embutida nos três PNGs, que são os que o app usa. Este teste amarra os dois: trocar o valor no SVG
// sem gerar os PNGs de novo, ou o contrário, faz ele falhar.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const OPACIDADE = 0.15;

const svg = readFileSync(join(IMAGENS, 'fundo-da-marca.svg'), 'utf8');

// Média e máximo do canal alfa de um PNG RGBA.
function alfaDoPng(arquivo) {
    const { largura, altura, tipo, pixels } = lerPng(join(IMAGENS, arquivo));
    let soma = 0;
    let maximo = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        soma += pixels[i];
        if (pixels[i] > maximo) maximo = pixels[i];
    }
    return { largura, altura, tipo, media: soma / (largura * altura), maximo };
}

describe('o SVG de origem', () => {
    const valores = [...svg.matchAll(/\b(?:fill-)?opacity="([\d.]+)"/g)].map((m) => Number(m[1]));

    it('tem itens com opacidade', () => {
        expect(valores.length).toBeGreaterThan(0);
    });

    it(`todos os itens usam a opacidade ${OPACIDADE}`, () => {
        for (const valor of valores) expect(valor).toBeCloseTo(OPACIDADE, 5);
    });
});

describe.each([
    ['fundo-da-marca.png', 300],
    ['fundo-da-marca@2x.png', 600],
    ['fundo-da-marca@3x.png', 900],
])('o ladrilho %s', (arquivo, lado) => {
    const png = alfaDoPng(arquivo);

    it(`tem ${lado} por ${lado} pixels, com canal de transparência`, () => {
        expect(png.largura).toBe(lado);
        expect(png.altura).toBe(lado);
        expect(png.tipo).toBe(6);
    });

    // A média do alfa acompanha a opacidade: medida nos PNGs, dá cerca de 17,7 vezes o valor
    // (1,8 com 0,10 e 3,5 com 0,20). Com a margem de 15%, um PNG de outra opacidade não passa.
    it('está desenhado com a opacidade do SVG, e não com outra', () => {
        const esperada = OPACIDADE * 17.7;
        expect(png.media).toBeGreaterThan(esperada * 0.85);
        expect(png.media).toBeLessThan(esperada * 1.15);
    });

    // Itens que se sobrepõem somam: dois a 0,15 dão cerca de 0,28 (71 de 255), nunca mais que isso.
    it('nenhum ponto passa do que dois itens sobrepostos dão', () => {
        const doisItens = Math.round((1 - (1 - OPACIDADE) ** 2) * 255);
        expect(png.maximo).toBeGreaterThanOrEqual(Math.round(OPACIDADE * 255) - 2);
        expect(png.maximo).toBeLessThanOrEqual(doisItens + 8);
    });
});
