import { act, renderHook } from '@testing-library/react-native';

import { useAposAtraso } from '../use-apos-atraso';

// O esqueleto só aparece depois de um tempo: com rede rápida, o conteúdo chega antes e nada pisca.

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('useAposAtraso', () => {
    it('começa falso, e vira verdadeiro só depois do atraso', async () => {
        const { result } = await renderHook(() => useAposAtraso(true, 300));
        expect(result.current).toBe(false);

        await act(() => jest.advanceTimersByTime(299));
        expect(result.current).toBe(false);

        await act(() => jest.advanceTimersByTime(1));
        expect(result.current).toBe(true);
    });

    it('o atraso padrão é de 300 ms', async () => {
        const { result } = await renderHook(() => useAposAtraso(true));

        await act(() => jest.advanceTimersByTime(300));

        expect(result.current).toBe(true);
    });

    it('se o conteúdo chega antes do atraso, nunca vira verdadeiro', async () => {
        const { result, rerender } = await renderHook((ativo: boolean) => useAposAtraso(ativo, 300), { initialProps: true });

        await act(() => jest.advanceTimersByTime(200));
        await rerender(false);
        await act(() => jest.advanceTimersByTime(500));

        expect(result.current).toBe(false);
    });

    it('depois de verdadeiro, volta a falso quando o carregamento acaba', async () => {
        const { result, rerender } = await renderHook((ativo: boolean) => useAposAtraso(ativo, 300), { initialProps: true });
        await act(() => jest.advanceTimersByTime(300));
        expect(result.current).toBe(true);

        await rerender(false);

        expect(result.current).toBe(false);
    });

    it('um novo carregamento conta o atraso de novo', async () => {
        const { result, rerender } = await renderHook((ativo: boolean) => useAposAtraso(ativo, 300), { initialProps: true });
        await act(() => jest.advanceTimersByTime(300));
        await rerender(false);

        await rerender(true);
        expect(result.current).toBe(false);
        await act(() => jest.advanceTimersByTime(300));

        expect(result.current).toBe(true);
    });
});
