import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { TelaDeConquistas, type EstadoDasConquistas } from '@/components/conquistas/tela-de-conquistas';
import { useLicoes } from '@/hooks/use-licoes';
import { conquistasDoAluno } from '@/lib/conquistas';
import { participanteDoRoteiro } from '@/lib/participante';
import { useSession } from '@/lib/session';

// As Conquistas: /conquistas, aberta pelo número de medalhas da carta de jogador.
export default function ConquistasScreen() {
    const router = useRouter();
    const { user, perfil } = useSession();
    const { formaPre } = participanteDoRoteiro(perfil);
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a tela ganha foco, para a medalha ganha agora já estar aqui.
    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    function voltar() {
        // Na web, quem abre a URL direto não tem para onde voltar.
        if (router.canGoBack()) router.back();
        else router.replace('/');
    }

    const conquistas: EstadoDasConquistas =
        estado.tipo === 'pronto'
            ? {
                  tipo: 'pronto',
                  conquistas: conquistasDoAluno({
                      licoes: estado.licoes,
                      respostas: estado.respostas,
                      questoes: estado.questoes,
                      formaPre,
                  }),
              }
            : { tipo: estado.tipo };

    return <TelaDeConquistas estado={conquistas} aoVoltar={voltar} aoTentarDeNovo={recarregar} />;
}
