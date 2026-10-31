import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useRelevo, useTheme } from '@/hooks/use-theme';

type BotaoSecundarioProps = {
    rotulo: string;
    onPress: () => void;
    desabilitado?: boolean;
};

// A ação alternativa da tela: o card que leva toque, com relevo, em branco no claro e no degradê
// escuro do escuro. Desativado, ganha a cor própria do botão desativado, sem opacidade.
export function BotaoSecundario({ rotulo, onPress, desabilitado = false }: BotaoSecundarioProps) {
    const theme = useTheme();
    const relevoDoSecundario = useRelevoDoSecundario();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            disabled={desabilitado}
            onPress={onPress}
            style={({ pressed }) => [
                styles.botao,
                desabilitado
                    ? { backgroundColor: theme.botaoDesabilitado, opacity: 1 }
                    : [relevoDoSecundario, { opacity: pressed ? 0.7 : 1 }],
            ]}>
            <ThemedText themeColor={desabilitado ? 'textSecondary' : 'primaria'} style={styles.rotulo}>
                {rotulo}
            </ThemedText>
        </Pressable>
    );
}

// O contorno e o fundo do botão secundário. O "Voltar" do cartão de conceito usa o mesmo.
export function useRelevoDoSecundario() {
    const theme = useTheme();
    const relevo = useRelevo();

    return {
        borderWidth: 1.5,
        borderBottomWidth: 1.5 + relevo.espessura,
        borderColor: theme.bordaDoSecundario,
        borderBottomColor: theme.relevoDoSecundario,
        backgroundColor: theme.cartao,
        backgroundImage: `linear-gradient(180deg, ${theme.secundarioTopo} 0%, ${theme.secundarioBase} 100%)`,
    };
}

const styles = StyleSheet.create({
    botao: {
        minHeight: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rotulo: { fontWeight: 600, textAlign: 'center' },
});
