import { renderHook } from '@testing-library/react-native';

import { useVoltarOu } from '../use-voltar-ou';

// O "voltar" das telas: na pilha, volta; sem ter para onde voltar (na web, quem abre o endereço
// direto), troca para o destino que a rota escolheu.

const mockRouter = { canGoBack: jest.fn(), back: jest.fn(), replace: jest.fn() };

jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

beforeEach(() => jest.clearAllMocks());

describe('useVoltarOu', () => {
    it('com tela anterior na pilha, volta para ela', async () => {
        mockRouter.canGoBack.mockReturnValue(true);
        const { result } = await renderHook(() => useVoltarOu('/home'));

        result.current();

        expect(mockRouter.back).toHaveBeenCalledTimes(1);
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('sem ter para onde voltar, troca para o destino', async () => {
        mockRouter.canGoBack.mockReturnValue(false);
        const { result } = await renderHook(() => useVoltarOu('/perfil'));

        result.current();

        expect(mockRouter.back).not.toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/perfil');
    });

    it('aceita o destino com parâmetros, como a página de uma lição', async () => {
        mockRouter.canGoBack.mockReturnValue(false);
        const destino = { pathname: '/licoes/[topicId]', params: { topicId: 'mda_framework' } } as const;
        const { result } = await renderHook(() => useVoltarOu(destino));

        result.current();

        expect(mockRouter.replace).toHaveBeenCalledWith(destino);
    });

    it('só decide na hora do toque: montar a tela não navega', async () => {
        mockRouter.canGoBack.mockReturnValue(false);
        await renderHook(() => useVoltarOu('/home'));

        expect(mockRouter.back).not.toHaveBeenCalled();
        expect(mockRouter.replace).not.toHaveBeenCalled();
    });
});
