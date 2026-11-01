import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ICONE_DA_MEDALHA } from '@/components/conquistas/icone-da-medalha';
import { CabecalhoDaTela } from '@/components/boas-vindas/cabecalho-da-tela';
import { BotaoPrincipal } from '@/components/botao-principal';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { ThemedText } from '@/components/themed-text';
import {
    MEDALHAS_DO_APP,
    TEXTOS,
    TEXTOS_DAS_CONQUISTAS,
    contagemDeMedalhas,
    estadoDaMedalha,
} from '@/constants/textos';
import { LarguraDoFormulario, Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { medalhasGanhas, type Conquista } from '@/lib/conquistas';

export type EstadoDasConquistas = { tipo: 'carregando' } | { tipo: 'erro' } | { tipo: 'pronto'; conquistas: Conquista[] };

type TelaDeConquistasProps = {
    estado: EstadoDasConquistas;
    aoVoltar: () => void;
    aoTentarDeNovo: () => void;
};

// As Conquistas, que o terceiro número da carta de jogador abre: as medalhas só da pessoa, sem
// comparação. As ganhas mostram o dia; as bloqueadas, o cadeado e, quando contam lições, o quanto falta.
export function TelaDeConquistas({ estado, aoVoltar, aoTentarDeNovo }: TelaDeConquistasProps) {
    const conquistas = estado.tipo === 'pronto' ? estado.conquistas : null;

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <CabecalhoDaTela
                    titulo={TEXTOS_DAS_CONQUISTAS.titulo}
                    aoVoltar={aoVoltar}
                    detalhe={conquistas ? contagemDeMedalhas(medalhasGanhas(conquistas), conquistas.length) : undefined}
                />

                {estado.tipo === 'carregando' && (
                    <View style={styles.centro}>
                        <ActivityIndicator />
                    </View>
                )}

                {estado.tipo === 'erro' && (
                    <View style={styles.centro}>
                        <ThemedText style={styles.textoCentral}>{TEXTOS.erroAoCarregarLicoes}</ThemedText>
                        <BotaoPrincipal rotulo={TEXTOS.tentarDeNovo} onPress={aoTentarDeNovo} />
                    </View>
                )}

                {conquistas && (
                    <ScrollView contentContainerStyle={styles.conteudo}>
                        <ThemedText themeColor="textoDeApoio">{TEXTOS_DAS_CONQUISTAS.apoio}</ThemedText>
                        <View style={styles.grade}>
                            {conquistas.map((conquista) => (
                                <Medalha key={conquista.id} conquista={conquista} />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </FundoDaMarca>
    );
}

function Medalha({ conquista }: { conquista: Conquista }) {
    const theme = useTheme();
    const { id } = conquista;
    const { nome, descricao } = MEDALHAS_DO_APP[id];
    const ganha = conquista.ganhaEm !== null;
    const estado = estadoDaMedalha(conquista);

    return (
        <View
            testID={`medalha-${id}`}
            accessible
            accessibilityLabel={`${nome}. ${descricao} ${estado}`}
            // O card das bloqueadas é cheio, e não vazado, para o texto não ficar sobre o padrão do fundo.
            style={[
                styles.medalha,
                ganha
                    ? { backgroundColor: theme.cartaoSelecionado, borderColor: theme.bordaSelecionada }
                    : { backgroundColor: theme.cartao, borderColor: theme.textSecondary, borderStyle: 'dashed' },
            ]}>
            <View
                testID={`disco-${id}`}
                style={[
                    styles.disco,
                    ganha
                        ? { backgroundColor: theme.primaria }
                        : { borderWidth: 2, borderColor: theme.textSecondary, borderStyle: 'dashed' },
                ]}>
                <Ionicons name={ICONE_DA_MEDALHA[id]} size={26} color={ganha ? theme.background : theme.textSecondary} />
            </View>
            <ThemedText style={styles.nome}>{nome}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
                {descricao}
            </ThemedText>
            <View style={styles.estado}>
                <Ionicons
                    name={ganha ? 'checkmark-circle' : 'lock-closed'}
                    size={14}
                    color={ganha ? theme.sucesso : theme.text}
                />
                <ThemedText type="smallBold">{estado}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario },
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
    textoCentral: { textAlign: 'center' },
    conteudo: { gap: Spacing.three, paddingHorizontal: Spacing.four, paddingBottom: Spacing.five },
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
    medalha: {
        flexGrow: 1,
        flexBasis: '45%',
        minHeight: 168,
        gap: Spacing.one,
        padding: 12,
        borderRadius: Raio.card,
        borderWidth: 1.5,
    },
    disco: {
        width: 48,
        height: 48,
        borderRadius: Raio.selo,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.one,
    },
    nome: { fontSize: 15, lineHeight: 20, fontWeight: 600 },
    estado: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: 'auto', paddingTop: Spacing.one },
});
