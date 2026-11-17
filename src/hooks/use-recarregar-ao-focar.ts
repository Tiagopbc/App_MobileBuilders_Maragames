// Relê os dados cada vez que a tela ganha foco, inclusive na volta de outra tela, e não só na
// primeira vez: nada é guardado, tudo sai das respostas a cada leitura.

import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/** `recarregar` precisa ser sempre a mesma função (com `useCallback`), ou o efeito é refeito a cada desenho. */
export function useRecarregarAoFocar(recarregar: () => unknown) {
    useFocusEffect(
        useCallback(() => {
            // Entre chaves: o efeito de foco só aceita devolver uma função de limpeza, e não a promessa da leitura.
            recarregar();
        }, [recarregar])
    );
}
