import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CabecalhoDaTela } from '@/components/boas-vindas/cabecalho-da-tela';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { Secao } from '@/components/perfil/secao';
import { Superficie } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import { DESCRICAO_QUADRANTE, ROTULO_QUADRANTE, TEXTOS_DAS_REGRAS, TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { LarguraDoFormulario, Spacing } from '@/constants/theme';
import type { Quadrante } from '@/lib/quadrante';

// Do mais urgente ao mais firme, a mesma ordem em que o resultado lista o que revisar.
const QUADRANTES: readonly Quadrante[] = ['ponto_cego', 'lacuna', 'fragil', 'firme'];

// As Regras do jogo, que o ? da boas-vindas abre: só leitura, em cinco blocos curtos.
export function TelaDeRegras({ aoVoltar }: { aoVoltar: () => void }) {
    const { licao, certeza, xp, resultado, sequencia } = TEXTOS_DAS_REGRAS;

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <CabecalhoDaTela titulo={TEXTOS_DE_BOAS_VINDAS.regras} aoVoltar={aoVoltar} />
                <ScrollView contentContainerStyle={styles.conteudo}>
                    <Secao titulo={licao.titulo}>
                        <ThemedText>{licao.etapas}</ThemedText>
                        <ThemedText>{licao.revisao}</ThemedText>
                    </Secao>

                    <Secao titulo={certeza.titulo}>
                        <ThemedText>{certeza.texto}</ThemedText>
                    </Secao>

                    <Secao titulo={xp.titulo}>
                        <ThemedText>{xp.acerto}</ThemedText>
                        <ThemedText>{xp.erro}</ThemedText>
                        <ThemedText themeColor="textSecondary">{xp.palpite}</ThemedText>
                    </Secao>

                    <Secao titulo={resultado.titulo}>
                        <ThemedText>{resultado.texto}</ThemedText>
                        {QUADRANTES.map((quadrante) => (
                            <Superficie key={quadrante} tamanho="pequeno" style={styles.quadrante}>
                                <ThemedText type="smallBold">{ROTULO_QUADRANTE[quadrante]}</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary">
                                    {DESCRICAO_QUADRANTE[quadrante]}
                                </ThemedText>
                            </Superficie>
                        ))}
                    </Secao>

                    <Secao titulo={sequencia.titulo}>
                        <ThemedText>{sequencia.texto}</ThemedText>
                    </Secao>
                </ScrollView>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario },
    conteudo: { gap: Spacing.five, paddingHorizontal: Spacing.four, paddingBottom: Spacing.five },
    quadrante: { gap: Spacing.half, padding: Spacing.three },
});
