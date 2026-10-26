import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

type BotaoPrincipalProps = {
    rotulo: string;
    onPress: () => void;
    desabilitado?: boolean;
    carregando?: boolean; // mostra o indicador e ignora toques
};

// A ação principal da tela: uma por tela, no roxo da marca. No escuro, é o Violeta com halo: um
// degradê do violeta vivo ao roxo profundo, uma linha de luz no topo e uma sombra roxa embaixo.
export function BotaoPrincipal({ rotulo, onPress, desabilitado = false, carregando = false }: BotaoPrincipalProps) {
    const theme = useTheme();
    const relevo = useRelevo();
    const parado = desabilitado || carregando;
    const violeta = relevo.espessura > 0 && {
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
                {
                    backgroundColor: theme.botao,
                    // No escuro, o relevo embaixo, como nos cards; no claro, a espessura é zero.
                    borderBottomWidth: relevo.espessura,
                    borderBottomColor: theme.relevoDoBotao,
                    opacity: desabilitado ? 0.4 : pressed ? 0.7 : 1,
                },
                violeta,
            ]}>
            {carregando ? (
                <ActivityIndicator color={theme.textoDoBotao} />
            ) : (
                <ThemedText themeColor="textoDoBotao" style={styles.rotulo}>
                    {rotulo}
                </ThemedText>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    rotulo: { fontWeight: 600, textAlign: 'center' },
});
