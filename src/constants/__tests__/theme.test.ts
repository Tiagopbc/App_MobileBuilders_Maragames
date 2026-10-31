import { Colors, Fonts, Raio, Relevo, Tipo, type ThemeColor } from '../theme';

// Contraste entre duas cores, pela fórmula da WCAG 2: de 1 (iguais) a 21 (preto no branco).
function luminancia(hex: string): number {
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
    const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (clara + 0.05) / (escura + 0.05);
}

const TEXTO = 4.5; // mínimo para texto de tamanho normal
const CONTORNO = 3; // mínimo para borda que carrega significado

// Só os pares que as telas usam de verdade: [o que se lê, sobre o quê].
const PARES_DE_TEXTO: [ThemeColor, ThemeColor][] = [
    ['text', 'background'],
    ['text', 'backgroundElement'],
    ['text', 'backgroundSelected'],
    ['textSecondary', 'background'],
    ['textSecondary', 'backgroundElement'],
    ['primaria', 'background'],
    ['primaria', 'backgroundElement'],
    ['textoDoBotao', 'botao'],
    // As cores de estado e de quadrante aparecem como texto e ícone, não só como fundo.
    ['sucesso', 'background'],
    ['sucesso', 'backgroundElement'],
    ['aviso', 'background'],
    ['aviso', 'backgroundElement'],
    ['lacuna', 'background'],
    ['lacuna', 'backgroundElement'],
    ['erro', 'background'],
    ['erro', 'backgroundElement'],
    // Os cards com relevo (alternativa, confiança, feedback e botão secundário).
    ['text', 'cartao'],
    ['text', 'cartaoSelecionado'],
    ['text', 'fundoCerta'],
    ['text', 'fundoErrada'],
    ['primaria', 'cartao'],
    ['textoDaLetra', 'fundoDaLetra'],
    ['sucesso', 'fundoCerta'],
    ['erro', 'fundoErrada'],
    // Os botões Violeta com halo: o texto branco tem de ler em todo o degradê.
    ['textoDoBotao', 'botaoTopo'],
    ['textoDoBotao', 'botaoMeio'],
    ['textoDoBotao', 'botaoBase'],
    ['primaria', 'secundarioTopo'],
    ['primaria', 'secundarioBase'],
    // A carta de jogo do cartão de conceito.
    ['text', 'placaDaCarta'],
    ['text', 'caixaDaCarta'],
    ['textoDoPe', 'cartao'],
    // Texto de apoio, realce, fundo apagado e botão desativado.
    ['textoDeApoio', 'background'],
    ['textoDeApoio', 'cartao'],
    ['textoDeApoio', 'fundoFirme'],
    ['textoDeApoio', 'fundoFragil'],
    ['textoDeApoio', 'fundoPontoCego'],
    ['textoDeApoio', 'fundoLacuna'],
    ['text', 'realce'],
    ['textSecondary', 'fundoApagado'],
    ['textSecondary', 'botaoDesabilitado'],
    // O fundo de cada quadrante, com o texto e a cor do próprio quadrante por cima.
    ['text', 'fundoFirme'],
    ['text', 'fundoFragil'],
    ['text', 'fundoPontoCego'],
    ['text', 'fundoLacuna'],
    ['sucesso', 'fundoFirme'],
    ['aviso', 'fundoFragil'],
    ['erro', 'fundoPontoCego'],
    ['lacuna', 'fundoLacuna'],
];

const PARES_DE_CONTORNO: [ThemeColor, ThemeColor][] = [
    ['bordaSelecionada', 'background'],
    ['bordaSelecionada', 'backgroundElement'],
    ['bordaSelecionada', 'backgroundSelected'],
    ['bordaSelecionada', 'cartao'],
    ['bordaSelecionada', 'cartaoSelecionado'],
];

