import { userEvent, waitFor, within } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

import {
    DESCRICAO_QUADRANTE,
    NIVEIS_DE_CONFIANCA,
    ROTULO_CONFIANCA,
    ROTULO_QUADRANTE,
    formatarPontos,
} from '@/constants/textos';
import { Colors } from '@/constants/theme';
import { xpDaResposta } from '@/lib/xp';
import { escolherTema } from '@/lib/tema';
import type { RepositorioFalso } from '@/test/repositorio-falso';
import { repositorio } from '@/data/repositorio';

// Este teste fica fora de `src/app` de propósito: lá dentro, todo arquivo vira rota.

// Quem já entrou e tem o perfil completo: é o único estado que chega à tela de boas-vindas.
jest.mock('@/lib/session', () => ({
    SessionProvider: ({ children }: { children: unknown }) => children,
    useSession: () => ({
        user: { uid: 'u1' },
        perfil: {
            uid: 'u1',
            nome: 'Paulo Souza',
            apelido: 'Paulo',
            email: 'paulo@exemplo.com',
            telefone: '98987654321',
            instituicao: 'UNDB',
            curso: 'Engenharia de Software',
            experiencia: 'iniciante',
            formaPre: 'A',
            consentiuEm: 500,
        },
        perfilCompleto: true,
        isLoading: false,
        sair: jest.fn(),
    }),
}));

// A home, que o Jogar abre, lê as lições pelo repositório; aqui ele é o da memória.
jest.mock('@/data/repositorio', () => {
    const { RepositorioFalso } = require('@/test/repositorio-falso');
    return { repositorio: new RepositorioFalso() };
});

jest.mock('expo-splash-screen', () => ({
    preventAutoHideAsync: jest.fn(),
    hide: jest.fn(),
}));

jest.mock('expo-font', () => ({
    ...jest.requireActual('expo-font'),
    useFonts: jest.fn(),
}));

const repo = repositorio as unknown as RepositorioFalso;

beforeEach(() => {
    (useFonts as jest.Mock).mockReturnValue([true, null]);
    repo.reiniciar();
    repo.licoes = [{ id: 'licao_mda', title: 'Framework MDA', order: 1, topicId: 'mda' }];
    repo.questoes = [
        {
            id: 'mda_p1',
            lessonId: 'licao_mda',
            topicId: 'mda',
            order: 1,
            bloco: 'pratica',
            dificuldade: 'basico',
            formato: 'multipla_escolha',
            enunciado: 'Enunciado',
            alternativas: [
                { id: 'a', texto: 'Certa', correta: true, explicacao: '' },
                { id: 'b', texto: 'Errada', correta: false, explicacao: '' },
            ],
            fonte: null,
            versaoConteudo: 'v1',
        },
    ];
});

afterEach(async () => {
    await escolherTema('sistema');
    jest.restoreAllMocks();
});

// Uma prática certa, com certeza e de hoje: vale +3 de XP e abre a sequência em 1 dia.
function respondidaHoje() {
    repo.respostas.push({
        id: 'r1',
        uid: 'u1',
        questionId: 'mda_p1',
        topicId: 'mda',
        attemptId: 't0',
        fase: 'pratica',
        escolha: 'a',
        ordemExibida: ['a', 'b'],
        correta: true,
        confianca: 3,
        tempoMs: 1,
        respondidaEm: Date.now(),
    });
}

async function abrirEm(url: string) {
    const rotas = await renderRouter('./src/app', { initialUrl: url });
    return { caminho: () => rotas.getPathname() };
}

