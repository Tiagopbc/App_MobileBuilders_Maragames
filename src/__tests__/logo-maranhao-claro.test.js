// Em JavaScript, como o teste das cores: lê os arquivos com o Node.
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

// A logo da boas-vindas no tema claro: igual à do escuro, mas com um aro lilás em volta do círculo.
// No claro o fundo também é branco, e sem o aro o círculo some e o lobo fica solto na tela.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const CAMINHO = join(IMAGENS, 'logo-beast-maranhao-claro.svg');
const existe = existsSync(CAMINHO);
const claro = existe ? readFileSync(CAMINHO, 'utf8') : '';
const escuro = readFileSync(join(IMAGENS, 'logo-beast-maranhao.svg'), 'utf8');

const CIRCULO = /<circle[^>]*\/>/;

it('o arquivo existe', () => {
    expect(existe).toBe(true);
});

it('é a mesma logo do escuro: só o círculo muda', () => {
    expect(claro.replace(CIRCULO, '')).toBe(escuro.replace(CIRCULO, ''));
});

describe('o círculo', () => {
    const circulo = claro.match(CIRCULO);
    const atributo = (nome) => circulo && (circulo[0].match(new RegExp(`\\b${nome}="([^"]+)"`)) || [])[1];

    it('continua branco e no centro, mas ganha um aro lilás fino', () => {
        expect(circulo).not.toBeNull();
        expect(atributo('cx')).toBe('540');
        expect(atributo('cy')).toBe('540');
        expect(atributo('fill')).toBe('#FFFFFF');
        expect(atributo('stroke')).toBe('#CFC6E6');
        expect(atributo('stroke-width')).toBe('14');
    });

    // O aro é desenhado em cima da borda: raio mais meia espessura dá o mesmo círculo de antes (702),
    // e a logo não cresce nem é cortada pela caixa do desenho.
    it('com o aro, ocupa o mesmo espaço que o círculo do escuro', () => {
        expect(Number(atributo('r')) + Number(atributo('stroke-width')) / 2).toBe(702);
    });
});

it('só usa recursos simples de SVG: sem <use>, estilo, variável, recorte, degradê nem paint-order', () => {
    for (const recurso of ['<use', 'style=', 'var(', 'paint-order', '<filter', '<mask', 'clipPath', 'clip-path', 'Gradient']) {
        expect(claro).not.toContain(recurso);
    }
});
