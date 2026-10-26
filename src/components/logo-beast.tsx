import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { TEXTOS_DO_LOGIN } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';

export type VarianteDaLogo = 'roxa' | 'app';

// A logo da Beast Maragames, que identifica a marca no login (item 28). Ela é roxa, então vai
// sempre sobre um círculo claro: no tema claro ele some no fundo, no escuro é o que a faz aparecer.
// Na variante "app", da tela de boas-vindas, o lobo é branco sobre um quadrado roxo de cantos
// redondos, com a bandeira do Maranhão na janela do controle. O quadrado já vem no SVG e aparece
// igual nos dois temas, então a logo tem o tamanho pedido, sem o círculo em volta.
export function LogoBeast({ tamanho = 96, variante = 'roxa' }: { tamanho?: number; variante?: VarianteDaLogo }) {
    const theme = useTheme();
    const circulo = tamanho * 1.3;

    if (variante === 'app') {
        return (
            <Image
                testID="logo-app"
                accessible
                accessibilityRole="image"
                accessibilityLabel={TEXTOS_DO_LOGIN.logo}
                source={require('@/assets/images/logo-app.svg')}
                contentFit="contain"
                style={{ width: tamanho, height: tamanho }}
            />
        );
    }

    return (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={TEXTOS_DO_LOGIN.logo}
            style={[
                styles.circulo,
                { width: circulo, height: circulo, borderRadius: circulo / 2, backgroundColor: theme.fundoDaLogo },
            ]}>
            <Image
                source={require('@/assets/images/logo-beast.svg')}
                contentFit="contain"
                style={{ width: tamanho, height: tamanho }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    circulo: { alignItems: 'center', justifyContent: 'center' },
});
