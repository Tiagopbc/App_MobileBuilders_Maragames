import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CabecalhoDaTela } from '@/components/boas-vindas/cabecalho-da-tela';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { Secao } from '@/components/perfil/secao';
import { SeletorDeTema } from '@/components/perfil/seletor-de-tema';
import { TEXTOS, TEXTOS_DE_BOAS_VINDAS } from '@/constants/textos';
import { LarguraDoFormulario, Spacing } from '@/constants/theme';

// A Configuração, que o ⚙ da boas-vindas abre. Por enquanto só o tema, o mesmo seletor do Perfil:
// os dois mexem na mesma preferência guardada no aparelho.
export function TelaDeConfiguracao({ aoVoltar }: { aoVoltar: () => void }) {
    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <CabecalhoDaTela titulo={TEXTOS_DE_BOAS_VINDAS.configuracao} aoVoltar={aoVoltar} />
                <ScrollView contentContainerStyle={styles.conteudo}>
                    <Secao titulo={TEXTOS.aparencia}>
                        <SeletorDeTema />
                    </Secao>
                </ScrollView>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario },
    conteudo: { gap: Spacing.five, paddingHorizontal: Spacing.four, paddingBottom: Spacing.five },
});
