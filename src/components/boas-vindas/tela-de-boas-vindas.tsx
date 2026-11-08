import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaDeJogador, type NumerosDaCarta } from '@/components/boas-vindas/carta-de-jogador';
import { ConviteDasRegras } from '@/components/boas-vindas/convite-das-regras';
import { BotaoPrincipal } from '@/components/botao-principal';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { LogoBeast } from '@/components/logo-beast';
import { ThemedText } from '@/components/themed-text';
import { TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { LarguraDoFormulario, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TelaDeBoasVindasProps = {
    apelido: string;
    // Os números da carta. Null enquanto as lições não chegaram, ou se não puderam ser lidas: a carta
    // aparece só com a arte e a placa, e o Jogar funciona do mesmo jeito.
    numeros: NumerosDaCarta | null;
    // Quem ainda não terminou nenhuma lição vê o convite para o Como jogar; depois, o botão ? fixo no
    // topo. Null enquanto não se sabe (as lições carregando): nenhum dos dois aparece, para a tela não
    // trocar de cara.
    primeiraVez: boolean | null;
    aoJogar: () => void;
    aoAbrirRegras: () => void;
    aoAbrirConquistas: () => void;
};

// A primeira tela de quem já entrou. No alto, a logo e o nome; embaixo, a chamada, a carta de jogador (o
// lobinho sobre dois anéis, o apelido e os números), o convite para o Como jogar e o Jogar, o único botão.
// A saudação ("Olá") é da home; a Configuração não existe aqui: o tema é do Perfil.
export function TelaDeBoasVindas({
    apelido,
    numeros,
    primeiraVez,
    aoJogar,
    aoAbrirRegras,
    aoAbrirConquistas,
}: TelaDeBoasVindasProps) {
    const theme = useTheme();

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Rola, para o Jogar não ficar fora de alcance num celular baixo; em tela alta o
                    conteúdo cresce até a altura toda, e a assinatura fica no pé. */}
                <ScrollView testID="rolagem-da-boas-vindas" contentContainerStyle={styles.conteudo}>
                    <View style={styles.topo}>
                        <View style={styles.marca}>
                            <LogoBeast tamanho={32} variante="app" />
                            <ThemedText type="smallBold" themeColor="primaria" numberOfLines={1} style={styles.nome}>
                                {TEXTOS_DE_BOAS_VINDAS.nome}
                            </ThemedText>
                        </View>
                        {primeiraVez === false && (
                            <Pressable
                                accessibilityRole="link"
                                accessibilityLabel={TEXTOS_DE_BOAS_VINDAS.regras}
                                hitSlop={Spacing.two}
                                onPress={aoAbrirRegras}
                                style={[styles.ajuda, { backgroundColor: theme.cartao, borderColor: theme.bordaDoCartao }]}>
                                <Ionicons name="help-circle-outline" size={22} color={theme.primaria} />
                            </Pressable>
                        )}
                    </View>

                    <ThemedText accessibilityRole="header" style={styles.titulo}>
                        {TEXTOS_DE_BOAS_VINDAS.titulo}
                    </ThemedText>

                    <CartaDeJogador apelido={apelido} numeros={numeros} aoAbrirConquistas={aoAbrirConquistas} />

                    {primeiraVez === true && (
                        <View style={styles.convite}>
                            <ConviteDasRegras aoAbrir={aoAbrirRegras} />
                        </View>
                    )}

                    <View style={styles.acoes}>
                        <BotaoPrincipal rotulo={TEXTOS_DE_BOAS_VINDAS.jogar} onPress={aoJogar} />
                    </View>

                    <ThemedText type="small" themeColor="textSecondary" style={styles.assinatura}>
                        {TEXTOS_DE_BOAS_VINDAS.assinatura}
                    </ThemedText>
                </ScrollView>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario },
    conteudo: { flexGrow: 1, paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.two,
        minHeight: 40,
        paddingTop: Spacing.two,
    },
    marca: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 2, flexShrink: 1 },
    nome: { flexShrink: 1 },
    ajuda: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    titulo: { fontSize: 22, lineHeight: 28, fontWeight: 700, marginTop: Spacing.three - 4, marginBottom: Spacing.three - 2 },
    convite: { marginTop: Spacing.three - 2 },
    acoes: { marginTop: Spacing.three + 2 },
    assinatura: { textAlign: 'center', marginTop: 'auto', paddingTop: Spacing.three - 2 },
});
