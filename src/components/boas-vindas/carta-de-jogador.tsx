import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
    TEXTOS_DAS_CONQUISTAS,
    TEXTOS_DE_BOAS_VINDAS,
    contagemDeMedalhas,
    diasSeguidos,
    formatarXpTotal,
    xpNaCarta,
} from '@/constants/textos';
import { Raio, Spacing } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

export type NumerosDaCarta = {
    sequencia: number; // dias seguidos com resposta
    xp: number; // o total à vista, com piso em 0
    medalhas: { ganhas: number; total: number } | null; // null enquanto não foram calculadas
};

type CartaDeJogadorProps = {
    apelido: string; // vazio, a placa mostra só o tipo da carta
    numeros: NumerosDaCarta | null; // null enquanto as lições não chegaram: a carta mostra só a arte e a placa
    aoAbrirConquistas: () => void;
};

// O lobinho no centro da janela da carta: a mesma proporção do arquivo (615 por 815). O anel de dentro tem a
// largura dele e o de fora, 1,4 vez isso, como no desenho aprovado.
const LARGURA_DO_LOBINHO = 224;
const ALTURA_DO_LOBINHO = Math.round((LARGURA_DO_LOBINHO * 815) / 615);
const ALTURA_DA_ARTE = 420;

// A carta de jogador: uma carta de jogo com a arte do lobinho sobre dois anéis, a placa com o apelido e o
// tipo, e os números da pessoa: dias seguidos, XP e medalhas. Aparece na boas-vindas e vai aparecer em
// outros momentos do app. As medalhas são o único número que leva a outra tela. Só desenha: os números
// chegam prontos.
export function CartaDeJogador({ apelido, numeros, aoAbrirConquistas }: CartaDeJogadorProps) {
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
            <View
                testID="arte-da-carta"
                style={[styles.arte, { backgroundColor: theme.caixaDaCarta, borderColor: theme.bordaDaCaixa }]}>
                {/* Os anéis e a sombra no chão: o lobinho não flutua na janela. */}
                <View testID="anel-externo" style={[styles.anel, styles.anelExterno, { backgroundColor: theme.realce }]} />
                <View testID="anel-interno" style={[styles.anel, styles.anelInterno, { backgroundColor: theme.realce }]} />
                <View style={[styles.sombra, { backgroundColor: theme.veu }]} />
                <Image
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={TEXTOS_DE_BOAS_VINDAS.mascote}
                    source={require('@/assets/images/mascote-beast.png')}
                    contentFit="contain"
                    style={styles.mascote}
                />
            </View>

            <View testID="placa-da-carta-de-jogador" style={[styles.placa, { backgroundColor: theme.placaDaCarta }]}>
                {apelido !== '' && (
                    <ThemedText style={styles.apelido} numberOfLines={1}>
                        {apelido}
                    </ThemedText>
                )}
                <ThemedText type="smallBold" themeColor="textoDoPe" style={styles.tipo}>
                    {TEXTOS_DE_BOAS_VINDAS.pessoaJogadora}
                </ThemedText>
            </View>

            {numeros && (
                <View style={styles.numeros}>
                    {/* O número e a legenda são um só item para o leitor de tela: "3 dias seguidos". */}
                    <View accessible accessibilityLabel={`${numeros.sequencia} ${diasSeguidos(numeros.sequencia)}`} style={styles.numero}>
                        <View style={styles.valor}>
                            <Ionicons
                                testID="chama-da-carta"
                                name="flame"
                                size={18}
                                color={numeros.sequencia > 0 ? theme.aviso : theme.textSecondary}
                            />
                            <ThemedText style={styles.cifra}>{numeros.sequencia}</ThemedText>
                        </View>
                        <ThemedText type="small" themeColor="textSecondary">
                            {diasSeguidos(numeros.sequencia)}
                        </ThemedText>
                    </View>

                    <View style={[styles.fio, { backgroundColor: theme.bordaDoCartao }]} />

                    <View accessible accessibilityLabel={formatarXpTotal(numeros.xp)} style={styles.numero}>
                        <View style={styles.valor}>
                            <Ionicons name="flash" size={18} color={theme.primaria} />
                            <ThemedText style={styles.cifra}>{xpNaCarta(numeros.xp)}</ThemedText>
                        </View>
                        <ThemedText type="small" themeColor="textSecondary">
                            XP
                        </ThemedText>
                    </View>

                    {numeros.medalhas && (
                        <>
                            <View style={[styles.fio, { backgroundColor: theme.bordaDoCartao }]} />
                            <Pressable
                                accessibilityRole="link"
                                accessibilityLabel={`${contagemDeMedalhas(numeros.medalhas.ganhas, numeros.medalhas.total)} ${TEXTOS_DAS_CONQUISTAS.medalhas}`}
                                hitSlop={Spacing.two}
                                onPress={aoAbrirConquistas}
                                style={styles.numero}>
                                <View style={styles.valor}>
                                    <Ionicons name="trophy" size={18} color={theme.sucesso} />
                                    <ThemedText style={styles.cifra}>
                                        {`${numeros.medalhas.ganhas}/${numeros.medalhas.total}`}
                                    </ThemedText>
                                </View>
                                <View style={styles.legendaComSeta}>
                                    <ThemedText type="smallBold" themeColor="primaria">
                                        {TEXTOS_DAS_CONQUISTAS.medalhas}
                                    </ThemedText>
                                    <Ionicons name="chevron-forward" size={12} color={theme.primaria} />
                                </View>
                            </Pressable>
                        </>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    carta: { gap: Spacing.two + 2, padding: Spacing.two + 2, paddingBottom: Spacing.three - 4, borderRadius: Raio.folha, borderWidth: 1.5 },
    arte: {
        height: ALTURA_DA_ARTE,
        borderRadius: Raio.card,
        borderWidth: 1,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    anel: { position: 'absolute', alignSelf: 'center', borderRadius: 999 },
    // O lobinho e os dois anéis têm o mesmo centro, o meio da janela: cada anel sobe da base metade do que
    // sobra da janela depois dele.
    anelExterno: {
        width: Math.round(LARGURA_DO_LOBINHO * 1.4),
        height: Math.round(LARGURA_DO_LOBINHO * 1.4),
        bottom: (ALTURA_DA_ARTE - Math.round(LARGURA_DO_LOBINHO * 1.4)) / 2,
        opacity: 0.55,
    },
    anelInterno: {
        width: LARGURA_DO_LOBINHO,
        height: LARGURA_DO_LOBINHO,
        bottom: (ALTURA_DA_ARTE - LARGURA_DO_LOBINHO) / 2,
        opacity: 0.9,
    },
    // A sombra fica sob os pés do lobinho, que agora estão a meio caminho da base.
    sombra: {
        position: 'absolute',
        bottom: (ALTURA_DA_ARTE - ALTURA_DO_LOBINHO) / 2 - 2,
        width: Math.round(LARGURA_DO_LOBINHO * 0.8),
        height: 12,
        borderRadius: 60,
        opacity: 0.35,
    },
    mascote: { width: LARGURA_DO_LOBINHO, height: ALTURA_DO_LOBINHO },
    placa: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.two,
        minHeight: 54,
        paddingHorizontal: Spacing.three,
        borderRadius: Raio.medio + 2,
    },
    apelido: { flexShrink: 1, fontSize: 24, lineHeight: 30, fontWeight: 700 },
    tipo: { marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11 },
    numeros: { flexDirection: 'row', alignItems: 'center', paddingBottom: Spacing.one },
    numero: { flex: 1, alignItems: 'center', gap: 2 },
    valor: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2 },
    cifra: { fontSize: 26, lineHeight: 32, fontWeight: 700 },
    fio: { width: 1, height: 40 },
    legendaComSeta: { flexDirection: 'row', alignItems: 'center' },
});
