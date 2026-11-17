import { Redirect, useRouter } from 'expo-router';

import { TelaDoProgresso } from '@/components/progresso/tela-do-progresso';
import { useLicoes } from '@/hooks/use-licoes';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { useSession } from '@/lib/session';

// O Progresso (Fase 5 do plano): /progresso. O "Meu domínio" do aluno.
export default function ProgressoScreen() {
    const { user, perfil } = useSession();
    const router = useRouter();
    const sair = useVoltarOu('/home');

    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a tela ganha foco, inclusive na volta do detalhe de um tópico.
    useRecarregarAoFocar(recarregar);

    if (!user) return <Redirect href="/home" />;

    return (
        <TelaDoProgresso
            estado={estado}
            aoAbrir={(topicId) => router.push({ pathname: '/progresso/[topicId]', params: { topicId } })}
            aoComecar={(topicId) => router.push({ pathname: '/licoes/[topicId]', params: { topicId } })}
            aoTentarDeNovo={recarregar}
            aoSair={sair}
        />
    );
}
