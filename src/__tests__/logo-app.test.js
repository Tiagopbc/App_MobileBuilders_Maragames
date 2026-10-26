// Em JavaScript, como o teste das cores: lê o arquivo com o Node.
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

// A logo do app, no alto da boas-vindas: um quadrado roxo de cantos redondos, com o lobo branco da
// Beast Maragames e a bandeira do Maranhão em miniatura na janela do controle. O lobo é o mesmo
// traço da logo roxa, só que branco.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const CAMINHO = join(IMAGENS, 'logo-app.svg');
const existe = existsSync(CAMINHO);
const svg = existe ? readFileSync(CAMINHO, 'utf8') : '';
const original = readFileSync(join(IMAGENS, 'logo-beast.svg'), 'utf8');

const tracosDe = (texto) => [...texto.matchAll(/<path[^>]* d="([^"]+)"/g)].map((m) => m[1]);
// O corpo do lobo é o traço mais longo da logo roxa: a cabeça com a janela do controle vazada.
const CORPO = tracosDe(original).reduce((maior, d) => (d.length > maior.length ? d : maior), '');

// Cada listra é um <rect> da largura da janela (478), de cima para baixo.
const listras = [...svg.matchAll(/<rect [^>]*width="478"[^>]*fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1].toUpperCase());

const ROXO = '#3B2781';
const VERMELHO = '#EB3238';
const BRANCO = '#FFFFFF';
const PRETO = '#201D1E';
const AZUL = '#012682';

it('o arquivo existe', () => {
    expect(existe).toBe(true);
});

it('é um quadrado roxo de cantos redondos', () => {
    expect(svg).toMatch(/viewBox="0 0 100 100"/);
    expect(svg).toMatch(new RegExp(`<rect width="100" height="100" rx="\\d+(\\.\\d+)?" fill="${ROXO}"/>`));
});

it('o lobo é o da logo roxa, em branco', () => {
    expect(svg).toContain(`<path fill="${BRANCO}" d="${CORPO}"/>`);
});

it('a janela do controle tem as nove listras da bandeira, de cima para baixo', () => {
    expect(listras).toEqual([VERMELHO, BRANCO, PRETO, BRANCO, VERMELHO, BRANCO, PRETO, BRANCO, VERMELHO]);
});

it('e o quadrado azul com a estrela branca no canto', () => {
    expect(svg).toMatch(new RegExp(`<rect [^>]*fill="${AZUL}"/>`));
    expect(svg).toMatch(new RegExp(`<polygon fill="${BRANCO}" points=`));
});

// O iOS e o Android desenham SVG por bibliotecas próprias, que não acompanham o navegador em tudo.
it('não usa recorte, degradê, <use> nem SVG dentro de SVG', () => {
    expect(svg).not.toMatch(/clipPath|Gradient|<use|<mask/);
    expect(svg.match(/<svg/g)).toHaveLength(1);
});