describe('a tela de boas-vindas', () => {
    it('é a primeira de quem já entrou: o nome do app, o Jogar e o link das Regras do jogo', async () => {
        const rotas = await abrirEm('/');

        expect(await screen.findByText('Maragames App')).toBeOnTheScreen();
        expect(screen.getByText('by Tiago Cavalcanti')).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: 'Regras do jogo' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });

    it('a logo é a do app, e o leitor de tela a chama pelo nome da marca', async () => {
        await abrirEm('/');

        const logo = await screen.findByTestId('logo-app');
        expect(logo.props.source).toEqual([require('@/assets/images/logo-app.svg')]);
        expect(screen.getByRole('image', { name: 'Logo da Beast Maragames' })).toBeOnTheScreen();
    });

    // O Jogar é o único botão: a Configuração saiu (o tema é do Perfil) e as Regras são um link.
    it('apresenta o app com o lobinho, o título e a frase, e só o Jogar é botão', async () => {
        await abrirEm('/');

        expect(await screen.findByText('Solte a fera do game design')).toBeOnTheScreen();
        expect(screen.getByText('Aprenda game design em lições curtas, como quem joga.')).toBeOnTheScreen();
        expect(screen.getByRole('image', { name: 'O lobinho da Beast Maragames segurando um controle' })).toBeOnTheScreen();
        expect(screen.getAllByRole('button')).toHaveLength(1);
        expect(screen.queryByRole('button', { name: 'Configuração' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Iniciar' })).toBeNull();
    });

    it('o lobinho fica sobre dois anéis lisos, na cor de realce do tema', async () => {
        await escolherTema('claro');
        await abrirEm('/');

        for (const anel of ['anel-externo', 'anel-interno']) {
            expect(await screen.findByTestId(anel)).toHaveStyle({ backgroundColor: Colors.light.realce });
        }
    });

    // Num celular baixo (320×568), o lobinho, a carta e as ações passam da altura da tela: o conteúdo
    // rola, para o Jogar nunca ficar fora de alcance.
    it('o conteúdo todo rola: o lobinho, a carta, o Jogar e o link ficam dentro da rolagem', async () => {
        await abrirEm('/');

        const rolagem = within(await screen.findByTestId('rolagem-da-boas-vindas'));
        expect(rolagem.getByRole('image', { name: 'O lobinho da Beast Maragames segurando um controle' })).toBeOnTheScreen();
        expect(await rolagem.findByText('Pessoa jogadora')).toBeOnTheScreen();
        expect(rolagem.getByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        expect(rolagem.getByRole('link', { name: 'Regras do jogo' })).toBeOnTheScreen();
    });

    it('em tela alta o conteúdo ocupa a altura toda; em tela baixa, cresce e rola', async () => {
        await abrirEm('/');

        const estilo = StyleSheet.flatten((await screen.findByTestId('rolagem-da-boas-vindas')).props.contentContainerStyle);
        expect(estilo).toMatchObject({ flexGrow: 1 });
    });

    it('a logo é a mesma nos dois temas', async () => {
        await escolherTema('claro');
        await abrirEm('/');

        const logo = await screen.findByTestId('logo-app');
        expect(logo.props.source).toEqual([require('@/assets/images/logo-app.svg')]);
    });

    it('a saudação continua sendo da home: a boas-vindas não diz "Olá"', async () => {
        await abrirEm('/');
        await screen.findByText('Maragames App');

        expect(screen.queryByText(/Olá/)).toBeNull();
    });

    it('o Jogar abre a home e tira a boas-vindas da pilha', async () => {
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Jogar' }));

        expect(await screen.findByText('Olá, Paulo')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/home');
        expect(screen.queryByRole('button', { name: 'Jogar' })).toBeNull();
    });
});

describe('a carta de jogador', () => {
    it('mostra a pessoa jogadora, pelo apelido, com a sequência e o XP', async () => {
        respondidaHoje();
        await abrirEm('/');

        expect(await screen.findByText('Pessoa jogadora')).toBeOnTheScreen();
        expect(screen.getByText('Paulo')).toBeOnTheScreen();
        expect(screen.getByLabelText('1 dia seguido')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: +3')).toBeOnTheScreen();
        expect(screen.queryByText(/Responda uma questão/)).toBeNull();
    });

    it('no primeiro acesso, tudo em zero e a dica de como começar a sequência', async () => {
        await abrirEm('/');

        expect(await screen.findByLabelText('0 dias seguidos')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: 0')).toBeOnTheScreen();
        expect(screen.getByText('Responda uma questão para começar a sequência.')).toBeOnTheScreen();
    });

    it('no primeiro acesso, nenhuma medalha: 0/6, que leva às Conquistas', async () => {
        await abrirEm('/');

        expect(await screen.findByText('0/6')).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: '0 de 6 medalhas' })).toBeOnTheScreen();
    });

    it('a primeira lição feita vale a primeira medalha', async () => {
        respondidaHoje();
        await abrirEm('/');

        expect(await screen.findByRole('link', { name: '1 de 6 medalhas' })).toBeOnTheScreen();
        expect(screen.getByText('1/6')).toBeOnTheScreen();
    });

    it('se as lições não carregam, a tela aparece sem a carta e o Jogar continua funcionando', async () => {
        jest.spyOn(repo, 'getTopicos').mockRejectedValue(new Error('sem rede'));
        await abrirEm('/');

        expect(await screen.findByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        await waitFor(() => expect(repo.getTopicos).toHaveBeenCalled());
        expect(screen.queryByText('Pessoa jogadora')).toBeNull();
        expect(screen.getByRole('link', { name: 'Regras do jogo' })).toBeOnTheScreen();
    });
});

describe('as Conquistas', () => {
    it('abrem pelo número de medalhas da carta, com as seis medalhas e a contagem', async () => {
        respondidaHoje();
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('link', { name: '1 de 6 medalhas' }));

        expect(await screen.findByRole('header', { name: 'Conquistas' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/conquistas');
        expect(screen.getByText('1 de 6')).toBeOnTheScreen();
        for (const nome of ['Primeira lição', '3 dias seguidos', 'Um módulo inteiro', 'Revisão em dia', 'Ciclo completo', '5 lições']) {
            expect(screen.getByText(nome)).toBeOnTheScreen();
        }
    });

    it('a medalha da primeira lição mostra o dia em que foi ganha; as outras seguem bloqueadas', async () => {
        respondidaHoje();
        await abrirEm('/conquistas');

        const primeira = within(await screen.findByTestId('medalha-primeira_licao'));
        expect(primeira.getByText(/^Ganhou em \d{2}\/\d{2}$/)).toBeOnTheScreen();
        expect(within(screen.getByTestId('medalha-cinco_licoes')).getByText('Bloqueada · 1 de 5')).toBeOnTheScreen();
        expect(within(screen.getByTestId('medalha-ciclo_completo')).getByText('Bloqueada')).toBeOnTheScreen();
    });

    it('o voltar leva de volta à boas-vindas', async () => {
        const rotas = await abrirEm('/');
        const usuario = userEvent.setup();

        await usuario.press(await screen.findByRole('link', { name: '0 de 6 medalhas' }));
        await usuario.press(await screen.findByRole('button', { name: 'Voltar' }));

        expect(await screen.findByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });

    it('quem abre a URL direto e volta cai na boas-vindas', async () => {
        const rotas = await abrirEm('/conquistas');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Voltar' }));

        expect(await screen.findByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });

    it('se as lições não carregam, diz que não deu e deixa tentar de novo', async () => {
        jest.spyOn(repo, 'getTopicos').mockRejectedValueOnce(new Error('sem rede'));
        await abrirEm('/conquistas');

        const tentar = await screen.findByRole('button', { name: 'Tentar de novo' });
        expect(screen.queryByText('Primeira lição')).toBeNull();

        await userEvent.setup().press(tentar);

        expect(await screen.findByText('Primeira lição')).toBeOnTheScreen();
    });
});

describe('as Regras do jogo', () => {
    it('abrem pelo link e têm os seis cards, com o conceito do jogo primeiro', async () => {
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('link', { name: 'Regras do jogo' }));

        expect(await screen.findByText('O jogo')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/regras');
        for (const titulo of ['A certeza', 'Os pontos', 'O resultado', 'A lição', 'A sequência']) {
            expect(screen.getByText(titulo)).toBeOnTheScreen();
        }
        expect(screen.getByText(/Você aprende game design em lições curtas, como quem joga/)).toBeOnTheScreen();
    });

    it('explicam a lição na ordem do app, com a revisão sete dias depois', async () => {
        await abrirEm('/regras');

        expect(await screen.findByText(/Diagnóstico.*Cartão.*Prática.*Verificação.*Revisão/)).toBeOnTheScreen();
        expect(screen.getByText(/7 dias depois/)).toBeOnTheScreen();
    });

    it('dizem por que o diagnóstico e a verificação não mostram resultado por questão', async () => {
        await abrirEm('/regras');

        expect(await screen.findByText(/Só na Prática você vê o resultado a cada questão/)).toBeOnTheScreen();
    });

    it('usam os mesmos nomes de certeza que o app mostra', async () => {
        await abrirEm('/regras');
        await screen.findByText('A certeza');

        for (const rotulo of Object.values(ROTULO_CONFIANCA)) {
            expect(screen.getAllByText(new RegExp(rotulo)).length).toBeGreaterThan(0);
        }
        expect(screen.getByText(/Não existe nível errado/)).toBeOnTheScreen();
    });

    it('os pontos vêm da mesma conta do XP: o que cada nível vale ao acertar e ao errar', async () => {
        await abrirEm('/regras');
        await screen.findByText('Os pontos');

        for (const nivel of NIVEIS_DE_CONFIANCA) {
            const linha = within(screen.getByTestId(`pontos-${nivel}`));
            expect(linha.getByText(ROTULO_CONFIANCA[nivel])).toBeOnTheScreen();
            expect(linha.getByText(formatarPontos(xpDaResposta(true, nivel)))).toBeOnTheScreen();
            expect(linha.getByText(formatarPontos(xpDaResposta(false, nivel)))).toBeOnTheScreen();
        }
        expect(screen.getByText(/O palpite nunca tira ponto/)).toBeOnTheScreen();
    });

    it('o resultado é a matriz 2×2: acertou e errou por com e sem certeza, com os quatro quadrantes', async () => {
        await abrirEm('/regras');
        await screen.findByText('O resultado');

        const matriz = within(screen.getByTestId('matriz-de-quadrantes'));
        for (const rotulo of ['Com certeza', 'Sem certeza', 'Acertou', 'Errou']) {
            expect(matriz.getByText(rotulo)).toBeOnTheScreen();
        }
        for (const [quadrante, rotulo] of Object.entries(ROTULO_QUADRANTE)) {
            expect(matriz.getByText(rotulo)).toBeOnTheScreen();
            expect(matriz.getByText(DESCRICAO_QUADRANTE[quadrante as keyof typeof DESCRICAO_QUADRANTE])).toBeOnTheScreen();
        }
    });

    it('o voltar leva de volta à boas-vindas', async () => {
        const rotas = await abrirEm('/');
        const usuario = userEvent.setup();

        await usuario.press(await screen.findByRole('link', { name: 'Regras do jogo' }));
        await usuario.press(await screen.findByRole('button', { name: 'Voltar' }));

        expect(await screen.findByRole('button', { name: 'Jogar' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });
});

describe('o caminho de volta à home', () => {
    it('quem abre o Perfil direto e fecha cai na home, e não na boas-vindas', async () => {
        const rotas = await abrirEm('/perfil');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Voltar ao início' }));

        expect(await screen.findByText('Olá, Paulo')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/home');
    });
});
