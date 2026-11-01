import { StyleSheet, View } from 'react-native';

import { Esqueleto, Pulsar } from '@/components/esqueleto/esqueleto';
import { Spacing } from '@/constants/theme';

// O que o card do Para hoje mostra enquanto carrega: o título, as quatro barras de etapa e o botão,
// nas posições de verdade. O "Para hoje" e a saudação ficam reais, no lugar deles.
export function EsqueletoDoParaHoje() {
    return (
        <Pulsar testID="esqueleto-da-home" style={styles.bloco}>
            <Esqueleto largura="60%" altura={22} />
            <View style={styles.etapas}>
                {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={styles.etapa}>
                        <Esqueleto largura="100%" altura={6} />
                    </View>
                ))}
            </View>
            <Esqueleto largura="100%" altura={52} raio={14} />
        </Pulsar>
    );
}

// O card da sequência carregando: o título e as sete bolinhas da semana.
export function EsqueletoDaSequencia() {
    return (
        <Pulsar testID="esqueleto-da-sequencia" style={styles.bloco}>
            <Esqueleto largura="45%" altura={16} />
            <View style={styles.semana}>
                {Array.from({ length: 7 }, (_, i) => (
                    <Esqueleto key={i} largura={30} altura={30} />
                ))}
            </View>
        </Pulsar>
    );
}

const styles = StyleSheet.create({
    bloco: { gap: Spacing.three - 4 },
    etapas: { flexDirection: 'row', gap: Spacing.one },
    etapa: { flex: 1 },
    semana: { flexDirection: 'row', justifyContent: 'space-between' },
});
