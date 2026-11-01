import { act, render, screen, within } from '@testing-library/react-native';

import { Colors, Relevo } from '@/constants/theme';
import type { EstadoDasLicoes } from '@/hooks/use-licoes';
import { escolherTema } from '@/lib/tema';
import { apertar } from '@/test/apertar';

import { TelaDasLicoes } from '../tela-das-licoes';

// A lição em breve é um card tracejado e chapado, com o cadeado: o estado vem da forma e da cor,
// nunca de uma opacidade que desbota o texto.

const pronto = {
    tipo: 'pronto',
    licoes: [],
    sugestao: null,
    xp: null,
    sequencia: 0,
    aVista: [],
    respostas: [],
    questoes: [],
} as unknown as EstadoDasLicoes;

async function emBreve() {
    await render(
        <TelaDasLicoes
            estado={pronto}
            emBreve={[{ modulo: 'Game Engines', licoes: ['Unity — Primeiros Passos'] }]}
            aoAbrir={() => {}}
            aoTentarDeNovo={() => {}}
            aoSair={() => {}}
        />,
    );
    return screen.getByLabelText('Unity — Primeiros Passos, em breve');
}

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('a lição em breve é um card tracejado, sem relevo e sem opacidade', async () => {
        const card = await emBreve();

        expect(card).toHaveStyle({
            backgroundColor: Colors[esquema].fundoApagado,
            borderColor: Colors[esquema].bordaDoCartao,
            borderStyle: 'dashed',
            opacity: 1,
        });
    });

    it('a lição que abre é o card único: relevo embaixo e, apertada, desce sem opacidade', async () => {
        const comLicao = {
            ...pronto,
            licoes: [{ topicId: 'logica', titulo: 'Lógica de Programação', modulo: 'Fundamentos', estado: { tipo: 'nova' }, dominio: null }],
        } as unknown as EstadoDasLicoes;
        await render(
            <TelaDasLicoes estado={comLicao} emBreve={[]} aoAbrir={() => {}} aoTentarDeNovo={() => {}} aoSair={() => {}} />,
        );
        const item = screen.getByRole('button', { name: /Lógica de Programação/ });

        expect(item).toHaveStyle({
            backgroundColor: Colors[esquema].cartao,
            borderBottomColor: Colors[esquema].relevoDoCartao,
            borderBottomWidth: 1.5 + Relevo[esquema].espessura,
        });

        await act(() => apertar(item));

        expect(item).toHaveStyle({ borderBottomWidth: 1.5, marginTop: Relevo[esquema].afunda, opacity: 1 });
    });

    it('o nome da lição em breve usa o texto de apoio, que passa no contraste', async () => {
        await emBreve();

        expect(screen.getByText('Unity — Primeiros Passos')).toHaveStyle({ color: Colors[esquema].textSecondary });
    });
});

// Enquanto as lições carregam, a lista tem a forma real: cards de esqueleto no lugar dos cards.
// O esqueleto só aparece depois de 300 ms, para não piscar quando a rede é rápida.
describe('enquanto as lições carregam', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const carregando = { tipo: 'carregando' } as EstadoDasLicoes;
    const tela = () => (
        <TelaDasLicoes estado={carregando} emBreve={[]} aoAbrir={() => {}} aoTentarDeNovo={() => {}} aoSair={() => {}} />
    );

    it('nos primeiros 300 ms, não mostra nada: o conteúdo pode chegar antes', async () => {
        await render(tela());
        await act(() => jest.advanceTimersByTime(299));

        expect(screen.queryByTestId('esqueleto-das-licoes')).toBeNull();
    });

    it('depois de 300 ms, mostra o esqueleto com quatro cards de lição, anunciado como "Carregando"', async () => {
        await render(tela());
        await act(() => jest.advanceTimersByTime(300));

        const esqueleto = within(screen.getByTestId('esqueleto-das-licoes'));
        expect(esqueleto.getAllByTestId('esqueleto-de-licao')).toHaveLength(4);
        expect(screen.getByLabelText('Carregando')).toBeOnTheScreen();
    });

    it('o título da tela e o fechar continuam à vista', async () => {
        await render(tela());

        expect(screen.getByText('Lições')).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Voltar ao início' })).toBeOnTheScreen();
    });
});

