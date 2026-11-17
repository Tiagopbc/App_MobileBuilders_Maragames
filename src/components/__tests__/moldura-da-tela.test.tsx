import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { LarguraDoFormulario, MaxContentWidth } from '@/constants/theme';

import { CabecalhoComFechar, MolduraDaTela } from '../moldura-da-tela';

// O esqueleto comum das telas: o fundo da marca, a área segura com a largura máxima e o
// cabeçalho com o X de fechar.

describe('MolduraDaTela', () => {
    it('mostra o conteúdo sobre o fundo da marca', async () => {
        await render(
            <MolduraDaTela largura="conteudo">
                <Text>Conteúdo</Text>
            </MolduraDaTela>
        );

        expect(screen.getByText('Conteúdo')).toBeOnTheScreen();
        expect(screen.getByTestId('padrao-da-marca')).toBeOnTheScreen();
    });

    it.each([
        ['conteudo', MaxContentWidth],
        ['formulario', LarguraDoFormulario],
    ] as const)('na largura %s, a área segura vai até %i', async (largura, maximo) => {
        await render(
            <MolduraDaTela largura={largura}>
                <Text>Conteúdo</Text>
            </MolduraDaTela>
        );

        expect(screen.getByTestId('area-segura')).toHaveStyle({ flex: 1, maxWidth: maximo });
    });
});

describe('CabecalhoComFechar', () => {
    it('o X tem o rótulo dado e chama o fechar', async () => {
        const aoFechar = jest.fn();
        await render(
            <CabecalhoComFechar rotulo="Fechar a lição" aoFechar={aoFechar}>
                <Text>Título</Text>
            </CabecalhoComFechar>
        );

        await userEvent.setup().press(screen.getByRole('button', { name: 'Fechar a lição' }));

        expect(aoFechar).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Título')).toBeOnTheScreen();
    });

    it('desabilitado, o X não fecha', async () => {
        const aoFechar = jest.fn();
        await render(
            <CabecalhoComFechar rotulo="Fechar" aoFechar={aoFechar} desabilitado>
                <Text>Título</Text>
            </CabecalhoComFechar>
        );

        await userEvent.setup().press(screen.getByRole('button', { name: 'Fechar' }));

        expect(aoFechar).not.toHaveBeenCalled();
    });
});
