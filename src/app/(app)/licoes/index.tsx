import { Redirect, useRouter } from 'expo-router';

import { TelaDasLicoes } from '@/components/licao/tela-das-licoes';
import { MODULOS_EM_BREVE } from '@/constants/em-breve';
import { useAoVoltarAoApp } from '@/hooks/use-ao-voltar-ao-app';
import { useLicoes } from '@/hooks/use-licoes';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { useSession } from '@/lib/session';

// A lista de lições (item 30): /licoes. O aluno escolhe o assunto e a ordem.
export default function LicoesScreen() {
    const { user, perfil } = useSession();
    const router = useRouter();
    const sair = useVoltarOu('/home');

    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a lista ganha foco, inclusive na volta de uma lição.
    useRecarregarAoFocar(recarregar);
    // E quando o app volta do segundo plano: a situação das revisões muda com o dia.
    useAoVoltarAoApp(recarregar);

    if (!user) return <Redirect href="/home" />;

    return (
        <TelaDasLicoes
            estado={estado}
            emBreve={MODULOS_EM_BREVE}
            aoAbrir={(topicId) => router.push({ pathname: '/licoes/[topicId]', params: { topicId } })}
            aoTentarDeNovo={recarregar}
            aoSair={sair}
        />
    );
}
