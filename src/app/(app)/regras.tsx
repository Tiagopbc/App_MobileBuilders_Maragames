import { useRouter } from 'expo-router';

import { TelaDeRegras } from '@/components/boas-vindas/tela-de-regras';

// As Regras do jogo: /regras.
export default function RegrasScreen() {
    const router = useRouter();

    function voltar() {
        // Na web, quem abre a URL direto não tem para onde voltar.
        if (router.canGoBack()) router.back();
        else router.replace('/');
    }

    return <TelaDeRegras aoVoltar={voltar} />;
}
