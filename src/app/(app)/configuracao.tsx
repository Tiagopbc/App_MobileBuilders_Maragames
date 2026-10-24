import { useRouter } from 'expo-router';

import { TelaDeConfiguracao } from '@/components/boas-vindas/tela-de-configuracao';

// A Configuração: /configuracao.
export default function ConfiguracaoScreen() {
    const router = useRouter();

    function voltar() {
        // Na web, quem abre a URL direto não tem para onde voltar.
        if (router.canGoBack()) router.back();
        else router.replace('/');
    }

    return <TelaDeConfiguracao aoVoltar={voltar} />;
}
