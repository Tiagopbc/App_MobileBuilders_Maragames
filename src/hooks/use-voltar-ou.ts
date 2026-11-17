// O "voltar" das telas: volta para a tela anterior ou, sem ter para onde voltar, troca para o
// destino que a rota escolheu. Na web, quem abre o endereço direto não tem tela anterior.

import { useRouter, type Href } from 'expo-router';

/** Devolve a função para o X ou a seta da tela. Só navega quando ela é chamada. */
export function useVoltarOu(destino: Href): () => void {
    const router = useRouter();

    return () => {
        if (router.canGoBack()) router.back();
        else router.replace(destino);
    };
}
