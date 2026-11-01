import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { diasAbreviados, emQuantosDias } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RevisaoSeladaProps = {
    titulo: string; // a lição que será revista
    quandoAbre: string; // "A revisão abre na quinta, 12/11."
    diasRestantes: number;
};

// A revisão que ainda não abriu: uma carta selada, com o cadeado, o dia em que abre e quantos dias
// faltam. Não leva toque: a revisão que vence sobe sozinha para o Para hoje.
export function RevisaoSelada({ titulo, quandoAbre, diasRestantes }: RevisaoSeladaProps) {
    const theme = useTheme();
    const nome = `Revisão de ${titulo}`;

    return (
        <View
            testID="revisao-selada"
            accessible
            accessibilityLabel={`${nome}, ${emQuantosDias(diasRestantes)}. ${quandoAbre}`}
            style={[styles.carta, { backgroundColor: theme.fundoApagado, borderColor: theme.bordaSelecionada }]}>
            <View
                testID="carta-do-cadeado"
                style={[styles.cadeado, { backgroundColor: theme.realce, borderColor: theme.bordaSelecionada }]}>
                <Ionicons name="lock-closed" size={18} color={theme.primaria} />
            </View>
            <View style={styles.texto}>
                <ThemedText style={styles.titulo}>{nome}</ThemedText>
                <ThemedText type="small" themeColor="textoDeApoio">
                    {quandoAbre}
                </ThemedText>
            </View>
            <ThemedText type="smallBold" themeColor="primaria">
                {diasAbreviados(diasRestantes)}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    carta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three - 4,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: Raio.card,
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    cadeado: { width: 40, height: 52, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    texto: { flex: 1, gap: 2 },
    titulo: { fontSize: 15, lineHeight: 20, fontWeight: 600 },
});
