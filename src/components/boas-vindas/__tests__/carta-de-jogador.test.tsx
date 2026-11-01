import { act, render, screen } from '@testing-library/react-native';

import { Colors, Raio, Relevo } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { CartaDeJogador } from '../carta-de-jogador';

// A carta de jogador da boas-vindas: a placa com o tipo e o apelido, e os dois números da pessoa.
// É a mesma carta de jogo do cartão de conceito: fundo do cartão, contorno e relevo embaixo.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    const cores = Colors[esquema];

    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('tem o fundo do cartão, o contorno e o relevo embaixo, e a placa na cor da placa da carta', async () => {
        await render(<CartaDeJogador apelido="Paulo" sequencia={3} xp={18} />);

        expect(screen.getByTestId('carta-de-jogador')).toHaveStyle({
            backgroundColor: cores.cartao,
            borderColor: cores.bordaDoCartao,
            borderBottomColor: cores.relevoDoCartao,
            borderBottomWidth: 1.5 + Relevo[esquema].espessura,
            borderRadius: Raio.carta,
        });
        expect(screen.getByTestId('placa-da-carta-de-jogador')).toHaveStyle({ backgroundColor: cores.placaDaCarta });
    });
});

describe('a carta de jogador', () => {
    it('diz o tipo da carta e o apelido na placa', async () => {
        await render(<CartaDeJogador apelido="Paulo" sequencia={3} xp={18} />);

        expect(screen.getByText('Pessoa jogadora')).toBeOnTheScreen();
        expect(screen.getByText('Paulo')).toBeOnTheScreen();
    });

    it('mostra a sequência e o XP, e o leitor de tela ouve cada um por inteiro', async () => {
        await render(<CartaDeJogador apelido="Paulo" sequencia={3} xp={18} />);

        expect(screen.getByLabelText('3 dias seguidos')).toBeOnTheScreen();
        expect(screen.getByText('dias seguidos')).toBeOnTheScreen();
        expect(screen.getByText('+18')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: +18')).toBeOnTheScreen();
    });

    it('concorda no singular', async () => {
        await render(<CartaDeJogador apelido="Paulo" sequencia={1} xp={3} />);

        expect(screen.getByLabelText('1 dia seguido')).toBeOnTheScreen();
        expect(screen.getByText('dia seguido')).toBeOnTheScreen();
    });

    it('sem sequência, mostra zero e a dica de como começar; com sequência, a dica some', async () => {
        const { rerender } = await render(<CartaDeJogador apelido="Paulo" sequencia={0} xp={0} />);

        expect(screen.getByLabelText('0 dias seguidos')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: 0')).toBeOnTheScreen();
        expect(screen.getByText('Responda uma questão para começar a sequência.')).toBeOnTheScreen();

        await rerender(<CartaDeJogador apelido="Paulo" sequencia={2} xp={0} />);

        expect(screen.queryByText(/Responda uma questão/)).toBeNull();
    });
});
