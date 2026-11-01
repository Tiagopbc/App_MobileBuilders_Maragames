import { StyleSheet, View } from 'react-native';

import { Esqueleto, Pulsar } from '@/components/esqueleto/esqueleto';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// O esqueleto da lista de lições: a barra do módulo e quatro cards, com a forma real do card de
// lição (o ícone redondo e duas linhas de texto).
export function EsqueletoDasLicoes() {
    return (
        <Pulsar testID="esqueleto-das-licoes" style={styles.lista}>
            <Esqueleto largura={180} altura={14} />
            {[
                [70, 40],
                [55, 35],
                [62, 30],
                [48, 38],
            ].map(([titulo, detalhe], i) => (
                <CardDeLicao key={i} titulo={titulo} detalhe={detalhe} />
            ))}
        </Pulsar>
    );
}

function CardDeLicao({ titulo, detalhe }: { titulo: number; detalhe: number }) {
    const theme = useTheme();

    return (
        <View testID="esqueleto-de-licao" style={[styles.card, { backgroundColor: theme.cartao, borderColor: theme.bordaDoCartao }]}>
            <Esqueleto largura={24} altura={24} />
            <View style={styles.textos}>
                <Esqueleto largura={`${titulo}%`} altura={14} />
                <Esqueleto largura={`${detalhe}%`} altura={10} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    lista: { gap: Spacing.two, paddingHorizontal: Spacing.four },
    card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Raio.card, borderWidth: 1.5 },
    textos: { flex: 1, gap: 6 },
});
