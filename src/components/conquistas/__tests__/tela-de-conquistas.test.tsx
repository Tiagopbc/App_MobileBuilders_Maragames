import { act, render, screen, userEvent } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { ORDEM_DAS_MEDALHAS, type Conquista, type IdDaMedalha } from '@/lib/conquistas';
import { escolherTema } from '@/lib/tema';

import { TelaDeConquistas } from '../tela-de-conquistas';

// A tela das medalhas: seis cards em grade, os ganhados com a data e os bloqueados com o cadeado.

// 12/11 e 14/11 de 2026, ao meio-dia em São Luís (UTC−3).
const EM_12_11 = Date.UTC(2026, 10, 12, 15);
const EM_14_11 = Date.UTC(2026, 10, 14, 15);

const GANHAS: Partial<Record<IdDaMedalha, number>> = { primeira_licao: EM_12_11, tres_dias: EM_14_11 };
const conquistas: Conquista[] = ORDEM_DAS_MEDALHAS.map((id) => ({
    id,
    ganhaEm: GANHAS[id] ?? null,
    progresso: id === 'cinco_licoes' ? { feito: 1, total: 5 } : null,
}));

const pronto = { tipo: 'pronto', conquistas } as const;
const aoVoltar = jest.fn();
const aoTentarDeNovo = jest.fn();

beforeEach(() => {
    aoVoltar.mockClear();
    aoTentarDeNovo.mockClear();
});

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe('a tela de Conquistas', () => {
    it('tem o título, a contagem e a frase que diz que as medalhas são só da pessoa', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByRole('header', { name: 'Conquistas' })).toBeOnTheScreen();
        expect(screen.getByText('2 de 6')).toBeOnTheScreen();
        expect(screen.getByText('Medalhas só suas. Elas mostram o que você fez, sem comparar com ninguém.')).toBeOnTheScreen();
    });

    it('mostra as seis medalhas, cada uma com o nome e o que fazer', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        for (const nome of ['Primeira lição', '3 dias seguidos', 'Um módulo inteiro', 'Revisão em dia', 'Ciclo completo', '5 lições']) {
            expect(screen.getByText(nome)).toBeOnTheScreen();
        }
        expect(screen.getByText('Terminar todas as lições de um módulo.')).toBeOnTheScreen();
    });

    it('a medalha ganha diz o dia; a bloqueada diz que está bloqueada, com a contagem quando há', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByText('Ganhou em 12/11')).toBeOnTheScreen();
        expect(screen.getByText('Ganhou em 14/11')).toBeOnTheScreen();
        expect(screen.getByText('Bloqueada · 1 de 5')).toBeOnTheScreen();
        expect(screen.getAllByText('Bloqueada')).toHaveLength(3);
    });

    it('cada medalha é um item só para o leitor de tela, com o estado ao fim', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByLabelText('Primeira lição. Terminar a primeira lição, até a verificação. Ganhou em 12/11')).toBeOnTheScreen();
        expect(screen.getByLabelText('5 lições. Terminar 5 lições. Bloqueada · 1 de 5')).toBeOnTheScreen();
    });

    it('a seta volta', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        await userEvent.setup().press(screen.getByRole('button', { name: 'Voltar' }));

        expect(aoVoltar).toHaveBeenCalledTimes(1);
    });

    it('com erro ao carregar, diz que não deu e deixa tentar de novo', async () => {
        await render(<TelaDeConquistas estado={{ tipo: 'erro' }} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.queryByText('Primeira lição')).toBeNull();
        await userEvent.setup().press(screen.getByRole('button', { name: 'Tentar de novo' }));

        expect(aoTentarDeNovo).toHaveBeenCalledTimes(1);
    });

    it('enquanto carrega, não mostra medalha nenhuma, nem a contagem', async () => {
        await render(<TelaDeConquistas estado={{ tipo: 'carregando' }} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.queryByText('Primeira lição')).toBeNull();
        expect(screen.queryByText(/ de 6$/)).toBeNull();
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    const cores = Colors[esquema];

    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('a medalha ganha é o card selecionado, com o disco na cor da marca e o ícone na cor do fundo', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByTestId('medalha-primeira_licao')).toHaveStyle({
            backgroundColor: cores.cartaoSelecionado,
            borderColor: cores.bordaSelecionada,
        });
        expect(screen.getByTestId('disco-primeira_licao')).toHaveStyle({ backgroundColor: cores.primaria });
    });

    it('a bloqueada é um card do cartão com contorno tracejado, e o disco só o contorno', async () => {
        await render(<TelaDeConquistas estado={pronto} aoVoltar={aoVoltar} aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByTestId('medalha-revisao_em_dia')).toHaveStyle({
            backgroundColor: cores.cartao,
            borderColor: cores.textSecondary,
            borderStyle: 'dashed',
        });
        expect(screen.getByTestId('disco-revisao_em_dia')).toHaveStyle({
            borderColor: cores.textSecondary,
            borderStyle: 'dashed',
        });
    });
});
