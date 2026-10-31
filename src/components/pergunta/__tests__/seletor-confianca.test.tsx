import { act, render, screen, userEvent } from '@testing-library/react-native';

import { escolherTema } from '@/lib/tema';

import { SeletorConfianca } from '../seletor-confianca';

// O seletor só pergunta e deixa escolher: os pontos de cada nível ficam na regra, que um link
// abre. Números ao lado de "Tenho certeza" pesam na hora de decidir e distorcem a certeza dita.

const aoAbrirRegras = jest.fn();

beforeEach(() => aoAbrirRegras.mockClear());

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each(['claro', 'escuro'] as const)('no tema %s', (tema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
        await render(<SeletorConfianca valor={null} onChange={() => {}} desabilitado={false} aoAbrirRegras={aoAbrirRegras} />);
    });

    it('mostra só os três níveis, sem pontos', () => {
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(screen.queryByText(/acerta|erra\b|[+−]\d/i)).not.toBeOnTheScreen();
    });

    it('tem o link "Como funcionam os pontos", que abre a regra', async () => {
        await userEvent.setup().press(screen.getByRole('link', { name: 'Como funcionam os pontos' }));

        expect(aoAbrirRegras).toHaveBeenCalledTimes(1);
    });
});
