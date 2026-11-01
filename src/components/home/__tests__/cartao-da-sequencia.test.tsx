import { act, render, screen } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';
import type { DiaDaSemana } from '@/lib/sequencia';

import { CartaoDaSequencia } from '../cartao-da-sequencia';

// O card da sequência: o número de dias seguidos e a semana, de segunda a domingo. Mostra o que
// houve, e não o que falta; o único recado é o próximo passo de hoje, enquanto hoje está em aberto.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

const vazio: DiaDaSemana = { feito: false, hoje: false };
const feito: DiaDaSemana = { feito: true, hoje: false };
// Segunda e terça sem resposta, quarta a sexta com, hoje é sexta sem resposta ainda: o domingo e o sábado vazios.
const SEMANA: DiaDaSemana[] = [vazio, vazio, feito, feito, { feito: false, hoje: true }, vazio, vazio];

describe('o card da sequência', () => {
    it('diz os dias seguidos e mostra as sete letras da semana, começando na segunda', async () => {
        await render(<CartaoDaSequencia sequencia={3} semana={SEMANA} />);

        expect(screen.getByText('3 dias seguidos')).toBeOnTheScreen();
        for (const rotulo of ['segunda, sem resposta', 'quarta, com resposta', 'sexta, hoje, sem resposta', 'domingo, sem resposta']) {
            expect(screen.getByLabelText(rotulo)).toBeOnTheScreen();
        }
        expect(screen.getAllByText('S')).toHaveLength(3);
        expect(screen.getAllByText('Q')).toHaveLength(2);
    });

    it('concorda no singular e aceita o zero', async () => {
        const { rerender } = await render(<CartaoDaSequencia sequencia={1} semana={SEMANA} />);
        expect(screen.getByText('1 dia seguido')).toBeOnTheScreen();

        await rerender(<CartaoDaSequencia sequencia={0} semana={SEMANA} />);
        expect(screen.getByText('0 dias seguidos')).toBeOnTheScreen();
    });

    it('enquanto hoje não teve resposta, diz o próximo passo; com hoje respondido, o recado some', async () => {
        const { rerender } = await render(<CartaoDaSequencia sequencia={3} semana={SEMANA} />);
        expect(screen.getByText('responda 1 questão hoje')).toBeOnTheScreen();

        const hojeRespondido = SEMANA.map((d) => (d.hoje ? { feito: true, hoje: true } : d));
        await rerender(<CartaoDaSequencia sequencia={4} semana={hojeRespondido} />);
        expect(screen.queryByText('responda 1 questão hoje')).toBeNull();
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

    it('o dia com resposta é cheio na cor de aviso, o de hoje em aberto só tem o anel, e os vazios são tracejados', async () => {
        await render(<CartaoDaSequencia sequencia={3} semana={SEMANA} />);

        expect(screen.getByTestId('dia-2')).toHaveStyle({ backgroundColor: cores.aviso });
        expect(screen.getByTestId('dia-4')).toHaveStyle({ borderColor: cores.aviso, borderWidth: 2 });
        expect(screen.getByTestId('dia-0')).toHaveStyle({ borderStyle: 'dashed' });
    });

    it('a chama ganha a cor de aviso a partir do primeiro dia; com zero, fica neutra', async () => {
        const { rerender } = await render(<CartaoDaSequencia sequencia={2} semana={SEMANA} />);
        expect(screen.getByTestId('chama')).toHaveStyle({ color: cores.aviso });

        await rerender(<CartaoDaSequencia sequencia={0} semana={SEMANA} />);
        expect(screen.getByTestId('chama')).toHaveStyle({ color: cores.textSecondary });
    });
});
