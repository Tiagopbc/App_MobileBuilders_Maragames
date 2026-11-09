import { userEvent } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import { renderRouter, screen } from 'expo-router/testing-library';

import { repositorio } from '@/data/repositorio';
import type { RepositorioFalso } from '@/test/repositorio-falso';
import type { BlocoQuestao, Fase, Question } from '@/types/domain';

// Este teste fica fora de `src/app` de propósito: lá dentro, todo arquivo vira rota.

// O perfil muda dentro do teste (aceite do termo), então fica num objeto que o mock lê a cada render.
const mockSessao: { perfil: Record<string, unknown> } = { perfil: {} };
const COM_TERMO = { uid: 'u1', apelido: 'Paulo', formaPre: 'A', consentiuEm: 500 };
const SEM_TERMO = { uid: 'u1', apelido: 'Paulo' };

jest.mock('@/lib/session', () => ({
    SessionProvider: ({ children }: { children: unknown }) => children,
    useSession: () => ({
        user: { uid: 'u1' },
        perfil: mockSessao.perfil,
        perfilCompleto: true,
        isLoading: false,
        sair: jest.fn(),
        aceitarConsentimento: async () => {
            mockSessao.perfil = { ...mockSessao.perfil, formaPre: 'A', consentiuEm: 500 };
        },
    }),
}));

jest.mock('@/data/repositorio', () => {
    const { RepositorioFalso } = require('@/test/repositorio-falso');
    return { repositorio: new RepositorioFalso() };
});

jest.mock('expo-splash-screen', () => ({ preventAutoHideAsync: jest.fn(), hide: jest.fn() }));

jest.mock('expo-font', () => ({ ...jest.requireActual('expo-font'), useFonts: jest.fn() }));

const repo = repositorio as unknown as RepositorioFalso;
const DIA = 24 * 60 * 60 * 1000;

function questao(id: string, bloco: BlocoQuestao, order: number): Question {
    const topicId = id.split('_')[0];
    return {
        id,
        lessonId: `licao_${topicId}`,
        topicId,
        order,
        bloco,
        dificuldade: 'basico',
        formato: 'multipla_escolha',
        enunciado: `Enunciado de ${id}`,
        alternativas: [
            { id: 'a', texto: 'Certa', correta: true, explicacao: '' },
            { id: 'b', texto: 'Errada B', correta: false, explicacao: '' },
            { id: 'c', texto: 'Errada C', correta: false, explicacao: '' },
            { id: 'd', texto: 'Errada D', correta: false, explicacao: '' },
        ],
        fonte: null,
        versaoConteudo: 'v1',
    };
}

// Uma resposta já gravada: acerto com certeza (+3), a menos que o teste diga outra coisa.
function respondida(fase: Fase, questionId: string, quando = Date.now(), correta = true) {
    repo.respostas.push({
        id: `r${repo.respostas.length + 1}`,
        uid: 'u1',
        questionId,
        topicId: questionId.split('_')[0],
        attemptId: 't0',
        fase,
        escolha: correta ? 'a' : 'b',
        ordemExibida: ['a', 'b', 'c', 'd'],
        correta,
        confianca: 3,
        tempoMs: 1,
        respondidaEm: quando,
    });
}

// O diagnóstico errado com certeza (−4), a prática e a verificação certas (+3 cada).
function ateAVerificacao(quando = Date.now()) {
    respondida('pre', 'mda_a1', quando, false);
    respondida('pratica', 'mda_p1', quando);
    respondida('pos', 'mda_b1', quando);
}

// MDA tem o ciclo completo, com uma questão por passo; GDD só tem prática. Nenhum tem cartão.
beforeEach(() => {
    (useFonts as jest.Mock).mockReturnValue([true, null]);
    mockSessao.perfil = COM_TERMO;
    repo.reiniciar();
    repo.licoes = [
        { id: 'licao_mda', title: 'Framework MDA', order: 1, topicId: 'mda', modulo: 'Fundamentos de Game Design' },
        { id: 'licao_gdd', title: 'GDD', order: 2, topicId: 'gdd', modulo: 'Fundamentos de Game Design' },
    ];
    repo.questoes = [
        questao('mda_a1', 'forma_a', 1),
        questao('mda_b1', 'forma_b', 2),
        questao('mda_p1', 'pratica', 3),
        questao('gdd_p1', 'pratica', 1),
    ];
});

