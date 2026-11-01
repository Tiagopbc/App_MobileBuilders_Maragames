import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { TEXTOS } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';

const PULSO_MS = 600; // meio ciclo: 0,6 s para baixo e 0,6 s para cima, 1,2 s no total
const OPACIDADE_BAIXA = 0.6;

/**
 * O grupo de formas de um esqueleto, com o pulso de opacidade (1 ↔ 0,6, em laço), sem brilho
 * deslizante. Com "reduzir movimento" ligado, fica parado. Para o leitor de tela é um item só:
 * "Carregando", em vez de ler forma por forma.
 */
export function Pulsar({ children, style, testID }: { children: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
    const [opacidade] = useState(() => new Animated.Value(1));

    useEffect(() => {
        let vivo = true;
        let laco: Animated.CompositeAnimation | null = null;

        AccessibilityInfo.isReduceMotionEnabled().then((reduz) => {
            if (!vivo || reduz) return;

            const nativo = Platform.OS !== 'web';
            laco = Animated.loop(
                Animated.sequence([
                    Animated.timing(opacidade, { toValue: OPACIDADE_BAIXA, duration: PULSO_MS, useNativeDriver: nativo }),
                    Animated.timing(opacidade, { toValue: 1, duration: PULSO_MS, useNativeDriver: nativo }),
                ])
            );
            laco.start();
        });

        return () => {
            vivo = false;
            laco?.stop();
        };
    }, [opacidade]);

    return (
        <Animated.View
            testID={testID ?? 'pulso'}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={TEXTOS.carregando}
            aria-busy
            style={[style, { opacity: opacidade }]}>
            {children}
        </Animated.View>
    );
}

type EsqueletoProps = {
    largura: DimensionValue;
    altura: number;
    raio?: number; // por padrão, a metade da altura: uma pílula
    testID?: string;
};

/** Uma forma do esqueleto, na cor de realce do tema, que é a reservada ao carregamento. */
export function Esqueleto({ largura, altura, raio, testID }: EsqueletoProps) {
    const theme = useTheme();

    return (
        <View
            testID={testID}
            style={[styles.forma, { width: largura, height: altura, borderRadius: raio ?? altura / 2, backgroundColor: theme.realce }]}
        />
    );
}

const styles = StyleSheet.create({
    forma: { flexShrink: 0 },
});
