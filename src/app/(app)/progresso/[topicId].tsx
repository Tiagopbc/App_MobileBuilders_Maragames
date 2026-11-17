import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { TelaDoTopico } from '@/components/progresso/tela-do-topico';
import { useLicoes } from '@/hooks/use-licoes';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { useSession } from '@/lib/session';

// O detalhe de um tópico no Progresso (Fase 5 do plano): /progresso/mda_framework.
export default function TopicoScreen() {
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const { user, perfil } = useSession();
    const router = useRouter();
    const sair = useVoltarOu('/progresso');

    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a tela ganha foco, inclusive na volta da lição.
    useRecarregarAoFocar(recarregar);

    if (!user) return <Redirect href="/home" />;

    return (
        <TelaDoTopico
            estado={estado}
            topicId={topicId}
            aoAbrirLicao={() => router.push({ pathname: '/licoes/[topicId]', params: { topicId } })}
            aoTentarDeNovo={recarregar}
            aoSair={sair}
        />
    );
}
