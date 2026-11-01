import { act, render, screen } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { RevisaoSelada } from '../revisao-selada';

// A revisão que ainda não abriu: uma carta selada, com o cadeado, o dia em que abre e quantos dias faltam.
// Não leva toque: a revisão que vence sobe sozinha para o Para hoje.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

const props = { titulo: 'O que é Game Design', quandoAbre: 'A revisão abre na quinta, 12/11.', diasRestantes: 5 };

describe('a revisão selada', () => {
    it('diz de qual lição é, quando abre e quantos dias faltam', async () => {
        await render(<RevisaoSelada {...props} />);

        expect(screen.getByText('Revisão de O que é Game Design')).toBeOnTheScreen();
        expect(screen.getByText('A revisão abre na quinta, 12/11.')).toBeOnTheScreen();
        expect(screen.getByText('5 d')).toBeOnTheScreen();
    });

    it('o leitor de tela ouve uma frase só, com os dias por extenso', async () => {
        await render(<RevisaoSelada {...props} />);

        expect(screen.getByLabelText('Revisão de O que é Game Design, em 5 dias. A revisão abre na quinta, 12/11.')).toBeOnTheScreen();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('a de amanhã diz "amanhã"', async () => {
        await render(<RevisaoSelada {...props} diasRestantes={1} />);

        expect(screen.getByLabelText(/Revisão de O que é Game Design, amanhã\./)).toBeOnTheScreen();
        expect(screen.getByText('1 d')).toBeOnTheScreen();
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('é um card apagado com o contorno tracejado, e a carta do cadeado na cor de realce', async () => {
        await render(<RevisaoSelada {...props} />);

        expect(screen.getByTestId('revisao-selada')).toHaveStyle({
            backgroundColor: Colors[esquema].fundoApagado,
            borderColor: Colors[esquema].bordaSelecionada,
            borderStyle: 'dashed',
        });
        expect(screen.getByTestId('carta-do-cadeado')).toHaveStyle({ backgroundColor: Colors[esquema].realce });
    });
});
