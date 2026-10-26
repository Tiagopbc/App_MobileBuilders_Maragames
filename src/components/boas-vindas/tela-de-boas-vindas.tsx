import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotaoPrincipal } from '@/components/botao-principal';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { LogoBeast } from '@/components/logo-beast';
import { ThemedText } from '@/components/themed-text';
import { TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { LarguraDoFormulario, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TelaDeBoasVindasProps = {
    aoIniciar: () => void;
    aoAbrirConfiguracao: () => void;
    aoAbrirRegras: () => void;
};

// A primeira tela de quem já entrou. Só apresenta o app: no alto, a logo e o nome, com a
// Configuração (⚙) e as Regras do jogo (?); no meio, o lobinho; embaixo, a chamada, uma frase e o
// Iniciar. Não diz o nome da pessoa nem lê nada do banco: a saudação é da home.
export function TelaDeBoasVindas({ aoIniciar, aoAbrirConfiguracao, aoAbrirRegras }: TelaDeBoasVindasProps) {
    const theme = useTheme();

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topo}>
                    <LogoBeast tamanho={32} variante="app" />
                    <ThemedText type="smallBold" style={styles.nome}>
                        {TEXTOS_DE_BOAS_VINDAS.nome}
                    </ThemedText>
                    <BotaoDeIcone icone="settings-sharp" rotulo={TEXTOS_DE_BOAS_VINDAS.configuracao} onPress={aoAbrirConfiguracao} />
                    <BotaoDeIcone icone="help" rotulo={TEXTOS_DE_BOAS_VINDAS.regras} onPress={aoAbrirRegras} />
                </View>

                <View style={styles.palco}>
                    {/* A sombra no chão, para o lobinho não flutuar no padrão do fundo. */}
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

                <BotaoPrincipal rotulo={TEXTOS_DE_BOAS_VINDAS.iniciar} onPress={aoIniciar} />

                <ThemedText type="small" themeColor="textSecondary" style={styles.assinatura}>
                    {TEXTOS_DE_BOAS_VINDAS.assinatura}
                </ThemedText>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

// Um botão só com o ícone, sem caixa: discreto, para nada além do Iniciar parecer o próximo passo.
// O leitor de tela diz o rótulo, e a área de toque continua com 44 pontos.
function BotaoDeIcone({
    icone,
    rotulo,
    onPress,
}: {
    icone: keyof typeof Ionicons.glyphMap;
    rotulo: string;
    onPress: () => void;
}) {
    const theme = useTheme();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            onPress={onPress}
            style={({ pressed }) => [styles.botaoDeIcone, { opacity: pressed ? 0.6 : 1 }]}>
            <Ionicons name={icone} size={22} color={theme.primaria} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario, paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
    topo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.two },
    nome: { flex: 1 },
    palco: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: Spacing.four },
    sombra: { position: 'absolute', bottom: Spacing.three, width: 160, height: 18, borderRadius: 80, opacity: 0.5 },
    mascote: { width: '80%', maxWidth: 280, aspectRatio: 615 / 815, maxHeight: '100%' },
    texto: { gap: Spacing.two, marginBottom: Spacing.four },
    assinatura: { textAlign: 'center', marginTop: Spacing.three },
    botaoDeIcone: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
