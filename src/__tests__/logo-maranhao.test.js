// Em JavaScript, como o teste das cores: lê o arquivo com o Node.
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

// A logo da tela de boas-vindas: o lobo roxo de sempre, sobre o círculo branco, com a bandeira do
// Maranhão em miniatura na janela do controle, no lugar da estrela vermelha. O círculo já vem
// dentro do SVG.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const CAMINHO = join(IMAGENS, 'logo-beast-maranhao.svg');
const existe = existsSync(CAMINHO);
const svg = existe ? readFileSync(CAMINHO, 'utf8') : '';
const original = readFileSync(join(IMAGENS, 'logo-beast.svg'), 'utf8');

const tracosDe = (texto) => [...texto.matchAll(/<path[^>]* d="([^"]+)"/g)].map((m) => m[1]);
// A estrela da logo roxa é o primeiro traço do arquivo; a bandeira a substitui.
const ESTRELA_VERMELHA = tracosDe(original)[0];

// Cada listra é um <rect> da largura da janela (478), de cima para baixo.
const listras = [...svg.matchAll(/<rect [^>]*width="478"[^>]*fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1].toUpperCase());

const VERMELHO = '#C8102E';
const BRANCO = '#FFFFFF';
const PRETO = '#101010';
const AZUL = '#1E4FA3';

it('o arquivo existe', () => {
    expect(existe).toBe(true);
});

it('mantém o lobo: todo traço da logo roxa está na do Maranhão, menos a estrela vermelha', () => {
    const daMaranhao = new Set(tracosDe(svg));

    for (const traco of new Set(tracosDe(original))) {
        if (traco !== ESTRELA_VERMELHA) expect(daMaranhao.has(traco)).toBe(true);
    }
});

it('a estrela vermelha sai: quem aparece na janela é a bandeira', () => {
    expect(tracosDe(svg)).not.toContain(ESTRELA_VERMELHA);
    expect(svg).not.toContain('#b9201f');
});

it('o lobo continua roxo, com as orelhas lilás e o contorno branco fino', () => {
    expect(svg).toContain('fill="#3c2782"');
    expect(svg).toContain('fill="#beb1d7"');
    expect(svg).toMatch(/stroke="#FFFFFF"/);
    expect(svg).toMatch(/stroke-opacity="0\.9"/);
});

it('o círculo é branco, como o da logo roxa, e 1,3 vez o lobo', () => {
    expect(svg).toContain('viewBox="-162 -162 1404 1404"');
    expect(svg).toMatch(/<circle[^>]* r="702"[^>]* fill="#FFFFFF"/);
});

describe('o tamanho do lobo no círculo', () => {
    // Tudo o que é do lobo, com a bandeira da janela, fica num grupo só, ampliado a partir do
    // centro do círculo. O círculo fica de fora, no tamanho de sempre.
    const ESCALA = 1.44;
    const GRUPO = `<g transform="translate(540 540) scale(${ESCALA}) translate(-540 -540)">`;

    it('é 44% maior que na logo roxa, e só o lobo cresce, não o círculo', () => {
        const circulo = svg.indexOf('<circle');
        const grupo = svg.indexOf(GRUPO);

        expect(grupo).toBeGreaterThan(circulo);
        expect(svg.indexOf('width="478"')).toBeGreaterThan(grupo);
        expect(svg.indexOf('id="nariz"')).toBeGreaterThan(grupo);
        expect(svg.endsWith('</g></svg>')).toBe(true);
        expect(svg.match(/<circle/g)).toHaveLength(1);
    });

    it('continua dentro do círculo, com folga para o contorno', () => {
        // O ponto do lobo mais longe do centro (540, 540) são as pontas das orelhas: 459 na logo
        // roxa, medido no contorno do desenho. O contorno branco passa metade da espessura (7) para fora.
        const maisLonge = 459;
        const meioContorno = 7;
        const raio = 702;

        expect((maisLonge + meioContorno) * ESCALA).toBeLessThan(raio);
    });
});

describe('a bandeira na janela do controle', () => {
    it('tem as nove listras, na contagem oficial: quatro brancas, três vermelhas e duas pretas', () => {
        expect(listras).toHaveLength(9);
        expect(listras.filter((c) => c === BRANCO)).toHaveLength(4);
        expect(listras.filter((c) => c === VERMELHO)).toHaveLength(3);
        expect(listras.filter((c) => c === PRETO)).toHaveLength(2);
    });

    // A bandeira oficial só descreve a contagem, e não a ordem: esta é a que sai dela, com as
    // listras alternadas e o vermelho nas pontas. Se a ordem mudar, é só trocar aqui e no SVG.
    it('as listras alternam, de cima para baixo, com o vermelho nas pontas', () => {
        expect(listras).toEqual([VERMELHO, BRANCO, PRETO, BRANCO, VERMELHO, BRANCO, PRETO, BRANCO, VERMELHO]);
    });

    it('tem o cantão azul no alto, à esquerda, com a estrela branca de cinco pontas', () => {
        const cantao = svg.match(/<rect [^>]*width="159"[^>]*fill="(#[0-9A-Fa-f]{6})"/);
        const estrela = svg.match(/<polygon[^>]* fill="#FFFFFF"[^>]* points="([^"]+)"/);

        expect(cantao[1].toUpperCase()).toBe(AZUL);
        expect(estrela[1].trim().split(/\s+/)).toHaveLength(10);
    });

    // Sem recorte, o que segura a bandeira dentro da janela é a ordem: ela vai por baixo do lobo,
    // que a esconde em volta. O nariz também é um buraco no lobo, e o branco do círculo o repinta.
    it('fica por baixo do lobo, e o nariz é repintado de branco por cima da bandeira', () => {
        const primeiraListra = svg.indexOf('width="478"');
        const remendoDoNariz = svg.indexOf('id="nariz"');
        const corpoDoLobo = svg.indexOf('fill="#3c2782"');

        expect(primeiraListra).toBeGreaterThan(-1);
        expect(remendoDoNariz).toBeGreaterThan(primeiraListra);
        expect(corpoDoLobo).toBeGreaterThan(remendoDoNariz);
    });
});

// O iOS e o Android desenham SVG por conta própria, com menos recursos que o navegador.
it('só usa recursos simples de SVG: sem <use>, estilo, variável, recorte, degradê nem paint-order', () => {
    for (const recurso of ['<use', 'style=', 'var(', 'paint-order', '<filter', '<mask', 'clipPath', 'clip-path', 'Gradient']) {
        expect(svg).not.toContain(recurso);
    }
});
