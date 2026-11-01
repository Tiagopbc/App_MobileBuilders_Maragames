import { useEffect, useState } from 'react';

/**
 * Vira verdadeiro só depois que `ativo` ficou verdadeiro por `ms` milissegundos seguidos. Serve ao
 * esqueleto de carregamento: com rede rápida, o conteúdo chega antes e nada pisca na tela. Volta a
 * falso assim que `ativo` acaba, e um novo carregamento conta o atraso desde o começo.
 */
export function useAposAtraso(ativo: boolean, ms = 300): boolean {
    const [passou, setPassou] = useState(false);

    useEffect(() => {
        if (!ativo) return;

        const espera = setTimeout(() => setPassou(true), ms);
        return () => {
            clearTimeout(espera);
            setPassou(false);
        };
    }, [ativo, ms]);

    return ativo && passou;
}
