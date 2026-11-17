import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { TelaDaLicao } from '@/components/licao/tela-da-licao';
import { useAoVoltarAoApp } from '@/hooks/use-ao-voltar-ao-app';
import { useLicao } from '@/hooks/use-licao';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import type { DestinoDaLicao } from '@/lib/licao';
import { useSession } from '@/lib/session';

// A página de uma lição (item 30): /licoes/mda_framework. Qualquer lição abre, em qualquer
// ordem; a trava vale só para os passos dentro dela.
export default function LicaoScreen() {
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const { user, perfil, precisaDaAutoavaliacao } = useSession();
    const router = useRouter();
    const sair = useVoltarOu('/home');

    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicao({ uid: user?.uid ?? '', topicId, formaPre });

    // Roda quando a página ganha foco, inclusive na volta de um passo ou do termo.
    useRecarregarAoFocar(recarregar);
    // E quando o app volta do segundo plano: a revisão abre pela virada do dia.
    useAoVoltarAoApp(recarregar);

    if (!user) return <Redirect href="/home" />;

    function abrir(destino: DestinoDaLicao) {
        if (destino.tipo === 'termo') {
            router.push('/consentimento');
            return;
        }
        // Antes do primeiro diagnóstico, a pessoa se dá uma nota em cada módulo (item 34).
        if (destino.passo === 'diagnostico' && precisaDaAutoavaliacao && estado.tipo === 'pronto' && estado.licao.estado.tipo === 'nova') {
            router.push('/autoavaliacao');
            return;
        }
        if (destino.passo === 'cartao') {
            router.push({ pathname: '/licoes/[topicId]/cartao', params: { topicId } });
            return;
        }
        router.push({ pathname: '/licoes/[topicId]/[passo]', params: { topicId, passo: destino.passo } });
    }

    return (
        <TelaDaLicao estado={estado} temForma={formaPre !== null} aoAbrir={abrir} aoTentarDeNovo={recarregar} aoSair={sair} />
    );
}
