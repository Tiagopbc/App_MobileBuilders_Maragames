// Em JavaScript, como o teste das cores: lê os arquivos com o Node.
const { Buffer } = require('buffer');
const { readFileSync } = require('fs');
const { join } = require('path');
const { inflateSync } = require('zlib');

// O padrão da Beast Maragames atrás das telas, no tema escuro: um ladrilho de 300 pt, que o
// `FundoDaMarca` repete. A opacidade dos itens (ícones, lobo e logo) fica no SVG de origem e já vem
// embutida nos três PNGs, que são os que o app usa. Este teste amarra os dois: trocar o valor no SVG
// sem gerar os PNGs de novo, ou o contrário, faz ele falhar.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const OPACIDADE = 0.15;

const svg = readFileSync(join(IMAGENS, 'fundo-escuro.svg'), 'utf8');

// Média e máximo do canal alfa de um PNG RGBA de 8 bits, sem entrelaçamento.
function alfaDoPng(arquivo) {
    const dados = readFileSync(join(IMAGENS, arquivo));
    let pos = 8;
    let largura = 0;
    let altura = 0;
    let tipo = 0;
    const partes = [];
    while (pos < dados.length) {
        const tamanho = dados.readUInt32BE(pos);
        const nome = dados.toString('ascii', pos + 4, pos + 8);
        const corpo = dados.subarray(pos + 8, pos + 8 + tamanho);
        if (nome === 'IHDR') {
            largura = corpo.readUInt32BE(0);
            altura = corpo.readUInt32BE(4);
            tipo = corpo[9];
        } else if (nome === 'IDAT') {
            partes.push(corpo);
        }
        pos += 12 + tamanho;
    }
    const cru = inflateSync(Buffer.concat(partes));
    const canais = 4;
    const passo = largura * canais;
    let anterior = Buffer.alloc(passo);
    let soma = 0;
    let maximo = 0;
    for (let y = 0; y < altura; y++) {
        const filtro = cru[y * (passo + 1)];
        const linha = Buffer.from(cru.subarray(y * (passo + 1) + 1, (y + 1) * (passo + 1)));
        for (let x = 0; x < passo; x++) {
            const a = x >= canais ? linha[x - canais] : 0;
            const b = anterior[x];
            const c = x >= canais ? anterior[x - canais] : 0;
            if (filtro === 1) linha[x] = (linha[x] + a) & 255;
            else if (filtro === 2) linha[x] = (linha[x] + b) & 255;
            else if (filtro === 3) linha[x] = (linha[x] + ((a + b) >> 1)) & 255;
            else if (filtro === 4) {
                const p = a + b - c;
                const pa = Math.abs(p - a);
                const pb = Math.abs(p - b);
                const pc = Math.abs(p - c);
                linha[x] = (linha[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
            }
        }
        for (let x = 3; x < passo; x += canais) {
            soma += linha[x];
            if (linha[x] > maximo) maximo = linha[x];
        }
        anterior = linha;
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
    ['fundo-escuro.png', 300],
    ['fundo-escuro@2x.png', 600],
    ['fundo-escuro@3x.png', 900],
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
