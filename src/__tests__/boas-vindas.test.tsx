import { userEvent } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import { renderRouter, screen } from 'expo-router/testing-library';

import { DESCRICAO_QUADRANTE, ROTULO_CONFIANCA, ROTULO_DO_TEMA, ROTULO_QUADRANTE } from '@/constants/textos';
import { escolherTema, preferenciaDeTema } from '@/lib/tema';
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

// A home, que o Iniciar abre, lê as lições pelo repositório; aqui ele é o da memória.
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
});

async function abrirEm(url: string) {
    const rotas = await renderRouter('./src/app', { initialUrl: url });
    return { caminho: () => rotas.getPathname() };
}

describe('a tela de boas-vindas', () => {
    it('é a primeira de quem já entrou: o nome do app, o Iniciar e os dois botões do rodapé', async () => {
        const rotas = await abrirEm('/');

        expect(await screen.findByText('Maragames App')).toBeOnTheScreen();
        expect(screen.getByText('by Mobile Builders')).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Iniciar' })).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Configuração' })).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Regras do jogo' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });

    it('a logo é a do Maranhão, e o leitor de tela a chama pelo nome da marca', async () => {
        await abrirEm('/');

        expect(await screen.findByTestId('logo-maranhao')).toBeOnTheScreen();
        expect(screen.getByRole('image', { name: 'Logo da Beast Maragames' })).toBeOnTheScreen();
    });

    it('não diz o nome de quem entrou: a saudação é da home', async () => {
        await abrirEm('/');
        await screen.findByText('Maragames App');

        expect(screen.queryByText(/Olá/)).toBeNull();
        expect(screen.queryByText(/Paulo/)).toBeNull();
    });

    it('o Iniciar abre a home e tira a boas-vindas da pilha', async () => {
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Iniciar' }));

        expect(await screen.findByText('Olá, Paulo')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/home');
        expect(screen.queryByRole('button', { name: 'Iniciar' })).toBeNull();
    });
});

describe('a Configuração', () => {
    it('abre pelo ⚙ e mostra a escolha de tema', async () => {
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Configuração' }));

        expect(await screen.findByText('Aparência')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/configuracao');
        for (const rotulo of Object.values(ROTULO_DO_TEMA)) {
            expect(screen.getByRole('radio', { name: rotulo })).toBeOnTheScreen();
        }
    });

    it('escolher o tema muda a preferência do aparelho, a mesma do Perfil', async () => {
        await abrirEm('/configuracao');

        await userEvent.setup().press(await screen.findByRole('radio', { name: ROTULO_DO_TEMA.escuro }));

        expect(preferenciaDeTema()).toBe('escuro');
    });

    it('o voltar leva de volta à boas-vindas', async () => {
        const rotas = await abrirEm('/');
        const usuario = userEvent.setup();

        await usuario.press(await screen.findByRole('button', { name: 'Configuração' }));
        await usuario.press(await screen.findByRole('button', { name: 'Voltar' }));

        expect(await screen.findByRole('button', { name: 'Iniciar' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/');
    });
});

describe('as Regras do jogo', () => {
    it('abrem pelo ? e têm os cinco blocos', async () => {
        const rotas = await abrirEm('/');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Regras do jogo' }));

        expect(await screen.findByText('A lição')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/regras');
        for (const titulo of ['A certeza', 'O XP', 'O resultado', 'A sequência']) {
            expect(screen.getByText(titulo)).toBeOnTheScreen();
        }
    });

    it('explicam a lição na ordem do app, com a revisão sete dias depois', async () => {
        await abrirEm('/regras');

        expect(await screen.findByText(/Diagnóstico.*Cartão.*Prática.*Verificação.*Revisão/)).toBeOnTheScreen();
        expect(screen.getByText(/7 dias depois/)).toBeOnTheScreen();
    });

    it('usam os mesmos nomes de certeza e de quadrante que o app mostra, sem repetir o texto', async () => {
        await abrirEm('/regras');
        await screen.findByText('A certeza');

        for (const rotulo of Object.values(ROTULO_CONFIANCA)) {
            expect(screen.getAllByText(new RegExp(rotulo)).length).toBeGreaterThan(0);
        }
        for (const [quadrante, rotulo] of Object.entries(ROTULO_QUADRANTE)) {
            expect(screen.getByText(rotulo)).toBeOnTheScreen();
            expect(screen.getByText(DESCRICAO_QUADRANTE[quadrante as keyof typeof DESCRICAO_QUADRANTE])).toBeOnTheScreen();
        }
    });

    it('dizem o que cada nível de certeza vale no XP', async () => {
        await abrirEm('/regras');

        expect(await screen.findByText(/acerto vale 1, 2 ou 3/i)).toBeOnTheScreen();
        expect(screen.getByText(/erro vale 0, −1 ou −4/i)).toBeOnTheScreen();
    });

    it('o voltar leva de volta à boas-vindas', async () => {
        const rotas = await abrirEm('/');
        const usuario = userEvent.setup();

        await usuario.press(await screen.findByRole('button', { name: 'Regras do jogo' }));
        await usuario.press(await screen.findByRole('button', { name: 'Voltar' }));

        expect(await screen.findByRole('button', { name: 'Iniciar' })).toBeOnTheScreen();
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
