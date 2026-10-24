// Em JavaScript, como o teste das cores: lê o arquivo com o Node.
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

// A logo da tela de boas-vindas: o lobo roxo de sempre sobre um círculo com as listras da bandeira
// do Maranhão (vermelho, branco e preto), de bordas suaves. O círculo já vem dentro do SVG.

const IMAGENS = join(__dirname, '..', '..', 'assets', 'images');
const CAMINHO = join(IMAGENS, 'logo-beast-maranhao.svg');
const existe = existsSync(CAMINHO);
const svg = existe ? readFileSync(CAMINHO, 'utf8') : '';
const original = readFileSync(join(IMAGENS, 'logo-beast.svg'), 'utf8');

const tracosDe = (texto) => [...texto.matchAll(/<path[^>]* d="([^"]+)"/g)].map((m) => m[1]);

it('o arquivo existe', () => {
    expect(existe).toBe(true);
});

it('mantém o lobo: todo traço da logo roxa está na do Maranhão', () => {
    const daMaranhao = new Set(tracosDe(svg));

    for (const traco of new Set(tracosDe(original))) {
        expect(daMaranhao.has(traco)).toBe(true);
    }
});

it('o lobo continua roxo, com a estrela vermelha e os detalhes lilás', () => {
    expect(svg).toContain('fill="#3c2782"');
    expect(svg).toContain('fill="#b9201f"');
    expect(svg).toContain('fill="#beb1d7"');
});

it('o círculo é pintado por um degradê com as três cores das listras', () => {
    const degrade = svg.match(/<linearGradient[\s\S]*?<\/linearGradient>/);

    expect(degrade).not.toBeNull();
    for (const cor of ['#C8102E', '#FFFFFF', '#101010']) {
        expect(degrade[0].toUpperCase()).toContain(cor);
    }
    expect(svg).toMatch(/<circle[^>]* fill="url\(#[^)]+\)"/);
});

it('as listras têm borda suave: cada cor se prolonga um pouco e depois se mistura com a vizinha', () => {
    const paradas = [...svg.matchAll(/<stop offset="([\d.]+)" stop-color="(#[0-9A-Fa-f]{6})"/g)].map((m) => ({
        deslocamento: Number(m[1]),
        cor: m[2].toUpperCase(),
    }));

    // Nove listras, cada uma com o começo e o fim do trecho de cor firme.
    expect(paradas).toHaveLength(18);
    // Nenhum corte seco: duas cores diferentes nunca ficam no mesmo ponto.
    for (let i = 1; i < paradas.length; i++) {
        if (paradas[i].cor !== paradas[i - 1].cor) {
            expect(paradas[i].deslocamento).toBeGreaterThan(paradas[i - 1].deslocamento);
        }
    }
});

it('o lobo tem o contorno branco fino que o separa das listras', () => {
    expect(svg).toMatch(/stroke="#FFFFFF"/);
    expect(svg).toMatch(/stroke-opacity="0\.9"/);
});

it('o círculo é 1,3 vez o lobo, como o da logo roxa', () => {
    expect(svg).toContain('viewBox="-162 -162 1404 1404"');
});

// O iOS e o Android desenham SVG por conta própria, com menos recursos que o navegador.
it('só usa recursos simples de SVG: sem <use>, estilo, variável nem paint-order', () => {
    for (const recurso of ['<use', 'style=', 'var(', 'paint-order', '<filter', '<mask']) {
        expect(svg).not.toContain(recurso);
    }
});
