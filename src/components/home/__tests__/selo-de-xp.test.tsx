import { act, render, screen } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { SeloDeXp } from '../selo-de-xp';

// O selo de XP do alto da home: o total e, embaixo, o que o dia trouxe.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe('o selo de XP', () => {
    it('mostra o total e o do dia, e o leitor de tela ouve os dois juntos', async () => {
        await render(<SeloDeXp xp={18} deHoje={7} />);

        expect(screen.getByText('18')).toBeOnTheScreen();
        expect(screen.getByText('XP')).toBeOnTheScreen();
        expect(screen.getByText('+7 hoje')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: +18, +7 hoje')).toBeOnTheScreen();
    });

    it('sem XP no dia, só o total', async () => {
        await render(<SeloDeXp xp={18} deHoje={0} />);

        expect(screen.queryByText(/hoje/)).toBeNull();
        expect(screen.getByLabelText('XP: +18')).toBeOnTheScreen();
    });

    it('o do dia negativo aparece como é, sem esconder', async () => {
        await render(<SeloDeXp xp={10} deHoje={-2} />);

        expect(screen.getByText('−2 hoje')).toBeOnTheScreen();
    });

    it('o do dia positivo é verde; o negativo fica neutro', async () => {
        const { rerender } = await render(<SeloDeXp xp={18} deHoje={7} />);
        expect(screen.getByText('+7 hoje')).toHaveStyle({ color: Colors.light.sucesso });

        await rerender(<SeloDeXp xp={10} deHoje={-2} />);
        expect(screen.getByText('−2 hoje')).toHaveStyle({ color: Colors.light.textSecondary });
    });
});
