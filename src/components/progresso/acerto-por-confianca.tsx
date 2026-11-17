import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { NIVEIS_DE_CONFIANCA, ROTULO_CONFIANCA, TEXTOS, formatarTaxa } from '@/constants/textos';
import type { Taxa } from '@/lib/resultado';
import type { Confianca } from '@/types/domain';

type AcertoPorConfiancaProps = {
    porConfianca: Record<Confianca, Taxa>;
    espaco?: number; // entre o nível e o valor; o Tópico usa um pouco menos que o Progresso
};

/** A calibração: o acerto em cada nível de confiança, nível e valor lidos juntos pelo leitor de tela. */
export function AcertoPorConfianca({ porConfianca, espaco = Spacing.three }: AcertoPorConfiancaProps) {
    return (
        <View style={styles.secao}>
            <ThemedText type="smallBold">{TEXTOS.acertoPorConfianca}</ThemedText>
            {NIVEIS_DE_CONFIANCA.map((nivel) => {
                const valor = formatarTaxa(porConfianca[nivel].acertos, porConfianca[nivel].total);
                return (
                    <View
                        key={nivel}
                        accessible
                        accessibilityLabel={`${ROTULO_CONFIANCA[nivel]}: ${valor}`}
                        style={[styles.par, { gap: espaco }]}>
                        <ThemedText style={styles.cresce}>{ROTULO_CONFIANCA[nivel]}</ThemedText>
                        <ThemedText themeColor="textSecondary">{valor}</ThemedText>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    secao: { gap: Spacing.two },
    par: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
    cresce: { flex: 1 },
});
