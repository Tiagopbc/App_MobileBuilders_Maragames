import { TelaDeConquistas, type EstadoDasConquistas } from '@/components/conquistas/tela-de-conquistas';
import { useLicoes } from '@/hooks/use-licoes';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { conquistasDoAluno } from '@/lib/conquistas';
import { useSession } from '@/lib/session';

// As Conquistas: /conquistas, aberta pelo número de medalhas da carta da pessoa jogadora.
export default function ConquistasScreen() {
    const voltar = useVoltarOu('/');
    const { user, perfil } = useSession();
    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

    // Roda quando a tela ganha foco, para a medalha ganha agora já estar aqui.
    useRecarregarAoFocar(recarregar);

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
