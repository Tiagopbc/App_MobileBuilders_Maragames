import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { rotuloDoSeloDeXp, xpDeHojeNoSelo } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SeloDeXpProps = {
    xp: number; // o total à vista, com piso em 0
    deHoje: number; // o que o total ganhou desde a meia-noite; pode ser negativo
};

// O selo de XP do alto da home: o total em número grande e, embaixo, o que o dia trouxe. O do dia só
// ganha o verde quando é ganho; negativo aparece como é, em tom neutro (item 14).
export function SeloDeXp({ xp, deHoje }: SeloDeXpProps) {
    const theme = useTheme();
    const doDia = xpDeHojeNoSelo(deHoje);

    return (
        <View
            accessible
            accessibilityLabel={rotuloDoSeloDeXp(xp, deHoje)}
            style={[styles.selo, { backgroundColor: theme.cartao, borderColor: theme.bordaDoCartao }]}>
            <View style={styles.linha}>
                <ThemedText style={styles.numero}>{String(xp)}</ThemedText>
                <ThemedText type="smallBold" themeColor="primaria">
                    XP
                </ThemedText>
            </View>
            {doDia && (
                <ThemedText type="small" style={[styles.doDia, { color: deHoje > 0 ? theme.sucesso : theme.textSecondary }]}>
                    {doDia}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    selo: { alignItems: 'flex-end', paddingVertical: 6, paddingHorizontal: Spacing.three - 4, borderRadius: Raio.medio, borderWidth: 1.5 },
    linha: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.one },
    numero: { fontSize: 18, lineHeight: 22, fontWeight: 700 },
    doDia: { fontSize: 12, lineHeight: 14, fontWeight: 600 },
});
