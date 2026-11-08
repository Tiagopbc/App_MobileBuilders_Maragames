import { act, render, screen, userEvent, within } from '@testing-library/react-native';

import { Colors, Raio, Relevo } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { CartaDeJogador } from '../carta-de-jogador';

// A carta de jogador: uma carta de jogo com a arte do lobinho sobre dois anéis, a placa com o apelido e o
// tipo, e os três números da pessoa. É a mesma carta de jogo do cartão de conceito: fundo do cartão,
// contorno e relevo embaixo. Ela aparece na boas-vindas e vai aparecer em outros momentos do app.

const aoAbrirConquistas = jest.fn();
const numeros = { sequencia: 3, xp: 18, medalhas: { ganhas: 2, total: 6 } };
const base = { apelido: 'Paulo', numeros, aoAbrirConquistas };

beforeEach(() => aoAbrirConquistas.mockClear());

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
        await render(<CartaDeJogador {...base} />);

        expect(screen.getByTestId('carta-de-jogador')).toHaveStyle({
            backgroundColor: cores.cartao,
            borderColor: cores.bordaDoCartao,
            borderBottomColor: cores.relevoDoCartao,
            borderBottomWidth: 1.5 + Relevo[esquema].espessura,
            borderRadius: Raio.folha,
        });
        expect(screen.getByTestId('placa-da-carta-de-jogador')).toHaveStyle({ backgroundColor: cores.placaDaCarta });
    });

    it('a arte é uma janela na cor da caixa da carta, com os dois anéis na cor de realce', async () => {
        await render(<CartaDeJogador {...base} />);

        expect(screen.getByTestId('arte-da-carta')).toHaveStyle({
            backgroundColor: cores.caixaDaCarta,
            borderColor: cores.bordaDaCaixa,
        });
        for (const anel of ['anel-externo', 'anel-interno']) {
            expect(screen.getByTestId(anel)).toHaveStyle({ backgroundColor: cores.realce });
        }
    });

    it('a chama dos dias seguidos ganha a cor de aviso a partir do primeiro dia; com zero, fica neutra', async () => {
        const { rerender } = await render(<CartaDeJogador {...base} />);
        expect(screen.getByTestId('chama-da-carta')).toHaveStyle({ color: cores.aviso });

        await rerender(<CartaDeJogador {...base} numeros={{ ...numeros, sequencia: 0 }} />);
        expect(screen.getByTestId('chama-da-carta')).toHaveStyle({ color: cores.textSecondary });
    });
});

describe('a carta de jogador', () => {
    it('diz o apelido e o tipo da carta na placa', async () => {
        await render(<CartaDeJogador {...base} />);

        const placa = within(screen.getByTestId('placa-da-carta-de-jogador'));
        expect(placa.getByText('Paulo')).toBeOnTheScreen();
        expect(placa.getByText('Pessoa jogadora')).toBeOnTheScreen();
    });

    it('a arte tem o lobinho, que o leitor de tela descreve, sobre os dois anéis', async () => {
        await render(<CartaDeJogador {...base} />);

        const arte = within(screen.getByTestId('arte-da-carta'));
        expect(arte.getByRole('image', { name: 'O lobinho da Beast Maragames segurando um controle' })).toBeOnTheScreen();
        expect(arte.getByTestId('anel-externo')).toBeOnTheScreen();
        expect(arte.getByTestId('anel-interno')).toBeOnTheScreen();
    });

    it('mostra a sequência e o XP, e o leitor de tela ouve cada um por inteiro', async () => {
        await render(<CartaDeJogador {...base} />);

        expect(screen.getByLabelText('3 dias seguidos')).toBeOnTheScreen();
        expect(screen.getByText('dias seguidos')).toBeOnTheScreen();
        expect(screen.getByText('+18')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: +18')).toBeOnTheScreen();
    });

    it('concorda no singular', async () => {
        await render(<CartaDeJogador {...base} numeros={{ ...numeros, sequencia: 1, xp: 3 }} />);

        expect(screen.getByLabelText('1 dia seguido')).toBeOnTheScreen();
        expect(screen.getByText('dia seguido')).toBeOnTheScreen();
    });

    it('sem sequência nem XP, mostra zero, sem dica e sem cobrança', async () => {
        await render(<CartaDeJogador {...base} numeros={{ sequencia: 0, xp: 0, medalhas: { ganhas: 0, total: 6 } }} />);

        expect(screen.getByLabelText('0 dias seguidos')).toBeOnTheScreen();
        expect(screen.getByLabelText('XP: 0')).toBeOnTheScreen();
        expect(screen.queryByText(/Responda uma questão/)).toBeNull();
    });

    it('sem apelido, a placa mostra só o tipo da carta', async () => {
        await render(<CartaDeJogador {...base} apelido="" />);

        const placa = within(screen.getByTestId('placa-da-carta-de-jogador'));
        expect(placa.getByText('Pessoa jogadora')).toBeOnTheScreen();
        expect(placa.getAllByText(/./)).toHaveLength(1);
    });

    it('enquanto os números não chegam, a carta mostra só a arte e a placa', async () => {
        await render(<CartaDeJogador {...base} numeros={null} />);

        expect(screen.getByTestId('arte-da-carta')).toBeOnTheScreen();
        expect(screen.getByText('Paulo')).toBeOnTheScreen();
        expect(screen.queryByText('dias seguidos')).toBeNull();
        expect(screen.queryByText('XP')).toBeNull();
        expect(screen.queryByRole('link')).toBeNull();
    });
});

describe('o terceiro número da carta, as medalhas', () => {
    it('mostra quantas medalhas já foram ganhas, e o leitor de tela ouve "2 de 6 medalhas"', async () => {
        await render(<CartaDeJogador {...base} />);

        expect(screen.getByText('2/6')).toBeOnTheScreen();
        expect(screen.getByText('medalhas')).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: '2 de 6 medalhas' })).toBeOnTheScreen();
    });

    it('com nenhuma medalha, mostra 0/6 sem tom de falta', async () => {
        await render(<CartaDeJogador {...base} numeros={{ ...numeros, medalhas: { ganhas: 0, total: 6 } }} />);

        expect(screen.getByText('0/6')).toBeOnTheScreen();
        expect(screen.getByRole('link', { name: '0 de 6 medalhas' })).toBeOnTheScreen();
    });

    it('é o único número que leva a algum lugar: tocar abre as Conquistas', async () => {
        await render(<CartaDeJogador {...base} />);

        await userEvent.setup().press(screen.getByRole('link', { name: '2 de 6 medalhas' }));

        expect(aoAbrirConquistas).toHaveBeenCalledTimes(1);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });

    it('sem as medalhas calculadas, a carta mostra só a sequência e o XP', async () => {
        await render(<CartaDeJogador {...base} numeros={{ ...numeros, medalhas: null }} />);

        expect(screen.queryByText('medalhas')).toBeNull();
        expect(screen.queryByRole('link')).toBeNull();
        expect(screen.getByLabelText('3 dias seguidos')).toBeOnTheScreen();
    });
});
