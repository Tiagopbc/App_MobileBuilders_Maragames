import { useState } from 'react';
import { Image, StyleSheet, View, type LayoutChangeEvent, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// O ladrilho de 300 pt, com a opacidade já embutida; o @2x e o @3x vêm junto pelo nome do arquivo.
// O desenho de origem é o fundo-da-marca.svg, na mesma pasta. Os itens são roxos e lilases, com a
// opacidade embutida, e funcionam sobre o fundo escuro e sobre o lilás claro.
const PADRAO = require('@/assets/images/fundo-da-marca.png');
const LADO = 300;

/**
 * O fundo de toda tela: o padrão da Beast Maragames (ícones de jogo, a logo e o mascote) repetido
 * atrás do conteúdo, sobre a cor de fundo do tema, claro ou escuro.
 */
export function FundoDaMarca({ style, children, onLayout, ...props }: ViewProps) {
    const theme = useTheme();
    const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 });

    function aoMedir(evento: LayoutChangeEvent) {
        const { width, height } = evento.nativeEvent.layout;
        setTamanho({ largura: width, altura: height });
        onLayout?.(evento);
    }

    // Os ladrilhos vão em grade, quantos couberem: o `resizeMode="repeat"` do iOS desenha um só.
    const colunas = Math.ceil(tamanho.largura / LADO);
    const linhas = Math.ceil(tamanho.altura / LADO);

    return (
        <View style={[{ backgroundColor: theme.background }, style]} onLayout={aoMedir} {...props}>
            <View testID="padrao-da-marca" pointerEvents="none" style={styles.recorte}>
                <View style={[styles.grade, { width: colunas * LADO }]}>
                    {Array.from({ length: colunas * linhas }, (_, i) => (
                        <Image
                            key={i}
                            testID="ladrilho"
                            source={PADRAO}
                            accessibilityIgnoresInvertColors
                            style={styles.ladrilho}
                        />
                    ))}
                </View>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    recorte: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
    grade: { flexDirection: 'row', flexWrap: 'wrap' },
    ladrilho: { width: LADO, height: LADO },
});
