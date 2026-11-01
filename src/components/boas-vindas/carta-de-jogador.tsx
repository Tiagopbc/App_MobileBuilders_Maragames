import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TEXTOS_DE_BOAS_VINDAS, diasSeguidos, formatarXpTotal, xpNaCarta } from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

type CartaDeJogadorProps = {
    apelido: string;
    sequencia: number; // dias seguidos com resposta
    xp: number; // o total à vista, com piso em 0
};

// A carta de jogador da boas-vindas: a mesma carta de jogo do cartão de conceito, com o tipo e o
// apelido na placa e a sequência e o XP embaixo. Só desenha: os números chegam prontos.
export function CartaDeJogador({ apelido, sequencia, xp }: CartaDeJogadorProps) {
    const theme = useTheme();
    const relevo = useRelevo();

    return (
        <View
            testID="carta-de-jogador"
            style={[
                styles.carta,
                {
                    backgroundColor: theme.cartao,
                    borderColor: theme.bordaDoCartao,
                    borderBottomColor: theme.relevoDoCartao,
                    borderBottomWidth: 1.5 + relevo.espessura,
                },
            ]}>
            <View testID="placa-da-carta-de-jogador" style={[styles.placa, { backgroundColor: theme.placaDaCarta }]}>
                <ThemedText type="smallBold" themeColor="textoDoPe" style={styles.tipo}>
                    {TEXTOS_DE_BOAS_VINDAS.pessoaJogadora}
                </ThemedText>
                <ThemedText style={styles.apelido} numberOfLines={1}>
                    {apelido}
                </ThemedText>
            </View>

            <View style={styles.numeros}>
                {/* O número e a legenda são um só item para o leitor de tela: "3 dias seguidos". */}
                <View accessible accessibilityLabel={`${sequencia} ${diasSeguidos(sequencia)}`} style={styles.numero}>
                    <ThemedText style={styles.valor}>{sequencia}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                        {diasSeguidos(sequencia)}
                    </ThemedText>
                </View>
                <View
                    accessible
                    accessibilityLabel={formatarXpTotal(xp)}
                    style={[styles.numero, styles.comFio, { borderLeftColor: theme.bordaDoCartao }]}>
                    <ThemedText style={styles.valor}>{xpNaCarta(xp)}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                        XP
                    </ThemedText>
                </View>
            </View>

            {sequencia === 0 && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.dica}>
                    {TEXTOS_DE_BOAS_VINDAS.comecarASequencia}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    carta: { gap: Spacing.two, padding: Spacing.two, borderRadius: Raio.carta, borderWidth: 1.5 },
    placa: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.two,
        paddingVertical: Spacing.two,
        paddingHorizontal: 14,
        borderRadius: Raio.medio,
    },
    tipo: { textTransform: 'uppercase', letterSpacing: 0.8 },
    apelido: { flexShrink: 1, fontSize: 20, lineHeight: 26, fontWeight: 700 },
    numeros: { flexDirection: 'row', paddingHorizontal: Spacing.one },
    numero: { flex: 1 },
    comFio: { borderLeftWidth: 1, paddingLeft: Spacing.three },
    valor: { fontSize: 30, lineHeight: 36, fontWeight: 700 },
    dica: { paddingHorizontal: Spacing.one, paddingBottom: Spacing.one },
});
