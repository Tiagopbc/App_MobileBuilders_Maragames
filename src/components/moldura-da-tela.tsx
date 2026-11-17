import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FundoDaMarca } from '@/components/fundo-da-marca';
import { LarguraDoFormulario, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LARGURA = { conteudo: MaxContentWidth, formulario: LarguraDoFormulario } as const;

type MolduraDaTelaProps = {
    // "conteudo" é a das telas de leitura e de pergunta; "formulario", a das mais estreitas.
    largura: keyof typeof LARGURA;
    children: ReactNode;
};

/** O esqueleto das telas: o fundo da marca e, no centro, a área segura com a largura máxima. */
export function MolduraDaTela({ largura, children }: MolduraDaTelaProps) {
    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView testID="area-segura" style={[styles.safeArea, { maxWidth: LARGURA[largura] }]}>
                {children}
            </SafeAreaView>
        </FundoDaMarca>
    );
}

type CabecalhoComFecharProps = {
    rotulo: string; // o que o leitor de tela diz do X
    aoFechar: () => void;
    desabilitado?: boolean;
    children: ReactNode; // o título, com o estilo que a tela escolher
};

/** O cabeçalho das telas que se fecham: o X à esquerda e, depois dele, o que a tela puser. */
export function CabecalhoComFechar({ rotulo, aoFechar, desabilitado, children }: CabecalhoComFecharProps) {
    const theme = useTheme();

    return (
        <View style={styles.cabecalho}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={rotulo}
                hitSlop={Spacing.three}
                disabled={desabilitado}
                onPress={aoFechar}>
                <Ionicons name="close" size={28} color={theme.text} />
            </Pressable>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1 },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
    },
});
