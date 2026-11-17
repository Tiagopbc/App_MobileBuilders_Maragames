import { renderHook } from '@testing-library/react-native';

import { useRecarregarAoFocar } from '../use-recarregar-ao-focar';

// As telas não guardam nada: releem as respostas cada vez que ganham foco, inclusive na volta de
// outra tela. Aqui o foco é simulado: o teste guarda o efeito que o gancho entrega ao Expo Router.

const mockEfeitos: (() => unknown)[] = [];

jest.mock('expo-router', () => ({
    useFocusEffect: (efeito: () => unknown) => {
        mockEfeitos.push(efeito);
    },
}));

const focar = () => mockEfeitos[mockEfeitos.length - 1]();

beforeEach(() => {
    mockEfeitos.length = 0;
});

describe('useRecarregarAoFocar', () => {
    it('recarrega quando a tela ganha foco, e de novo a cada volta', async () => {
        const recarregar = jest.fn();
        await renderHook(() => useRecarregarAoFocar(recarregar));

        focar();
        focar();

        expect(recarregar).toHaveBeenCalledTimes(2);
    });

    it('não devolve a promessa da leitura: o efeito de foco só aceita uma função de limpeza', async () => {
        const recarregar = jest.fn(async () => {});
        await renderHook(() => useRecarregarAoFocar(recarregar));

        expect(focar()).toBeUndefined();
    });

    it('com a mesma função, o efeito não é refeito a cada desenho', async () => {
        const recarregar = jest.fn();
        const { rerender } = await renderHook(() => useRecarregarAoFocar(recarregar));
        const primeiro = mockEfeitos[0];

        await rerender(undefined);

        expect(mockEfeitos[mockEfeitos.length - 1]).toBe(primeiro);
    });
});
