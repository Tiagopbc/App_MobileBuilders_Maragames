import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { APARENCIA_DO_QUADRANTE } from '@/components/selo-quadrante';
import { ThemedText } from '@/components/themed-text';
import { DESCRICAO_QUADRANTE, LEGENDAS_DA_MATRIZ, ROTULO_QUADRANTE } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Quadrante } from '@/lib/quadrante';

// Acertou e errou nas linhas, com e sem certeza nas colunas.
const LINHAS: readonly { legenda: 'acertou' | 'errou'; quadrantes: readonly [Quadrante, Quadrante] }[] = [
    { legenda: 'acertou', quadrantes: ['firme', 'fragil'] },
    { legenda: 'errou', quadrantes: ['ponto_cego', 'lacuna'] },
];

// Fundo tingido é acertou; só contorno é errou. Linha contínua é com certeza; tracejada é sem
// certeza. A forma diz o quadrante, e a cor só reforça.
const ACERTOU: readonly Quadrante[] = ['firme', 'fragil'];
const SEM_CERTEZA: readonly Quadrante[] = ['fragil', 'lacuna'];

type MatrizDeQuadrantesProps = {
    // Com a contagem, cada quadrante mostra o número; sem ela, a matriz só explica.
    quadrantes?: Record<Quadrante, number>;
    // O quadrante que pede atenção: ganha o fundo e o contorno mais grosso.
    destaque?: Quadrante;
};

// A matriz 2×2 do resultado, nas Regras do jogo e nos números do Progresso. Só desenha: os
// números chegam prontos.
export function MatrizDeQuadrantes({ quadrantes, destaque }: MatrizDeQuadrantesProps) {
    return (
        <View testID="matriz-de-quadrantes" style={styles.matriz}>
            <View style={styles.linha}>
                <View style={styles.legendaDaLinha} />
                <ThemedText type="small" themeColor="textSecondary" style={[styles.celula, styles.centro]}>
                    {LEGENDAS_DA_MATRIZ.comCerteza}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={[styles.celula, styles.centro]}>
                    {LEGENDAS_DA_MATRIZ.semCerteza}
                </ThemedText>
            </View>
            {LINHAS.map(({ legenda, quadrantes: daLinha }) => (
                <View key={legenda} style={styles.linha}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.legendaDaLinha}>
                        {LEGENDAS_DA_MATRIZ[legenda]}
                    </ThemedText>
                    {daLinha.map((quadrante) => (
                        <Celula
                            key={quadrante}
                            quadrante={quadrante}
                            contagem={quadrantes?.[quadrante]}
                            destacado={quadrante === destaque}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

function Celula({ quadrante, contagem, destacado }: { quadrante: Quadrante; contagem?: number; destacado: boolean }) {
    const theme = useTheme();
    const { cor, fundo, icone } = APARENCIA_DO_QUADRANTE[quadrante];
    const acertou = ACERTOU.includes(quadrante);
    const comContagem = contagem !== undefined;

    return (
        <View
            accessible={comContagem}
            accessibilityLabel={comContagem ? `${ROTULO_QUADRANTE[quadrante]}: ${contagem}` : undefined}
            style={[
                styles.celula,
                styles.quadrante,
                {
                    // Errou fica sobre o card, e não transparente: o texto colorido tem de ler
                    // sobre um fundo conhecido, e não sobre o padrão da marca.
                    backgroundColor: acertou || destacado ? theme[fundo] : theme.cartao,
                    borderColor: theme[cor],
                    borderStyle: SEM_CERTEZA.includes(quadrante) ? 'dashed' : 'solid',
                    borderWidth: destacado ? 2.5 : 1.5,
                },
            ]}>
            {comContagem && (
                <ThemedText themeColor={cor} style={styles.contagem}>
                    {contagem}
                </ThemedText>
            )}
            <View style={styles.nome}>
                <Ionicons name={icone} size={16} color={theme[cor]} />
                <ThemedText type="smallBold" themeColor={cor}>
                    {ROTULO_QUADRANTE[quadrante]}
                </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textoDeApoio">
                {DESCRICAO_QUADRANTE[quadrante]}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    matriz: { gap: Spacing.two },
    linha: { flexDirection: 'row', alignItems: 'stretch', gap: Spacing.two },
    legendaDaLinha: { width: 64, alignSelf: 'center' },
    celula: { flex: 1 },
    centro: { textAlign: 'center', alignSelf: 'flex-end' },
    quadrante: { gap: Spacing.half, padding: Spacing.two, borderRadius: Raio.medio },
    contagem: { fontSize: 28, lineHeight: 34, fontWeight: 700 },
    nome: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