async function abrirEm(url: string) {
    const rotas = await renderRouter('./src/app', { initialUrl: url });
    return { caminho: () => rotas.getPathname() };
}

const botao = (nome: string | RegExp) => screen.getByRole('button', { name: nome });

async function responderNaTela(user: ReturnType<typeof userEvent.setup>, alternativa: RegExp, confianca: string) {
    await user.press(screen.getByRole('radio', { name: alternativa }));
    await user.press(screen.getByRole('radio', { name: confianca }));
    await user.press(botao('Confirmar'));
}

describe('a página da lição', () => {
    it('lição nova de ciclo completo: módulo, título, as quatro etapas e o botão Começar', async () => {
        await abrirEm('/licoes/mda');

        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
        expect(screen.getByText('Fundamentos de Game Design')).toBeOnTheScreen();
        expect(screen.getByLabelText('Diagnóstico, agora, 1 questão')).toBeOnTheScreen();
        expect(screen.getByLabelText('Cartão e prática, depois, 1 questão')).toBeOnTheScreen();
        expect(screen.getByLabelText('Verificação, depois, 1 questão')).toBeOnTheScreen();
        expect(screen.getByLabelText('Revisão, depois, 7 dias depois da verificação')).toBeOnTheScreen();
        expect(botao('Começar')).toBeEnabled();
    });

    it('lição de ciclo curto mostra só a etapa de cartão e prática', async () => {
        await abrirEm('/licoes/gdd');

        expect(await screen.findByLabelText('Cartão e prática, agora, 1 questão')).toBeOnTheScreen();
        expect(screen.queryByText('Diagnóstico')).toBeNull();
        expect(screen.queryByText('Revisão')).toBeNull();
    });

    it('tópico que não é lição avisa, em vez de mostrar uma página vazia', async () => {
        await abrirEm('/licoes/nada');

        expect(await screen.findByText('Essa lição não existe.')).toBeOnTheScreen();
    });

    it('se a leitura falha, avisa e deixa tentar de novo', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        repo.falhaAoCarregar = true;
        await abrirEm('/licoes/mda');
        expect(await screen.findByText(/Não foi possível carregar a lição/)).toBeOnTheScreen();

        repo.falhaAoCarregar = false;
        await userEvent.setup().press(botao('Tentar de novo'));

        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
        jest.restoreAllMocks();
    });

    it('aguardando a revisão: mostra o antes e o depois, o XP e quando a revisão abre, sem botão de passo', async () => {
        ateAVerificacao(Date.now() - 2 * DIA);
        await abrirEm('/licoes/mda');

        expect(await screen.findByText('Antes 0 de 1 → Depois 1 de 1')).toBeOnTheScreen();
        // −4 do diagnóstico, +3 da prática e +3 da verificação.
        expect(screen.getByText('+2 XP')).toBeOnTheScreen();
        expect(screen.getByLabelText('Revisão, em espera, Abre em 5 dias')).toBeOnTheScreen();
        expect(screen.getByText(/^A revisão abre n[ao] .+, \d\d\/\d\d\.$/)).toBeOnTheScreen();
        expect(screen.queryByRole('button', { name: 'Começar' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Fazer a revisão' })).toBeNull();
    });

    it('com o diagnóstico feito e a lição no estudo, nenhum número do diagnóstico aparece', async () => {
        respondida('pre', 'mda_a1');
        await abrirEm('/licoes/mda');

        expect(await screen.findByLabelText('Diagnóstico, feito, 1 questão')).toBeOnTheScreen();
        expect(screen.queryByText(/XP/)).toBeNull();
        expect(screen.queryByText(/Antes/)).toBeNull();
    });
});

describe('o termo antes do primeiro diagnóstico', () => {
    beforeEach(() => {
        mockSessao.perfil = SEM_TERMO;
    });

    it('sem termo aceito, Começar abre o termo; aceito, a pessoa volta para a lição', async () => {
        const rotas = await abrirEm('/licoes/mda');
        const user = userEvent.setup();

        expect(await screen.findByText(/você lê e aceita o termo/)).toBeOnTheScreen();
        await user.press(botao('Começar'));
        await user.press(await screen.findByRole('checkbox', { name: 'Li e concordo em participar' }));
        await user.press(botao('Aceitar e começar'));

        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda');
        expect(screen.queryByText(/você lê e aceita o termo/)).toBeNull();
    });

    it('sem termo aceito, o diagnóstico não abre pela URL', async () => {
        const rotas = await abrirEm('/licoes/mda/diagnostico');

        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda');
        expect(screen.queryByText('Enunciado de mda_a1')).toBeNull();
    });

    it('lição de ciclo curto não pede termo', async () => {
        await abrirEm('/licoes/gdd');
        await userEvent.setup().press(await screen.findByRole('button', { name: 'Começar' }));

        expect(await screen.findByText('Enunciado de gdd_p1')).toBeOnTheScreen();
    });
});

describe('uma lição de ciclo completo, do começo à espera da revisão', () => {
    it('diagnóstico sem números, prática com feedback, verificação e o antes e depois no fim', async () => {
        const rotas = await abrirEm('/licoes/mda');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        // Diagnóstico: errado, com certeza. Nada por questão, e nada de número no fim.
        await user.press(await screen.findByRole('button', { name: 'Começar' }));
        expect(await screen.findByText('Enunciado de mda_a1')).toBeOnTheScreen();
        expect(screen.getByText('Sem resultado por questão: tudo aparece no fim da lição.')).toBeOnTheScreen();
        await responderNaTela(user, /Errada B/, 'Tenho certeza');

        expect(await screen.findByText('Diagnóstico feito')).toBeOnTheScreen();
        expect(screen.queryByText(/XP/)).toBeNull();
        expect(screen.queryByText(/Acertou/)).toBeNull();
        // A tentativa do diagnóstico fica ligada à lição do tópico.
        expect(repo.attempts.find((a) => a.fase === 'pre')).toMatchObject({ lessonId: 'licao_mda', concluida: true });

        // O tópico de teste não tem cartão, então a prática abre direto.
        await user.press(botao('Ir para o cartão'));
        expect(await screen.findByText('Enunciado de mda_p1')).toBeOnTheScreen();
        await responderNaTela(user, /Certa/, 'Tenho certeza');
        await user.press(await screen.findByRole('button', { name: 'Concluir' }));

        // Fim da prática: o resultado de sempre, e o botão leva à verificação.
        expect(await screen.findByText('Resultado')).toBeOnTheScreen();
        await user.press(botao('Fazer a verificação'));
        expect(await screen.findByText('Enunciado de mda_b1')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda/verificacao');
        await responderNaTela(user, /Certa/, 'Tenho certeza');

        // Fim da verificação: o antes só aparece agora, ao lado do depois. A lição ainda não acabou (falta a
        // revisão, 7 dias depois), então o título não diz "concluída": "Concluída" é o da lição com a revisão feita.
        expect(await screen.findByText('Verificação feita')).toBeOnTheScreen();
        expect(screen.queryByText('Lição concluída')).toBeNull();
        expect(screen.getByText('Framework MDA')).toBeOnTheScreen();
        expect(screen.getByLabelText('Antes · diagnóstico: 0 de 1')).toBeOnTheScreen();
        expect(screen.getByLabelText('Depois · verificação: 1 de 1')).toBeOnTheScreen();
        expect(screen.getByText('Você acertou 1 a mais na verificação')).toBeOnTheScreen();
        expect(screen.getByText('XP da lição: +2 XP')).toBeOnTheScreen();
        expect(screen.getByTestId('matriz-de-quadrantes')).toBeOnTheScreen();
        expect(screen.getByText(/^A revisão abre n[ao] .+, \d\d\/\d\d\. É 1 questão para ver o quanto ficou\.$/)).toBeOnTheScreen();
        // A sequência de dias é da carta de jogador, não do fim da lição.
        expect(screen.queryByLabelText('1 dia seguido')).toBeNull();
        expect(screen.queryByText('Enunciado de mda_b1')).toBeNull();

        // A primeira lição feita vale a primeira medalha, que leva às Conquistas.
        expect(screen.getByRole('link', { name: 'Medalha nova: Primeira lição' })).toBeOnTheScreen();
        // O botão principal é a próxima lição que o app sugere; o outro volta ao início.
        expect(botao('Começar GDD')).toBeOnTheScreen();
        expect(screen.queryByRole('button', { name: 'Voltar para a lição' })).toBeNull();

        await user.press(botao('Voltar ao início'));
        expect(await screen.findByText('Olá, Paulo')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/home');
    });

    it('no fim da verificação, a medalha abre as Conquistas e o botão principal abre a próxima lição', async () => {
        respondida('pre', 'mda_a1', Date.now() - 2000, false);
        respondida('pratica', 'mda_p1', Date.now() - 1000);
        const rotas = await abrirEm('/licoes/mda/verificacao');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        await responderNaTela(user, /Certa/, 'Tenho certeza');
        await user.press(await screen.findByRole('link', { name: 'Medalha nova: Primeira lição' }));
        expect(await screen.findByRole('header', { name: 'Conquistas' })).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/conquistas');

        await user.press(botao('Voltar'));
        await user.press(await screen.findByRole('button', { name: 'Começar GDD' }));
        expect(await screen.findByText('GDD')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/gdd');
    });

    it('quando o depois não melhora, a frase é neutra: o mesmo resultado, sem "a mais"', async () => {
        respondida('pre', 'mda_a1', Date.now() - 2000, true);
        respondida('pratica', 'mda_p1', Date.now() - 1000);
        await abrirEm('/licoes/mda/verificacao');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        await responderNaTela(user, /Certa/, 'Tenho certeza');

        expect(await screen.findByText('Mesmo resultado do diagnóstico')).toBeOnTheScreen();
        expect(screen.queryByText(/a mais na verificação/)).toBeNull();
    });
});

describe('os blocos sem feedback de uma lição', () => {
    // Outro tópico de ciclo completo: no roteiro antigo, as questões dele entravam no mesmo bloco.
    beforeEach(() => {
        repo.licoes.push({ id: 'licao_pixel', title: 'Pixel Art Básico', order: 3, topicId: 'pixel' });
        repo.questoes.push(questao('pixel_a1', 'forma_a', 1), questao('pixel_b1', 'forma_b', 2), questao('pixel_p1', 'pratica', 3));
    });

    it('o diagnóstico tem só as questões do tópico da lição, e leva o nome dela', async () => {
        await abrirEm('/licoes/mda/diagnostico');
        const user = userEvent.setup();

        expect(await screen.findByText('Enunciado de mda_a1')).toBeOnTheScreen();
        expect(screen.getByText('Diagnóstico · Framework MDA')).toBeOnTheScreen();
        expect(screen.getByText('1/1')).toBeOnTheScreen();
        await responderNaTela(user, /Certa/, 'Palpite');

        expect(await screen.findByText('Diagnóstico feito')).toBeOnTheScreen();
        expect(repo.respostas.map((r) => r.questionId)).toEqual(['mda_a1']);
    });

    it('fazer uma lição não mexe na outra: ela continua nova', async () => {
        ateAVerificacao();
        await abrirEm('/licoes/pixel');

        expect(await screen.findByLabelText('Diagnóstico, agora, 1 questão')).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Começar' })).toBeEnabled();
    });
});

describe('a revisão', () => {
    it('7 dias depois, a lição oferece a revisão, e o fim dela mostra o que ficou', async () => {
        ateAVerificacao(Date.now() - 7 * DIA);
        const rotas = await abrirEm('/licoes/mda');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        await user.press(await screen.findByRole('button', { name: 'Fazer a revisão' }));
        expect(await screen.findByText('Enunciado de mda_b1')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda/revisao');
        await responderNaTela(user, /Certa/, 'Tenho dúvida');

        expect(await screen.findByText('Revisão feita')).toBeOnTheScreen();
        expect(screen.getByLabelText('Na verificação: 1 de 1')).toBeOnTheScreen();
        expect(screen.getByLabelText('Hoje: 1 de 1')).toBeOnTheScreen();
        expect(screen.getByText('Você lembrou 1 de 1. A revisão mostra o que ficou.')).toBeOnTheScreen();
        // Só o acerto com dúvida da revisão (+2): os +2 de antes ficam de fora, para o número bater com o
        // que a pessoa acabou de fazer.
        expect(screen.getByText('XP da revisão: +2 XP')).toBeOnTheScreen();
        expect(screen.queryByText(/XP da lição/)).toBeNull();
        // A revisão feita no dia em que abre e o ciclo completo são medalhas novas; a Primeira lição, de 7 dias antes, não.
        expect(screen.getByRole('link', { name: 'Medalha nova: Revisão em dia' })).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: 'Medalha nova: Ciclo completo' })).toBeOnTheScreen();
        expect(screen.queryByRole('link', { name: 'Medalha nova: Primeira lição' })).toBeNull();
        expect(repo.attempts.find((a) => a.fase === 'reteste')).toMatchObject({ lessonId: 'licao_mda' });
    });
});

describe('a revisão feita depois dos 7 dias', () => {
    // A revisão abre 7 dias depois e não fecha: o fim dela não pode dizer que passaram 7 dias.
    it('o rótulo é só "Hoje", sem prometer o intervalo', async () => {
        ateAVerificacao(Date.now() - 14 * DIA);
        await abrirEm('/licoes/mda');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        await user.press(await screen.findByRole('button', { name: 'Fazer a revisão' }));
        await responderNaTela(user, /Certa/, 'Tenho dúvida');

        expect(await screen.findByText('Revisão feita')).toBeOnTheScreen();
        expect(screen.getByLabelText('Hoje: 1 de 1')).toBeOnTheScreen();
        expect(screen.queryByText(/7 dias depois/)).toBeNull();
        expect(screen.queryByLabelText(/7 dias depois/)).toBeNull();
    });
});

describe('uma lição de ciclo curto', () => {
    it('cartão, prática e fim da lição, com os acertos, o XP e a sequência', async () => {
        await abrirEm('/licoes/gdd');
        const user = userEvent.setup();
        repo.acertarRelogio(Date.now());

        await user.press(await screen.findByRole('button', { name: 'Começar' }));
        expect(await screen.findByText('Enunciado de gdd_p1')).toBeOnTheScreen();
        await responderNaTela(user, /Certa/, 'Tenho certeza');
        await user.press(await screen.findByRole('button', { name: 'Concluir' }));

        expect(await screen.findByText('Lição concluída')).toBeOnTheScreen();
        expect(screen.getByText('Você acertou 1 de 1 questões de GDD · +3 XP')).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: 'Medalha nova: Primeira lição' })).toBeOnTheScreen();
        // Sem antes e depois: o ciclo curto não tem diagnóstico nem verificação.
        expect(screen.queryByTestId('barras-antes')).toBeNull();

        // A próxima lição sugerida é a MDA, que ainda é nova.
        await user.press(botao('Começar Framework MDA'));
        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
    });
});