describe.each(['light', 'dark'] as const)('tema %s', (tema) => {
    const cores = Colors[tema];

    it('toda cor é um hexadecimal de seis dígitos', () => {
        for (const cor of Object.values(cores)) {
            expect(cor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
    });

    it.each(PARES_DE_TEXTO)('%s sobre %s dá para ler', (frente, fundo) => {
        expect(contraste(cores[frente], cores[fundo])).toBeGreaterThanOrEqual(TEXTO);
    });

    it.each(PARES_DE_CONTORNO)('%s se destaca de %s', (frente, fundo) => {
        expect(contraste(cores[frente], cores[fundo])).toBeGreaterThanOrEqual(CONTORNO);
    });
});

describe('a identidade da Beast Maragames', () => {
    it('o botão principal é o roxo da marca', () => {
        expect(Colors.light.botao).toBe('#3B2781');
    });

    it('a fonte é a Lexend, uma família por peso', () => {
        expect(Fonts).toMatchObject({
            regular: 'Lexend_400Regular',
            medium: 'Lexend_500Medium',
            semibold: 'Lexend_600SemiBold',
            bold: 'Lexend_700Bold',
        });
    });

    it('a borda de baixo dos cards soma 5 no escuro e 4 no claro (1,5 + o relevo)', () => {
        expect(1.5 + Relevo.dark.espessura).toBe(5);
        expect(1.5 + Relevo.light.espessura).toBe(4);
        expect(Relevo.light).toEqual({ espessura: 2.5, afunda: 2 });
    });

    it('o card apertado desce 3 pt no escuro e 2 pt no claro', () => {
        expect(Relevo.dark.afunda).toBe(3);
        expect(Relevo.light.afunda).toBe(2);
    });

    it('no claro, o fundo é lilás e os cards são brancos, com o relevo lilás embaixo', () => {
        expect(Colors.light).toMatchObject({
            background: '#F5F3FA',
            backgroundElement: '#FFFFFF',
            cartao: '#FFFFFF',
            bordaDoCartao: '#D9D1EB',
            relevoDoCartao: '#C2B6DD',
            cartaoSelecionado: '#EDE7F8',
        });
    });

    it('no claro, o botão principal é um degradê do roxo vivo ao roxo da marca, com relevo', () => {
        expect(Colors.light).toMatchObject({
            botaoTopo: '#5A3FB2',
            botaoMeio: '#47309C',
            botaoBase: '#3B2781',
            relevoDoBotao: '#24105A',
        });
    });

    it('o secundário tem a cor do relevo própria, e no escuro ela repete a borda de hoje', () => {
        expect(Colors.light.relevoDoSecundario).toBe('#C2B6DD');
        expect(Colors.dark.relevoDoSecundario).toBe(Colors.dark.bordaDoSecundario);
    });

    it('os dois temas têm os mesmos nomes de cor', () => {
        expect(Object.keys(Colors.dark).sort()).toEqual(Object.keys(Colors.light).sort());
    });

    it('os raios têm nome: letra, médio, botão, card, carta, folha e selo', () => {
        expect(Raio).toEqual({ letra: 8, medio: 12, botao: 14, card: 16, carta: 18, folha: 24, selo: 999 });
    });

    it('a tipografia tem os oito tamanhos nomeados, e nenhum abaixo de 12', () => {
        expect(Object.keys(Tipo)).toEqual(['display', 'titulo', 'destaque', 'enunciado', 'corpo', 'legenda', 'rotulo', 'mini']);
        for (const estilo of Object.values(Tipo)) {
            expect(estilo.tamanho).toBeGreaterThanOrEqual(12);
            expect(estilo.linha).toBeGreaterThan(estilo.tamanho);
            expect(['regular', 'semibold', 'bold']).toContain(estilo.peso);
        }
    });

    it('o texto do corpo é 16/24 e o menor é 12/16', () => {
        expect(Tipo.corpo).toMatchObject({ tamanho: 16, linha: 24 });
        expect(Tipo.mini).toMatchObject({ tamanho: 12, linha: 16 });
    });
});
