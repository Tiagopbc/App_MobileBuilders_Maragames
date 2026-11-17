import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BotaoPrincipal } from '@/components/botao-principal';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { TEXTOS } from '@/constants/textos';

/** Enquanto a tela lê os dados: o indicador no centro do espaço que sobra. */
export function Carregando({ rotulo }: { rotulo?: string }) {
    return (
        <View style={styles.centro}>
            <ActivityIndicator testID="carregando" accessibilityLabel={rotulo} />
        </View>
    );
}

/** A leitura falhou: o que houve e o botão de tentar de novo, no centro. */
export function ErroAoCarregar({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo: () => void }) {
    return (
        <View style={styles.centro}>
            <ThemedText style={styles.textoCentral}>{mensagem}</ThemedText>
            <BotaoPrincipal rotulo={TEXTOS.tentarDeNovo} onPress={aoTentarDeNovo} />
        </View>
    );
}

const styles = StyleSheet.create({
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
    textoCentral: { textAlign: 'center' },
});
