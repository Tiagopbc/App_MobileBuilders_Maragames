import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useRelevo, useTheme } from '@/hooks/use-theme';

type BotaoSecundarioProps = {
    rotulo: string;
    onPress: () => void;
    desabilitado?: boolean;
};

// A ação alternativa da tela (entrar com o Google, por exemplo): no claro, só contorno, para não
// disputar com o botão principal; no escuro, o card com degradê escuro e relevo, sobre o padrão.
export function BotaoSecundario({ rotulo, onPress, desabilitado = false }: BotaoSecundarioProps) {
    const relevoDoSecundario = useRelevoDoSecundario();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            disabled={desabilitado}
            onPress={onPress}
            style={({ pressed }) => [
                styles.botao,
                relevoDoSecundario,
                { opacity: desabilitado ? 0.4 : pressed ? 0.7 : 1 },
            ]}>
            <ThemedText themeColor="primaria" style={styles.rotulo}>
                {rotulo}
            </ThemedText>
        </Pressable>
    );
}

// O contorno e o fundo do botão secundário. O "Voltar" do cartão de conceito usa o mesmo.
export function useRelevoDoSecundario() {
    const theme = useTheme();
    const relevo = useRelevo();

    const contorno = { borderWidth: 1.5, borderBottomWidth: 1.5 + relevo.espessura, borderColor: theme.bordaDoSecundario };

    if (relevo.espessura === 0) return contorno;
    return {
        ...contorno,
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
