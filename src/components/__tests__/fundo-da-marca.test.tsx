import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { FundoDaMarca } from '../fundo-da-marca';

// O fundo das telas: o padrão da Beast Maragames repetido atrás do conteúdo, nos dois temas, sobre
// a cor de fundo de cada um. O ladrilho tem 300 pt e é repetido em grade até cobrir a
// tela: o `resizeMode="repeat"` do iOS desenhava um ladrilho só.
async function abrir() {
    await render(
        <FundoDaMarca testID="fundo">
            <Text>conteúdo</Text>
        </FundoDaMarca>,
    );
}

// A tela de um iPhone 17 Pro: 402 × 874 pt pede 2 colunas e 3 linhas de ladrilhos.
async function medir(largura = 402, altura = 874) {
    await fireEvent(screen.getByTestId('fundo'), 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: largura, height: altura } },
    });
}

const padrao = () => screen.queryByTestId('padrao-da-marca');
const ladrilhos = () => screen.queryAllByTestId('ladrilho');

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe('o fundo da marca', () => {
    it('no escuro, cobre a tela com o ladrilho do padrão, atrás do conteúdo', async () => {
        await act(() => escolherTema('escuro'));
        await abrir();

        await medir();

        expect(padrao()).toBeOnTheScreen();
        expect(ladrilhos()).toHaveLength(6);
        expect(ladrilhos()[0]).toHaveStyle({ width: 300, height: 300 });
        expect(screen.getByTestId('fundo')).toHaveStyle({ backgroundColor: Colors.dark.background });
        expect(screen.getByText('conteúdo')).toBeOnTheScreen();
    });

    it('numa tela maior, põe mais ladrilhos', async () => {
        await act(() => escolherTema('escuro'));
        await abrir();

        await medir(1280, 800);

        expect(ladrilhos()).toHaveLength(5 * 3);
    });

    it('no claro, cobre a tela com o mesmo ladrilho, sobre o fundo lilás', async () => {
        await act(() => escolherTema('claro'));
        await abrir();

        await medir();

        expect(padrao()).toBeOnTheScreen();
        expect(ladrilhos()).toHaveLength(6);
        expect(ladrilhos()[0]).toHaveStyle({ width: 300, height: 300 });
        expect(screen.getByTestId('fundo')).toHaveStyle({ backgroundColor: Colors.light.background });
        expect(screen.getByText('conteúdo')).toBeOnTheScreen();
    });

    it('a troca de tema com a tela aberta mantém o padrão e troca só a cor de fundo', async () => {
        await act(() => escolherTema('claro'));
        await abrir();
        await medir();

        await act(() => escolherTema('escuro'));
        expect(ladrilhos()).toHaveLength(6);
        expect(screen.getByTestId('fundo')).toHaveStyle({ backgroundColor: Colors.dark.background });

        await act(() => escolherTema('claro'));
        expect(ladrilhos()).toHaveLength(6);
        expect(screen.getByTestId('fundo')).toHaveStyle({ backgroundColor: Colors.light.background });
    });
});
