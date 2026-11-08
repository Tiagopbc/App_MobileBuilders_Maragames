import { act, render, screen, userEvent } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { ConviteDasRegras } from '../convite-das-regras';

// A faixa de convite da boas-vindas: para quem ainda não terminou nenhuma lição, a porta mais à vista para
// o Como jogar. Quando a pessoa já jogou, ela some e fica o botão ? fixo no topo.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe('o convite para o Como jogar', () => {
    it('pergunta se é a primeira vez e diz o que a pessoa vai encontrar', async () => {
        await render(<ConviteDasRegras aoAbrir={() => {}} />);

        expect(screen.getByText('Primeira vez por aqui?')).toBeOnTheScreen();
        expect(screen.getByText('Veja como o jogo funciona')).toBeOnTheScreen();
    });

    it('é um link só para o leitor de tela, com a pergunta e a resposta', async () => {
        await render(<ConviteDasRegras aoAbrir={() => {}} />);

        expect(screen.getByRole('link', { name: 'Primeira vez por aqui? Veja como o jogo funciona' })).toBeOnTheScreen();
    });

    it('tocar abre o Como jogar', async () => {
        const aoAbrir = jest.fn();
        await render(<ConviteDasRegras aoAbrir={aoAbrir} />);

        await userEvent.setup().press(screen.getByRole('link', { name: /Primeira vez por aqui/ }));

        expect(aoAbrir).toHaveBeenCalledTimes(1);
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

    it('é o card selecionado, com o contorno de seleção, e o ícone num círculo na cor primária', async () => {
        await render(<ConviteDasRegras aoAbrir={() => {}} />);

        expect(screen.getByTestId('convite-das-regras')).toHaveStyle({
            backgroundColor: cores.cartaoSelecionado,
            borderColor: cores.bordaSelecionada,
        });
        expect(screen.getByTestId('icone-do-convite')).toHaveStyle({ backgroundColor: cores.primaria });
    });
});
