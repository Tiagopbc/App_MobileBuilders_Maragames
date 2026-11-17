import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { TelaDoCartao } from '@/components/cartao/tela-do-cartao';
import { PortaoDaLicao } from '@/components/licao/portao-da-licao';
import { TEXTOS } from '@/constants/textos';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { podeAbrirNaLicao } from '@/lib/licao';
import { useSession } from '@/lib/session';

// O cartão de conceito de uma lição (item 30). Antes da prática, o último slide leva a ela;
// com a prática já feita ou fechada, o cartão é só releitura e volta para a lição.
export default function CartaoDaLicaoScreen() {
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const { user, perfil } = useSession();
    const router = useRouter();
    const paraALicao = { pathname: '/licoes/[topicId]', params: { topicId } } as const;
    const sair = useVoltarOu(paraALicao);

    if (!user) return <Redirect href="/home" />;

    const formaPre = perfil?.formaPre ?? null;

    function comecarPratica() {
        // `replace`, e não `push`: a prática toma o lugar do cartão, então sair dela volta à lição.
        router.replace({ pathname: '/licoes/[topicId]/[passo]', params: { topicId, passo: 'pratica' } });
    }

    return (
        <PortaoDaLicao
            // Outra lição é outra pergunta ao portão, e outro cartão: recomeça do primeiro slide.
            key={topicId}
            uid={user.uid}
            topicId={topicId}
            formaPre={formaPre}
            passo="cartao"
            barrado={<Redirect href={paraALicao} />}>
            {(licao) => {
                const levaAPratica =
                    licao.estado.tipo !== 'concluida' && podeAbrirNaLicao(licao, 'pratica', formaPre !== null);
                return levaAPratica ? (
                    <TelaDoCartao topicId={topicId} aoComecarPratica={comecarPratica} aoSair={sair} />
                ) : (
                    <TelaDoCartao
                        topicId={topicId}
                        aoComecarPratica={sair}
                        aoSair={sair}
                        rotuloDoFim={TEXTOS.voltarParaALicao}
                    />
                );
            }}
        </PortaoDaLicao>
    );
}
