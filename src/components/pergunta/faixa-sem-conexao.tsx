import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TEXTOS } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// A faixa do alto da pergunta quando o aparelho perde a rede. Só diz o que é verdade: as escolhas
// continuam marcadas na tela. O app não guarda resposta para enviar depois, então não promete fila.
// Enquanto o estado da rede é desconhecido (null), a faixa não aparece: melhor calar que assustar.
export function FaixaSemConexao() {
    const theme = useTheme();
    const { isConnected } = useNetInfo();

    if (isConnected !== false) return null;

    return (
        <View
            accessible
            accessibilityRole="alert"
            style={[styles.faixa, { backgroundColor: theme.fundoFragil, borderColor: theme.aviso }]}>
            <Ionicons name="cloud-offline" size={20} color={theme.aviso} />
            <ThemedText type="small" style={styles.texto}>
                {TEXTOS.semConexao}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    faixa: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two + 2,
        marginHorizontal: Spacing.three,
        marginBottom: Spacing.two,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: Raio.medio,
        borderWidth: 1.5,
    },
    texto: { flex: 1 },
});
