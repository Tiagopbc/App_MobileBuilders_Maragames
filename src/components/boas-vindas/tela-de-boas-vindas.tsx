import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaDeJogador } from '@/components/boas-vindas/carta-de-jogador';
import { BotaoPrincipal } from '@/components/botao-principal';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { LogoBeast } from '@/components/logo-beast';
import { ThemedText } from '@/components/themed-text';
import { TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { LarguraDoFormulario, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TelaDeBoasVindasProps = {
    // A carta de jogador. Null enquanto as lições não chegaram, ou se não puderam ser lidas: a tela
    // aparece sem ela, e o Jogar funciona do mesmo jeito.
    carta: { apelido: string; sequencia: number; xp: number } | null;
    aoJogar: () => void;
    aoAbrirRegras: () => void;
};

// A primeira tela de quem já entrou. No alto, a logo e o nome; no meio, o lobinho sobre dois anéis;
// embaixo, a chamada, a carta de jogador, o Jogar (o único botão) e o link das Regras do jogo. A
// saudação ("Olá") é da home; a Configuração não existe aqui: o tema é do Perfil.
export function TelaDeBoasVindas({ carta, aoJogar, aoAbrirRegras }: TelaDeBoasVindasProps) {
    const theme = useTheme();

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topo}>
                    <LogoBeast tamanho={32} variante="app" />
                    <ThemedText type="smallBold" style={styles.nome}>
                        {TEXTOS_DE_BOAS_VINDAS.nome}
                    </ThemedText>
                </View>

                <View style={styles.palco}>
                    {/* Os anéis e a sombra no chão: o lobinho não flutua no padrão do fundo. */}
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

                <View style={styles.texto}>
                    <ThemedText type="title" accessibilityRole="header">
                        {TEXTOS_DE_BOAS_VINDAS.titulo}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary">{TEXTOS_DE_BOAS_VINDAS.apoio}</ThemedText>
                </View>

                {carta && <CartaDeJogador apelido={carta.apelido} sequencia={carta.sequencia} xp={carta.xp} />}

                <View style={styles.acoes}>
                    <BotaoPrincipal rotulo={TEXTOS_DE_BOAS_VINDAS.jogar} onPress={aoJogar} />
                    <Pressable
                        accessibilityRole="link"
                        accessibilityLabel={TEXTOS_DE_BOAS_VINDAS.regras}
                        hitSlop={Spacing.two}
                        onPress={aoAbrirRegras}
                        style={styles.link}>
                        <Ionicons name="help-circle-outline" size={20} color={theme.primaria} />
                        <ThemedText type="smallBold" themeColor="primaria">
                            {TEXTOS_DE_BOAS_VINDAS.regras}
                        </ThemedText>
                    </Pressable>
                </View>

                <ThemedText type="small" themeColor="textSecondary" style={styles.assinatura}>
                    {TEXTOS_DE_BOAS_VINDAS.assinatura}
                </ThemedText>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario, paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
    topo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.two },
    nome: { flex: 1 },
    palco: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: Spacing.two },
    anel: { position: 'absolute', alignSelf: 'center', borderRadius: 999 },
    anelExterno: { width: 190, height: 190, bottom: Spacing.one, opacity: 0.55 },
    anelInterno: { width: 136, height: 136, bottom: 30, opacity: 0.9 },
    sombra: { position: 'absolute', bottom: Spacing.one, width: 120, height: 12, borderRadius: 60, opacity: 0.4 },
    mascote: { width: '80%', maxWidth: 220, aspectRatio: 615 / 815, maxHeight: '100%' },
    texto: { gap: Spacing.one, marginTop: Spacing.two, marginBottom: Spacing.three },
    acoes: { gap: Spacing.three, marginTop: Spacing.three },
    link: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: Spacing.one, minHeight: 32 },
    assinatura: { textAlign: 'center', marginTop: Spacing.three },
});
