import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A faixa de convite da boas-vindas: para quem ainda não terminou nenhuma lição, a porta mais à vista
// para o Como jogar. Depois da primeira lição ela some, e o botão ? fixo no topo fica no lugar.
export function ConviteDasRegras({ aoAbrir }: { aoAbrir: () => void }) {
    const theme = useTheme();

    return (
        <Pressable
            testID="convite-das-regras"
            accessibilityRole="link"
            // Pergunta e resposta, juntas, como um item só.
            accessibilityLabel={`${TEXTOS_DE_BOAS_VINDAS.convite} ${TEXTOS_DE_BOAS_VINDAS.conviteApoio}`}
            onPress={aoAbrir}
            style={[styles.faixa, { backgroundColor: theme.cartaoSelecionado, borderColor: theme.bordaSelecionada }]}>
            <View testID="icone-do-convite" style={[styles.icone, { backgroundColor: theme.primaria }]}>
                <Ionicons name="help-circle-outline" size={22} color={theme.background} />
            </View>
            <View style={styles.textos}>
                <ThemedText type="smallBold">{TEXTOS_DE_BOAS_VINDAS.convite}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                    {TEXTOS_DE_BOAS_VINDAS.conviteApoio}
                </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.primaria} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    faixa: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three - 4,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: Raio.card,
        borderWidth: 1.5,
    },
    icone: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    textos: { flex: 1 },
});
