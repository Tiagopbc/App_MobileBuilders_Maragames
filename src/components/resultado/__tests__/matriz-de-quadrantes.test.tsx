import { act, render, screen, within } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { DESCRICAO_QUADRANTE, ROTULO_QUADRANTE } from '@/constants/textos';
import { escolherTema } from '@/lib/tema';

import { MatrizDeQuadrantes } from '../matriz-de-quadrantes';

// A matriz 2×2 do resultado: acertou e errou nas linhas, com e sem certeza nas colunas. A forma diz
// o quadrante, e não só a cor: fundo tingido é acertou, só contorno é errou, linha contínua é com
// certeza e tracejada é sem certeza. Com `quadrantes` ela conta; sem, só explica.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

const CONTAGEM = { firme: 9, fragil: 3, ponto_cego: 2, lacuna: 1 };

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    const cores = Colors[esquema];

    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('acertou tem o fundo do quadrante; errou fica só com o contorno, sobre o card', async () => {
        await render(<MatrizDeQuadrantes quadrantes={CONTAGEM} />);

        expect(screen.getByLabelText('Firme: 9')).toHaveStyle({ backgroundColor: cores.fundoFirme, borderColor: cores.sucesso });
        expect(screen.getByLabelText('Frágil: 3')).toHaveStyle({ backgroundColor: cores.fundoFragil, borderColor: cores.aviso });
        expect(screen.getByLabelText('Ponto cego: 2')).toHaveStyle({ backgroundColor: cores.cartao, borderColor: cores.erro });
        expect(screen.getByLabelText('Lacuna: 1')).toHaveStyle({ backgroundColor: cores.cartao, borderColor: cores.lacuna });
    });

    it('com certeza, a linha é contínua; sem certeza, tracejada', async () => {
        await render(<MatrizDeQuadrantes quadrantes={CONTAGEM} />);

        expect(screen.getByLabelText('Firme: 9')).toHaveStyle({ borderStyle: 'solid' });
        expect(screen.getByLabelText('Ponto cego: 2')).toHaveStyle({ borderStyle: 'solid' });
        expect(screen.getByLabelText('Frágil: 3')).toHaveStyle({ borderStyle: 'dashed' });
        expect(screen.getByLabelText('Lacuna: 1')).toHaveStyle({ borderStyle: 'dashed' });
    });

    it('o destaque tinge o quadrante errado e engrossa o contorno', async () => {
        await render(<MatrizDeQuadrantes quadrantes={CONTAGEM} destaque="ponto_cego" />);

        expect(screen.getByLabelText('Ponto cego: 2')).toHaveStyle({
            backgroundColor: cores.fundoPontoCego,
            borderColor: cores.erro,
            borderWidth: 2.5,
        });
        expect(screen.getByLabelText('Lacuna: 1')).toHaveStyle({ backgroundColor: cores.cartao, borderWidth: 1.5 });
    });
});

describe('a matriz', () => {
    it('tem os quatro quadrantes, com nome e descrição, e as legendas das linhas e das colunas', async () => {
        await render(<MatrizDeQuadrantes />);

        const matriz = within(screen.getByTestId('matriz-de-quadrantes'));
        for (const legenda of ['Com certeza', 'Sem certeza', 'Acertou', 'Errou']) {
            expect(matriz.getByText(legenda)).toBeOnTheScreen();
        }
        for (const [quadrante, rotulo] of Object.entries(ROTULO_QUADRANTE)) {
            expect(matriz.getByText(rotulo)).toBeOnTheScreen();
            expect(matriz.getByText(DESCRICAO_QUADRANTE[quadrante as keyof typeof DESCRICAO_QUADRANTE])).toBeOnTheScreen();
        }
    });

    it('com a contagem, mostra o número em cada quadrante e o diz ao leitor de tela', async () => {
        await render(<MatrizDeQuadrantes quadrantes={CONTAGEM} />);

        const matriz = within(screen.getByTestId('matriz-de-quadrantes'));
        expect(matriz.getByText('9')).toBeOnTheScreen();
        expect(matriz.getByText('3')).toBeOnTheScreen();
        expect(screen.getByLabelText('Ponto cego: 2')).toBeOnTheScreen();
    });

    it('sem a contagem, não mostra número nenhum', async () => {
        await render(<MatrizDeQuadrantes />);

        expect(screen.queryByLabelText(/: \d+$/)).toBeNull();
        expect(screen.queryByText(/^\d+$/)).toBeNull();
    });
});
