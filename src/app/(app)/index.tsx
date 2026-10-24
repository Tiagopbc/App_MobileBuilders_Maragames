import { useRouter } from 'expo-router';

import { TelaDeBoasVindas } from '@/components/boas-vindas/tela-de-boas-vindas';

// A primeira tela de quem já entrou: /. A home, com o "Olá" e o Para hoje, ficou em /home.
export default function BoasVindasScreen() {
    const router = useRouter();

    return (
        <TelaDeBoasVindas
            // Troca a boas-vindas pela home: a home vira a base, e o gesto de voltar não a reabre.
            aoIniciar={() => router.replace('/home')}
            aoAbrirConfiguracao={() => router.push('/configuracao')}
            aoAbrirRegras={() => router.push('/regras')}
        />
    );
}
