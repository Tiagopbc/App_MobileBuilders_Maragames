import { Ionicons } from '@expo/vector-icons';
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

// A primeira tela de quem já entrou: o nome do app, o Iniciar, e no rodapé a Configuração (⚙) e
// as Regras do jogo (?). Não diz o nome da pessoa nem lê nada do banco: a saudação é da home.
export function TelaDeBoasVindas({ aoIniciar, aoAbrirConfiguracao, aoAbrirRegras }: TelaDeBoasVindasProps) {
    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centro}>
                    <LogoBeast tamanho={112} variante="maranhao" />
                    <View style={styles.marca}>
                        <ThemedText type="title" accessibilityRole="header" style={styles.noCentro}>
                            {TEXTOS_DE_BOAS_VINDAS.nome}
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.noCentro}>
                            {TEXTOS_DE_BOAS_VINDAS.assinatura}
                        </ThemedText>
                    </View>
                    <View style={styles.iniciar}>
                        <BotaoPrincipal rotulo={TEXTOS_DE_BOAS_VINDAS.iniciar} onPress={aoIniciar} />
                    </View>
                </View>

                <View style={styles.rodape}>
                    <BotaoDeIcone icone="settings-sharp" rotulo={TEXTOS_DE_BOAS_VINDAS.configuracao} onPress={aoAbrirConfiguracao} />
                    <BotaoDeIcone icone="help" rotulo={TEXTOS_DE_BOAS_VINDAS.regras} onPress={aoAbrirRegras} />
                </View>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

// Um botão quadrado só com o ícone: o leitor de tela diz o rótulo.
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
            style={({ pressed }) => [
                styles.botaoDeIcone,
                { backgroundColor: theme.backgroundElement, borderColor: theme.borda, opacity: pressed ? 0.6 : 1 },
            ]}>
            <Ionicons name={icone} size={26} color={theme.primaria} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario, paddingHorizontal: Spacing.four, paddingBottom: Spacing.three },
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.five },
    marca: { gap: Spacing.one, alignItems: 'center' },
    noCentro: { textAlign: 'center' },
    iniciar: { alignSelf: 'stretch' },
    rodape: { flexDirection: 'row', justifyContent: 'space-between' },
    botaoDeIcone: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
