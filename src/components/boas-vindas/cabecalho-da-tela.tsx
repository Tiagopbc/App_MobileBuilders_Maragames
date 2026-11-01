import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { TEXTOS } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';

// O topo das Regras do jogo e das Conquistas: a seta de voltar, o título e, se houver, um detalhe à direita.
export function CabecalhoDaTela({ titulo, aoVoltar, detalhe }: { titulo: string; aoVoltar: () => void; detalhe?: string }) {
    const theme = useTheme();

    return (
        <View style={styles.cabecalho}>
            <Pressable accessibilityRole="button" accessibilityLabel={TEXTOS.voltar} hitSlop={Spacing.three} onPress={aoVoltar}>
                <Ionicons name="arrow-back" size={28} color={theme.text} />
            </Pressable>
            <ThemedText type="subtitle" accessibilityRole="header" style={styles.titulo}>
                {titulo}
            </ThemedText>
            {detalhe !== undefined && (
                <ThemedText type="smallBold" themeColor="textSecondary">
                    {detalhe}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
    },
    titulo: { flex: 1 },
});
