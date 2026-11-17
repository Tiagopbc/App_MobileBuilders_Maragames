import { StyleSheet, View } from 'react-native';

import { MatrizDeQuadrantes } from '@/components/resultado/matriz-de-quadrantes';
import { SeloQuadrante } from '@/components/selo-quadrante';
import { Superficie } from '@/components/superficie';
import { TextoComCodigo } from '@/components/texto-com-codigo';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { TEXTOS, formatarAcertos, formatarXp } from '@/constants/textos';
import type { Relatorio } from '@/hooks/use-bloco';

// O resultado da prática de uma lição. Só apresentação: os números chegam prontos de
// `resultadoDoBloco` (src/lib/resultado.ts).
export function ResultadoDoBloco({ relatorio }: { relatorio: Relatorio }) {
    const { resultado, enunciados } = relatorio;

    return (
        <View style={styles.container}>
            <ThemedText type="subtitle">{TEXTOS.resultado}</ThemedText>

            <Superficie style={[styles.cartao, styles.xp]}>
                <ThemedText type="small" themeColor="textSecondary">
                    {TEXTOS.xpDoBloco}
                </ThemedText>
                {/* O saldo aparece como é, inclusive negativo: é o peso do erro com certeza (item 14). */}
                <ThemedText style={styles.numero}>{formatarXp(resultado.xp)}</ThemedText>
                <ThemedText themeColor="textSecondary">
                    {formatarAcertos(resultado.acertos, resultado.total)}
                </ThemedText>
            </Superficie>

            <Secao titulo={TEXTOS.comoVoceRespondeu}>
                <MatrizDeQuadrantes quadrantes={resultado.quadrantes} />
            </Secao>

            <Secao titulo={TEXTOS.revisarPrimeiro}>
                {resultado.questoesARevisar.length === 0 ? (
                    <ThemedText themeColor="textSecondary">{TEXTOS.nadaARevisar}</ThemedText>
                ) : (
                    // Na prática o feedback já foi dado questão a questão, então citá-las não revela nada.
                    resultado.questoesARevisar.map((questao) => (
                        <Superficie key={questao.questionId} style={styles.cartao}>
                            <SeloQuadrante quadrante={questao.quadrante} />
                            <TextoComCodigo type="small">{enunciados[questao.questionId] ?? ''}</TextoComCodigo>
                        </Superficie>
                    ))
                )}
            </Secao>
        </View>
    );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <View style={styles.secao}>
            <ThemedText type="smallBold">{titulo}</ThemedText>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: Spacing.four },
    secao: { gap: Spacing.two },
    cartao: { gap: Spacing.one, padding: Spacing.three },
    xp: { alignItems: 'center' },
    numero: { fontSize: 40, lineHeight: 48, fontWeight: 700 },
});