describe('a trava da lição', () => {
    async function voltaParaALicao(url: string, naoMostra: string) {
        const rotas = await abrirEm(url);

        expect(await screen.findByText('Framework MDA')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda');
        expect(screen.queryByText(naoMostra)).toBeNull();
    }

    it.each(['pratica', 'verificacao', 'revisao'])('lição nova: /licoes/mda/%s volta para a lição', async (passo) => {
        await voltaParaALicao(`/licoes/mda/${passo}`, 'Enunciado de mda_p1');
    });

    it('o diagnóstico não se pula: com ele pela frente, a prática não abre', async () => {
        await voltaParaALicao('/licoes/mda/pratica', 'Enunciado de mda_p1');
    });

    it('entre a verificação e a revisão, a prática fica fechada', async () => {
        ateAVerificacao();
        await voltaParaALicao('/licoes/mda/pratica', 'Resultado');
    });

    it('antes dos 7 dias, a revisão não abre', async () => {
        ateAVerificacao(Date.now() - 6 * DIA);
        await voltaParaALicao('/licoes/mda/revisao', 'Enunciado de mda_b1');
    });

    it('passo que não existe volta para a lição', async () => {
        await voltaParaALicao('/licoes/mda/qualquer', 'Enunciado de mda_a1');
    });

    it('entre a verificação e a revisão, o cartão continua livre, e não leva à prática', async () => {
        repo.licoes[0].cartao = [{ titulo: 'O que é o MDA', texto: 'Mecânica, dinâmica e estética.' }];
        ateAVerificacao();
        const rotas = await abrirEm('/licoes/mda');
        const user = userEvent.setup();

        await user.press(await screen.findByRole('button', { name: 'Rever o cartão' }));
        expect(await screen.findByText('O que é o MDA')).toBeOnTheScreen();
        expect(screen.queryByRole('button', { name: 'Começar a prática' })).toBeNull();

        await user.press(botao('Voltar para a lição'));
        expect(await screen.findByText('Antes 0 de 1 → Depois 1 de 1')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/mda');
    });

    it('lição concluída: a prática volta a abrir, para rever as questões', async () => {
        ateAVerificacao(Date.now() - 8 * DIA);
        respondida('reteste', 'mda_b1');
        await abrirEm('/licoes/mda');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'Ver a prática' }));

        expect(await screen.findByText('Resultado')).toBeOnTheScreen();
        expect(screen.queryByRole('button', { name: 'Fazer a verificação' })).toBeNull();
    });
});

