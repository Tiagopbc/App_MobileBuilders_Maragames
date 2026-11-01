import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Superficie } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import { LETRAS_DA_SEMANA, TEXTOS_DA_SEQUENCIA, rotuloDoDiaDaSemana, tituloDaSequencia } from '@/constants/textos';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DiaDaSemana } from '@/lib/sequencia';

type CartaoDaSequenciaProps = {
    sequencia: number; // dias seguidos com resposta
    semana: readonly DiaDaSemana[]; // segunda a domingo
};

const LADO_DO_DIA = 30;

// O card da sequência da home: os dias seguidos e a semana. Mostra o que houve, e não o que falta:
// o dia sem resposta é só um círculo tracejado. O único recado é o próximo passo de hoje, que some
// quando hoje já teve resposta. A chama só ganha a cor de aviso a partir do primeiro dia.
export function CartaoDaSequencia({ sequencia, semana }: CartaoDaSequenciaProps) {
    const theme = useTheme();
    const hojeEmAberto = semana.some((d) => d.hoje && !d.feito);

    return (
        <Superficie tamanho="pequeno" style={styles.cartao}>
            <View style={styles.cabecalho}>
                <Ionicons
                    testID="chama"
                    name="flame"
                    size={20}
                    color={sequencia > 0 ? theme.aviso : theme.textSecondary}
                    // Decoração: o título já diz os dias.
                    accessible={false}
                />
                <ThemedText type="smallBold" style={styles.titulo}>
                    {tituloDaSequencia(sequencia)}
                </ThemedText>
                {hojeEmAberto && (
                    <ThemedText type="small" themeColor="textoDeApoio" style={styles.recado}>
                        {TEXTOS_DA_SEQUENCIA.responda}
                    </ThemedText>
                )}
            </View>

            <View style={styles.semana}>
                {semana.map((dia, i) => (
                    <View key={i} accessible accessibilityLabel={rotuloDoDiaDaSemana(i, dia)} style={styles.dia}>
                        <View
                            testID={`dia-${i}`}
                            style={[
                                styles.circulo,
                                dia.feito
                                    ? { backgroundColor: theme.aviso }
                                    : dia.hoje
                                      ? { borderWidth: 2, borderColor: theme.aviso }
                                      : { borderWidth: 1.5, borderColor: theme.relevoDoCartao, borderStyle: 'dashed' },
                            ]}>
                            {dia.feito && <Ionicons name="checkmark" size={16} color={theme.cartao} />}
                        </View>
                        <ThemedText
                            type="small"
                            themeColor={dia.hoje ? 'text' : 'textSecondary'}
                            style={[styles.letra, dia.hoje && styles.letraDeHoje]}>
                            {LETRAS_DA_SEMANA[i]}
                        </ThemedText>
                    </View>
                ))}
            </View>
        </Superficie>
    );
}

const styles = StyleSheet.create({
    cartao: { gap: Spacing.three - 6, paddingVertical: 14, paddingHorizontal: Spacing.three },
    cabecalho: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
    titulo: { fontSize: 16, lineHeight: 22, flexShrink: 1 },
    recado: { flex: 1, textAlign: 'right', fontSize: 12, lineHeight: 16 },
    semana: { flexDirection: 'row', justifyContent: 'space-between' },
    dia: { alignItems: 'center', gap: Spacing.one },
    circulo: { width: LADO_DO_DIA, height: LADO_DO_DIA, borderRadius: LADO_DO_DIA / 2, alignItems: 'center', justifyContent: 'center' },
    letra: { fontSize: 11, lineHeight: 14 },
    letraDeHoje: { fontWeight: 700 },
});
