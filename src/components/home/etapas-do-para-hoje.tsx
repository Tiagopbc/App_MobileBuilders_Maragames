import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SITUACAO_DA_ETAPA, rotuloDaEtapaDoParaHoje } from '@/constants/textos';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { SegmentoDoParaHoje } from '@/lib/licao';

// A situação de cada barra, dita ao leitor de tela. A revisão que ainda não abriu é "selada".
const SITUACAO_DITA: Record<SegmentoDoParaHoje['situacao'], string> = {
    feito: SITUACAO_DA_ETAPA.feito,
    agora: SITUACAO_DA_ETAPA.agora,
    depois: SITUACAO_DA_ETAPA.depois,
    selada: 'selada',
};

// As barras de etapa do Para hoje: uma por etapa da lição, com o nome embaixo. Feita é cheia no
// verde; a da vez enche na proporção do que já foi respondido; as de depois são o trilho; a
// revisão que ainda não abriu é só o contorno tracejado. Leitor de tela: a lista inteira, de uma vez.
export function EtapasDoParaHoje({ segmentos }: { segmentos: readonly SegmentoDoParaHoje[] }) {
    const theme = useTheme();
    const resumo = segmentos
        .map((s) => `${rotuloDaEtapaDoParaHoje(s)}, ${SITUACAO_DITA[s.situacao]}`)
        .join('. ');

    return (
        <View accessible accessibilityLabel={`Etapas: ${resumo}.`} style={styles.linha}>
            {segmentos.map((segmento) => {
                const { etapa, situacao, progresso } = segmento;
                const fatia = progresso ? Math.round((progresso.respondidas / progresso.total) * 100) : 0;

                return (
                    <View key={etapa} testID={`etapa-${etapa}`} style={styles.etapa}>
                        <View
                            testID="barra"
                            style={[
                                styles.barra,
                                situacao === 'feito' && { backgroundColor: theme.sucesso },
                                situacao === 'agora' && { backgroundColor: theme.borda },
                                situacao === 'depois' && { backgroundColor: theme.borda },
                                situacao === 'selada' && { borderWidth: 1.5, borderColor: theme.relevoDoCartao, borderStyle: 'dashed' },
                            ]}>
                            {situacao === 'agora' && (
                                <View
                                    testID={`preenchimento-${etapa}`}
                                    style={[styles.preenchimento, { width: `${fatia}%`, backgroundColor: theme.primaria }]}
                                />
                            )}
                        </View>
                        <ThemedText
                            type="small"
                            themeColor={situacao === 'agora' ? 'text' : 'textoDeApoio'}
                            style={[styles.rotulo, situacao === 'agora' && styles.rotuloDaVez]}>
                            {rotuloDaEtapaDoParaHoje(segmento)}
                        </ThemedText>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    linha: { flexDirection: 'row', gap: Spacing.one },
    etapa: { flex: 1, gap: Spacing.one },
    barra: { height: 6, borderRadius: 3, overflow: 'hidden' },
    preenchimento: { height: '100%' },
    rotulo: { fontSize: 11, lineHeight: 14 },
    rotuloDaVez: { fontWeight: 600 },
});
