import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { TEXTOS } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';

// O topo da Configuração e das Regras do jogo: a seta de voltar e o título da tela.
export function CabecalhoDaTela({ titulo, aoVoltar }: { titulo: string; aoVoltar: () => void }) {
    const theme = useTheme();

    return (
        <View style={styles.cabecalho}>
            <Pressable accessibilityRole="button" accessibilityLabel={TEXTOS.voltar} hitSlop={Spacing.three} onPress={aoVoltar}>
                <Ionicons name="arrow-back" size={28} color={theme.text} />
            </Pressable>
            <ThemedText type="subtitle" accessibilityRole="header" style={styles.titulo}>
                {titulo}
            </ThemedText>
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
