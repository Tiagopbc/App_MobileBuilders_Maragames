// Em JavaScript, como os testes que leem arquivos com o Node: os tipos do Node não entram no
// tsconfig para o código do app não poder usá-los por engano.
const { Buffer } = require('buffer');
const { readFileSync } = require('fs');
const { inflateSync } = require('zlib');

// Lê um PNG RGBA de 8 bits, sem entrelaçamento, e devolve os pixels já sem o filtro de cada linha:
// `pixels` tem 4 bytes (R, G, B, A) por ponto, linha após linha.
function lerPng(caminho) {
    const dados = readFileSync(caminho);
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
    const pixels = Buffer.alloc(altura * passo);
    let anterior = Buffer.alloc(passo);
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
        linha.copy(pixels, y * passo);
        anterior = linha;
    }
    return { largura, altura, tipo, pixels };
}

module.exports = { lerPng };
