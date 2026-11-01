import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { TelaDeBoasVindas } from '@/components/boas-vindas/tela-de-boas-vindas';
import { useLicoes } from '@/hooks/use-licoes';
import { conquistasDoAluno, medalhasGanhas } from '@/lib/conquistas';
import { participanteDoRoteiro } from '@/lib/participante';
import { useSession } from '@/lib/session';

// A primeira tela de quem já entrou: /. A home, com o "Olá" e o Para hoje, ficou em /home.
export default function BoasVindasScreen() {
    const router = useRouter();
    const { user, perfil } = useSession();

    // A carta de jogador lê a sequência e o XP das mesmas respostas do Progresso.
    const { formaPre } = participanteDoRoteiro(perfil);
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a tela ganha foco, inclusive na volta de uma lição.
    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    const conquistas =
        estado.tipo === 'pronto'
            ? conquistasDoAluno({ licoes: estado.licoes, respostas: estado.respostas, questoes: estado.questoes, formaPre })
            : [];
    const carta =
        estado.tipo === 'pronto' && perfil?.apelido
            ? {
                  apelido: perfil.apelido,
                  sequencia: estado.sequencia,
                  xp: estado.xp ?? 0,
                  medalhas: { ganhas: medalhasGanhas(conquistas), total: conquistas.length },
              }
            : null;

    return (
        <TelaDeBoasVindas
            carta={carta}
            // Troca a boas-vindas pela home: a home vira a base, e o gesto de voltar não a reabre.
            aoJogar={() => router.replace('/home')}
            aoAbrirRegras={() => router.push('/regras')}
            aoAbrirConquistas={() => router.push('/conquistas')}
        />
    );
}