// O conteúdo pode ganhar diagnóstico depois de alguém já ter praticado o tópico (item 30).
describe('quem praticou antes de a lição ter diagnóstico', () => {
    beforeEach(() => {
        repo.questoes.push(questao('gdd_a1', 'forma_a', 2), questao('gdd_b1', 'forma_b', 3));
        respondida('pratica', 'gdd_p1');
    });

    it('a lição continua concluída, só com a etapa de cartão e prática', async () => {
        await abrirEm('/licoes/gdd');

        expect(await screen.findByLabelText('Cartão e prática, feito, 1 questão')).toBeOnTheScreen();
        expect(screen.queryByText('Diagnóstico')).toBeNull();
        expect(screen.queryByRole('button', { name: 'Começar' })).toBeNull();
    });

    it('o diagnóstico não abre nem pela URL: ele já não mediria o antes', async () => {
        const rotas = await abrirEm('/licoes/gdd/diagnostico');

        expect(await screen.findByLabelText('Cartão e prática, feito, 1 questão')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/gdd');
        expect(screen.queryByText('Enunciado de gdd_a1')).toBeNull();
    });

    it('na lista, ela aparece como concluída', async () => {
        await abrirEm('/licoes');

        expect(await screen.findByRole('button', { name: 'GDD, Concluída, domínio 1 de 1' })).toBeOnTheScreen();
    });

    it('quem ainda não praticou o mesmo tópico começa pelo diagnóstico', async () => {
        repo.respostas = [];
        await abrirEm('/licoes/gdd');

        expect(await screen.findByLabelText('Diagnóstico, agora, 1 questão')).toBeOnTheScreen();
    });
});

describe('a lista de lições', () => {
    beforeEach(() => {
        repo.licoes[1].modulo = 'Áudio & Música';
    });

    it('mostra as lições por módulo, na ordem sugerida, cada uma com a situação', async () => {
        ateAVerificacao(Date.now() - 2 * DIA);
        await abrirEm('/licoes');

        expect(await screen.findByText('Lições')).toBeOnTheScreen();
        expect(screen.getByText('Fundamentos de Game Design')).toBeOnTheScreen();
        expect(screen.getByText('Áudio & Música')).toBeOnTheScreen();
        // Diagnóstico errado, prática e verificação certas: 2 das 3 questões do tópico.
        expect(botao('Framework MDA, Revisão em 5 dias, domínio 2 de 3')).toBeOnTheScreen();
        expect(botao('GDD, Nova')).toBeOnTheScreen();
    });

    it('com o diagnóstico feito e a lição pela metade, o domínio ainda não aparece', async () => {
        respondida('pre', 'mda_a1');
        await abrirEm('/licoes');

        expect(await screen.findByRole('button', { name: 'Framework MDA, Em andamento' })).toBeOnTheScreen();
    });

    it('qualquer lição abre, sem ordem: a segunda antes da primeira', async () => {
        const rotas = await abrirEm('/licoes');

        await userEvent.setup().press(await screen.findByRole('button', { name: 'GDD, Nova' }));

        expect(await screen.findByLabelText('Cartão e prática, agora, 1 questão')).toBeOnTheScreen();
        expect(rotas.caminho()).toBe('/licoes/gdd');
    });

    it('depois das lições, mostra os módulos em breve com as lições trancadas, sem abrir', async () => {
        await abrirEm('/licoes');

        expect(await screen.findByText('Game Engines · Em breve')).toBeOnTheScreen();
        expect(screen.getByText('Publicação & Monetização · Em breve')).toBeOnTheScreen();
        expect(screen.getByLabelText('Unity — Primeiros Passos, em breve')).toBeOnTheScreen();
        expect(screen.queryByRole('button', { name: /Unity — Primeiros Passos/ })).toBeNull();
    });

    it('se a leitura falha, avisa e deixa tentar de novo', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        repo.falhaAoCarregar = true;
        await abrirEm('/licoes');
        expect(await screen.findByText(/Não foi possível carregar as lições/)).toBeOnTheScreen();

        repo.falhaAoCarregar = false;
        await userEvent.setup().press(botao('Tentar de novo'));

        expect(await screen.findByRole('button', { name: 'GDD, Nova' })).toBeOnTheScreen();
        jest.restoreAllMocks();
    });
});
