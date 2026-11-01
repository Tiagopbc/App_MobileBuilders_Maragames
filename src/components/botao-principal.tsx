import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

type BotaoPrincipalProps = {
    rotulo: string;
    onPress: () => void;
    desabilitado?: boolean;
    carregando?: boolean; // mostra o indicador e ignora toques
    icone?: keyof typeof Ionicons.glyphMap; // antes do rótulo, na cor dele
};

// A ação principal da tela: uma por tela, no roxo da marca. É um degradê do roxo vivo ao roxo
// profundo, com uma linha de luz no topo, uma sombra roxa embaixo e o relevo, nos dois temas.
// Desativado, o botão perde tudo isso e ganha a cor própria dele, sem opacidade.
export function BotaoPrincipal({ rotulo, onPress, desabilitado = false, carregando = false, icone }: BotaoPrincipalProps) {
    const theme = useTheme();
    const relevo = useRelevo();
    const parado = desabilitado || carregando;
    const violeta = !desabilitado && relevo.espessura > 0 && {
        backgroundImage: `linear-gradient(180deg, ${theme.botaoTopo} 0%, ${theme.botaoMeio} 55%, ${theme.botaoBase} 100%)`,
        // A luz é o branco do texto a 30%; o halo, o violeta do meio a 38% (os dois últimos dígitos).
        boxShadow: `inset 0 1.5px 0 ${theme.textoDoBotao}4D, 0 8px 18px ${theme.haloDoBotao}61`,
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            aria-busy={carregando}
            disabled={parado}
            onPress={onPress}
            style={({ pressed }) => [
                styles.botao,
                desabilitado
                    ? { backgroundColor: theme.botaoDesabilitado, borderBottomWidth: 0, opacity: 1 }
                    : {
                          backgroundColor: theme.botao,
                          // O relevo embaixo, como nos cards.
                          borderBottomWidth: relevo.espessura,
                          borderBottomColor: theme.relevoDoBotao,
                          opacity: pressed ? 0.7 : 1,
                      },
                violeta,
            ]}>
            {carregando ? (
                <ActivityIndicator color={theme.textoDoBotao} />
            ) : (
                <>
                    {icone && <Ionicons name={icone} size={18} color={desabilitado ? theme.textSecondary : theme.textoDoBotao} />}
                    <ThemedText themeColor={desabilitado ? 'textSecondary' : 'textoDoBotao'} style={styles.rotulo}>
                        {rotulo}
                    </ThemedText>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    botao: {
        borderRadius: 14,
        paddingVertical: Spacing.three,
        paddingHorizontal: Spacing.four,
        minHeight: 52,
        flexDirection: 'row',
        gap: Spacing.two,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // `flexShrink`: na linha com o ícone, o rótulo comprido quebra dentro do botão em vez de passar dele.
    rotulo: { flexShrink: 1, fontWeight: 600, textAlign: 'center' },
});
