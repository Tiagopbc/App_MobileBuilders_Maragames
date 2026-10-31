import { StyleSheet, View } from 'react-native';

import { SeloQuadrante } from '@/components/selo-quadrante';
import { Superficie } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { DESCRICAO_QUADRANTE, ROTULO_QUADRANTE } from '@/constants/textos';
import type { Quadrante } from '@/lib/quadrante';

// Ordem de leitura da grade: a linha de cima são os acertos, a de baixo os erros.
const QUADRANTES: readonly Quadrante[] = ['firme', 'fragil', 'ponto_cego', 'lacuna'];

// A contagem dos quatro quadrantes, em duas colunas. Só desenha: os números chegam prontos.
export function GradeDeQuadrantes({ quadrantes }: { quadrantes: Record<Quadrante, number> }) {

    return (
        <View style={styles.grade}>
            {QUADRANTES.map((quadrante) => (
                <Superficie
                    key={quadrante}
                    accessible
                    accessibilityLabel={`${ROTULO_QUADRANTE[quadrante]}: ${quadrantes[quadrante]}`}
                    style={styles.quadrante}>
                    <ThemedText style={styles.contagem}>{quadrantes[quadrante]}</ThemedText>
                    <SeloQuadrante quadrante={quadrante} />
                    <ThemedText type="small" themeColor="textSecondary">
                        {DESCRICAO_QUADRANTE[quadrante]}
                    </ThemedText>
                </Superficie>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    // Duas colunas: metade da largura menos a folga entre elas.
    quadrante: { flexBasis: '47%', flexGrow: 1, gap: Spacing.one, padding: Spacing.three },
    contagem: { fontSize: 28, lineHeight: 34, fontWeight: 700 },
});
