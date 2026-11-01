import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatarTaxa } from '@/constants/textos';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Taxa } from '@/lib/resultado';

type AntesEDepoisProps = {
    rotuloAntes: string;
    antes: Taxa;
    rotuloDepois: string;
    depois: Taxa;
};

// O antes e o depois do fim da lição, lado a lado: uma barra de segmentos para cada um, um
// segmento por questão, cheio quando a pessoa acertou. O número, "1 de 3", diz o mesmo que a barra.
export function AntesEDepois({ rotuloAntes, antes, rotuloDepois, depois }: AntesEDepoisProps) {
    return (
        <View style={styles.par}>
            <Lado id="antes" rotulo={rotuloAntes} taxa={antes} />
            <ThemedText themeColor="textSecondary" style={styles.seta}>
                →
            </ThemedText>
            <Lado id="depois" rotulo={rotuloDepois} taxa={depois} destaque />
        </View>
    );
}

function Lado({ id, rotulo, taxa, destaque = false }: { id: string; rotulo: string; taxa: Taxa; destaque?: boolean }) {
    const theme = useTheme();
    const resultado = formatarTaxa(taxa.acertos, taxa.total);

    return (
        // Rótulo e resultado são um item só para o leitor de tela: "Antes · diagnóstico: 1 de 3".
        <View accessible accessibilityLabel={`${rotulo}: ${resultado}`} style={styles.lado}>
            <ThemedText type="small" themeColor="textSecondary">
                {rotulo}
            </ThemedText>
            <View testID={`barras-${id}`} style={styles.barras}>
                {Array.from({ length: taxa.total }, (_, i) => {
                    const cheio = i < taxa.acertos;
                    return (
                        <View
                            key={i}
                            testID={cheio ? 'segmento-cheio' : 'segmento-vazio'}
                            style={[styles.segmento, { backgroundColor: cheio ? theme.sucesso : theme.borda }]}
                        />
                    );
                })}
            </View>
            <ThemedText themeColor={destaque ? 'text' : 'textSecondary'} style={styles.numero}>
                {resultado}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    par: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
    lado: { flex: 1, gap: Spacing.one + Spacing.half },
    seta: { fontSize: 22, lineHeight: 26, marginTop: 18 },
    barras: { flexDirection: 'row', gap: Spacing.one },
    segmento: { flex: 1, height: 10, borderRadius: 3 },
    numero: { fontSize: 20, lineHeight: 26, fontWeight: 700 },
});
