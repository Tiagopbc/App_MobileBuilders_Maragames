import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { APARENCIA_DO_QUADRANTE } from '@/components/selo-quadrante';
import { TextoComCodigo } from '@/components/texto-com-codigo';
import { ThemedText } from '@/components/themed-text';
import { Raio, Spacing, Tipo } from '@/constants/theme';
import { DESCRICAO_QUADRANTE, ROTULO_QUADRANTE, TEXTOS, formatarXp } from '@/constants/textos';
import { useRelevo, useTheme } from '@/hooks/use-theme';
import type { Feedback } from '@/lib/pergunta';

// Só existe na prática. Nos blocos medidos (pré, pós e reteste) este componente nem é montado.
// O veredito é o quadrante: ele é a manchete e dá a cor do card. "Você acertou" ou "Você errou" e o
// XP ficam logo abaixo, em texto, para não depender só da cor.
export function FeedbackQuestao({ feedback }: { feedback: Feedback }) {
    const theme = useTheme();
    const relevo = useRelevo();
    const { cor, fundo } = APARENCIA_DO_QUADRANTE[feedback.quadrante];

    return (
        <View
            testID="feedback"
            aria-live="polite"
            style={[
                styles.cartao,
                {
                    // O mesmo card das alternativas, na cor do quadrante.
                    backgroundColor: theme[fundo],
                    borderColor: theme[cor],
                    borderBottomColor: theme[cor],
                    borderBottomWidth: 1.5 + relevo.espessura,
                },
            ]}>
            <View style={styles.linha}>
                <Ionicons name={feedback.correta ? 'checkmark-circle' : 'close-circle'} size={26} color={theme[cor]} />
                <ThemedText themeColor={cor} style={styles.manchete}>
                    {ROTULO_QUADRANTE[feedback.quadrante]}
                </ThemedText>
            </View>

            <View style={styles.linha}>
                <ThemedText type="smallBold">{feedback.correta ? TEXTOS.acertou : TEXTOS.errou}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                    ·
                </ThemedText>
                <ThemedText type="smallBold">{formatarXp(feedback.xp)}</ThemedText>
            </View>

            <ThemedText type="small" themeColor="textoDeApoio">
                {DESCRICAO_QUADRANTE[feedback.quadrante]}
            </ThemedText>

            <TextoComCodigo type="small">{feedback.explicacaoDaEscolha}</TextoComCodigo>

            {feedback.explicacaoDaCorreta !== null && (
                <View style={styles.correta}>
                    <ThemedText type="smallBold">{TEXTOS.respostaCerta}</ThemedText>
                    <TextoComCodigo type="small">{feedback.explicacaoDaCorreta}</TextoComCodigo>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        gap: Spacing.two,
        padding: Spacing.three,
        borderRadius: Raio.card,
        borderWidth: 1.5,
    },
    linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
    manchete: { flex: 1, fontSize: Tipo.destaque.tamanho, lineHeight: Tipo.destaque.linha, fontWeight: 700 },
    correta: { gap: Spacing.half },
});
