import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { TEXTOS_DO_LOGIN } from '@/constants/textos';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export type VarianteDaLogo = 'roxa' | 'maranhao';

// A logo da Beast Maragames, que identifica a marca no login (item 28). Ela é roxa, então vai
// sempre sobre um círculo claro: no tema claro ele some no fundo, no escuro é o que a faz aparecer.
// Na variante "maranhao", da tela de boas-vindas, o círculo já vem desenhado no SVG, com a
// bandeira do Maranhão na janela do controle. No tema claro o círculo branco some no fundo branco,
// então lá o SVG traz um aro lilás em volta dele.
export function LogoBeast({ tamanho = 96, variante = 'roxa' }: { tamanho?: number; variante?: VarianteDaLogo }) {
    const theme = useTheme();
    const escuro = useColorScheme() === 'dark';
    const circulo = tamanho * 1.3;

    if (variante === 'maranhao') {
        return (
            <Image
                testID="logo-maranhao"
                accessible
                accessibilityRole="image"
                accessibilityLabel={TEXTOS_DO_LOGIN.logo}
                source={
                    escuro
                        ? require('@/assets/images/logo-beast-maranhao.svg')
                        : require('@/assets/images/logo-beast-maranhao-claro.svg')
                }
                contentFit="contain"
                style={{ width: circulo, height: circulo }}
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
