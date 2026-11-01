import { act, render, screen, within } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { AntesEDepois } from '../antes-e-depois';

// O antes e o depois do fim da lição: uma barra de segmentos para cada lado, um segmento por
// questão, cheio quando a pessoa acertou.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

const props = {
    rotuloAntes: 'Antes · diagnóstico',
    antes: { acertos: 1, total: 3 },
    rotuloDepois: 'Depois · verificação',
    depois: { acertos: 3, total: 3 },
};

describe('o antes e o depois', () => {
    it('mostra os dois rótulos e o "x de y" de cada lado', async () => {
        await render(<AntesEDepois {...props} />);

        expect(screen.getByText('Antes · diagnóstico')).toBeOnTheScreen();
        expect(screen.getByText('Depois · verificação')).toBeOnTheScreen();
        expect(screen.getByText('1 de 3')).toBeOnTheScreen();
        expect(screen.getByText('3 de 3')).toBeOnTheScreen();
    });

    it('cada lado tem um segmento por questão, e os cheios são os acertos', async () => {
        await render(<AntesEDepois {...props} />);

        const antes = within(screen.getByTestId('barras-antes'));
        expect(antes.getAllByTestId('segmento-cheio')).toHaveLength(1);
        expect(antes.getAllByTestId('segmento-vazio')).toHaveLength(2);

        const depois = within(screen.getByTestId('barras-depois'));
        expect(depois.getAllByTestId('segmento-cheio')).toHaveLength(3);
        expect(depois.queryAllByTestId('segmento-vazio')).toHaveLength(0);
    });

    it('cada lado é um item só para o leitor de tela, com o rótulo e o resultado', async () => {
        await render(<AntesEDepois {...props} />);

        expect(screen.getByLabelText('Antes · diagnóstico: 1 de 3')).toBeOnTheScreen();
        expect(screen.getByLabelText('Depois · verificação: 3 de 3')).toBeOnTheScreen();
    });

    it('sem questões, não desenha segmento nenhum', async () => {
        await render(<AntesEDepois {...props} antes={{ acertos: 0, total: 0 }} depois={{ acertos: 0, total: 0 }} />);

        expect(screen.queryAllByTestId('segmento-cheio')).toHaveLength(0);
        expect(screen.queryAllByTestId('segmento-vazio')).toHaveLength(0);
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('o segmento cheio é a cor de sucesso e o vazio é a cor da borda', async () => {
        await render(<AntesEDepois {...props} />);

        expect(screen.getAllByTestId('segmento-cheio')[0]).toHaveStyle({ backgroundColor: Colors[esquema].sucesso });
        expect(screen.getAllByTestId('segmento-vazio')[0]).toHaveStyle({ backgroundColor: Colors[esquema].borda });
    });
});
