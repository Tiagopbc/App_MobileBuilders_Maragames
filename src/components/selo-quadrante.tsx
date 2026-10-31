import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { ROTULO_QUADRANTE } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';
import type { Quadrante } from '@/lib/quadrante';

type Aparencia = { icone: keyof typeof Ionicons.glyphMap; cor: ThemeColor; fundo: ThemeColor };

// Cada quadrante tem a cor do texto e do contorno e o fundo claro do card em que aparece.
export const APARENCIA_DO_QUADRANTE: Record<Quadrante, Aparencia> = {
    firme: { icone: 'shield-checkmark', cor: 'sucesso', fundo: 'fundoFirme' },
    fragil: { icone: 'leaf', cor: 'aviso', fundo: 'fundoFragil' },
    lacuna: { icone: 'help-circle', cor: 'lacuna', fundo: 'fundoLacuna' },
    ponto_cego: { icone: 'eye-off', cor: 'erro', fundo: 'fundoPontoCego' },
};

// O quadrante chega calculado (src/lib/quadrante.ts); aqui ele só ganha rótulo, ícone e cor.
export function SeloQuadrante({ quadrante }: { quadrante: Quadrante }) {
    const theme = useTheme();
    const { icone, cor } = APARENCIA_DO_QUADRANTE[quadrante];

    return (
        <View style={[styles.selo, { borderColor: theme[cor] }]}>
            <Ionicons name={icone} size={16} color={theme[cor]} />
            <ThemedText type="smallBold" themeColor={cor}>
                {ROTULO_QUADRANTE[quadrante]}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    selo: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: Spacing.one,
        paddingVertical: Spacing.one,
        paddingHorizontal: Spacing.two,
        borderRadius: 999,
        borderWidth: 1.5,
    },
});
