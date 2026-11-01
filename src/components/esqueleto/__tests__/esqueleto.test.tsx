import { act, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { Esqueleto, Pulsar } from '../esqueleto';

// O esqueleto de carregamento: formas na cor de realce do tema, com um pulso de opacidade, sem
// brilho deslizante. Com "reduzir movimento" ligado, fica parado.

afterEach(async () => {
    jest.restoreAllMocks();
    await act(() => escolherTema('sistema'));
});

describe('o pulso', () => {
    it('anuncia ao leitor de tela só "Carregando", em vez de ler cada forma', async () => {
        await render(
            <Pulsar>
                <Text>forma</Text>
            </Pulsar>
        );

        expect(screen.getByLabelText('Carregando')).toBeOnTheScreen();
    });

    it('pulsa em laço', async () => {
        const laco = jest.spyOn(Animated, 'loop');
        await render(<Pulsar>{null}</Pulsar>);
        await act(async () => {});

        expect(laco).toHaveBeenCalledTimes(1);
    });

    it('com "reduzir movimento" ligado, não anima', async () => {
        jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
        const laco = jest.spyOn(Animated, 'loop');
        await render(<Pulsar>{null}</Pulsar>);
        await act(async () => {});

        expect(screen.getByTestId('pulso')).toHaveStyle({ opacity: 1 });
        expect(laco).not.toHaveBeenCalled();
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('a forma é da cor de realce, com o tamanho pedido', async () => {
        await render(<Esqueleto testID="forma" largura={120} altura={14} />);

        expect(screen.getByTestId('forma')).toHaveStyle({
            width: 120,
            height: 14,
            backgroundColor: Colors[esquema].realce,
        });
    });
});
