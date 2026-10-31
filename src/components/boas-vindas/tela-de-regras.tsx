import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CabecalhoDaTela } from '@/components/boas-vindas/cabecalho-da-tela';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { APARENCIA_DO_QUADRANTE } from '@/components/selo-quadrante';
import { Superficie } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import {
    DESCRICAO_QUADRANTE,
    NIVEIS_DE_CONFIANCA,
    ROTULO_CONFIANCA,
    ROTULO_QUADRANTE,
    TEXTOS_DAS_REGRAS,
    TEXTOS_DE_BOAS_VINDAS,
    formatarPontos,
} from '@/constants/textos';
import { LarguraDoFormulario, Raio, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Quadrante } from '@/lib/quadrante';
import { xpDaResposta } from '@/lib/xp';

// As linhas da matriz: acertou e errou; em cada uma, com certeza e sem certeza.
const LINHAS_DA_MATRIZ: readonly { rotulo: 'acertou' | 'errou'; quadrantes: readonly [Quadrante, Quadrante] }[] = [
    { rotulo: 'acertou', quadrantes: ['firme', 'fragil'] },
    { rotulo: 'errou', quadrantes: ['ponto_cego', 'lacuna'] },
];

// As Regras do jogo, que o ? da boas-vindas e o link da pergunta abrem: só leitura, em cards
// curtos. Os pontos saem da conta do XP, e os quadrantes das mesmas listas do resultado.
export function TelaDeRegras({ aoVoltar }: { aoVoltar: () => void }) {
    const { jogo, certeza, pontos, resultado, licao, sequencia } = TEXTOS_DAS_REGRAS;

    return (
        <FundoDaMarca style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <CabecalhoDaTela titulo={TEXTOS_DE_BOAS_VINDAS.regras} aoVoltar={aoVoltar} />
                <ScrollView contentContainerStyle={styles.conteudo}>
                    <CardDaRegra titulo={jogo.titulo}>
                        <ThemedText>{jogo.texto}</ThemedText>
                        <ThemedText themeColor="textoDeApoio">{jogo.apoio}</ThemedText>
                    </CardDaRegra>

                    <CardDaRegra titulo={certeza.titulo}>
                        <ThemedText>{certeza.texto}</ThemedText>
                        <NiveisDeCerteza />
                    </CardDaRegra>

                    <CardDaRegra titulo={pontos.titulo}>
                        <TabelaDePontos />
                        <ThemedText themeColor="textoDeApoio">{pontos.apoio}</ThemedText>
                    </CardDaRegra>

                    <CardDaRegra titulo={resultado.titulo}>
                        <ThemedText>{resultado.texto}</ThemedText>
                        <MatrizDeQuadrantes />
                    </CardDaRegra>

                    <CardDaRegra titulo={licao.titulo}>
                        <ThemedText>{licao.etapas}</ThemedText>
                        <ThemedText themeColor="textoDeApoio">{licao.medido}</ThemedText>
                    </CardDaRegra>

                    <CardDaRegra titulo={sequencia.titulo}>
                        <ThemedText>{sequencia.texto}</ThemedText>
                    </CardDaRegra>
                </ScrollView>
            </SafeAreaView>
        </FundoDaMarca>
    );
}

// Um card com o título em caixa-alta; o leitor de tela anuncia o título como cabeçalho.
function CardDaRegra({ titulo, children }: { titulo: string; children: ReactNode }) {
    return (
        <Superficie style={styles.card}>
            <ThemedText type="smallBold" themeColor="primaria" accessibilityRole="header" style={styles.titulo}>
                {titulo}
            </ThemedText>
            {children}
        </Superficie>
    );
}

// Os três níveis, só para mostrar quais são: aqui ninguém escolhe.
function NiveisDeCerteza() {
    const theme = useTheme();

    return (
        <View style={styles.niveis}>
            {NIVEIS_DE_CONFIANCA.map((nivel) => (
                <View key={nivel} style={[styles.nivel, { borderColor: theme.bordaDoCartao }]}>
                    <ThemedText type="smallBold" style={styles.centro}>
                        {ROTULO_CONFIANCA[nivel]}
                    </ThemedText>
                </View>
            ))}
        </View>
    );
}

// O que cada nível vale ao acertar e ao errar, direto da conta do XP.
function TabelaDePontos() {
    const theme = useTheme();
    const { acertar, errar } = TEXTOS_DAS_REGRAS.pontos;

    return (
        <View testID="tabela-de-pontos" style={styles.tabela}>
            <View style={styles.linhaDaTabela}>
                <View style={styles.rotuloDoNivel} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.valor}>
                    {acertar}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.valor}>
                    {errar}
                </ThemedText>
            </View>
            {NIVEIS_DE_CONFIANCA.map((nivel) => (
                <View
                    key={nivel}
                    testID={`pontos-${nivel}`}
                    style={[styles.linhaDaTabela, styles.comFio, { borderTopColor: theme.borda }]}>
                    <ThemedText style={styles.rotuloDoNivel}>{ROTULO_CONFIANCA[nivel]}</ThemedText>
                    <ThemedText style={styles.valor}>{formatarPontos(xpDaResposta(true, nivel))}</ThemedText>
                    <ThemedText style={styles.valor}>{formatarPontos(xpDaResposta(false, nivel))}</ThemedText>
                </View>
            ))}
        </View>
    );
}

// Acertou e errou nas linhas, com e sem certeza nas colunas: os quatro quadrantes do resultado.
function MatrizDeQuadrantes() {
    const { comCerteza, semCerteza, acertou, errou } = TEXTOS_DAS_REGRAS.resultado;
    const rotulos = { acertou, errou };

    return (
        <View testID="matriz-de-quadrantes" style={styles.matriz}>
            <View style={styles.linhaDaMatriz}>
                <View style={styles.cabecaDaLinha} />
                <ThemedText type="small" themeColor="textSecondary" style={[styles.celula, styles.centro]}>
                    {comCerteza}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={[styles.celula, styles.centro]}>
                    {semCerteza}
                </ThemedText>
            </View>
            {LINHAS_DA_MATRIZ.map(({ rotulo, quadrantes }) => (
                <View key={rotulo} style={styles.linhaDaMatriz}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.cabecaDaLinha}>
                        {rotulos[rotulo]}
                    </ThemedText>
                    {quadrantes.map((quadrante) => (
                        <CelulaDoQuadrante key={quadrante} quadrante={quadrante} />
                    ))}
                </View>
            ))}
        </View>
    );
}

function CelulaDoQuadrante({ quadrante }: { quadrante: Quadrante }) {
    const theme = useTheme();
    const { cor, fundo } = APARENCIA_DO_QUADRANTE[quadrante];

    return (
        <View style={[styles.celula, styles.quadrante, { backgroundColor: theme[fundo], borderColor: theme[cor] }]}>
            <ThemedText type="smallBold" themeColor={cor}>
                {ROTULO_QUADRANTE[quadrante]}
            </ThemedText>
            <ThemedText type="small" themeColor="textoDeApoio">
                {DESCRICAO_QUADRANTE[quadrante]}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    safeArea: { flex: 1, maxWidth: LarguraDoFormulario },
    conteudo: { gap: Spacing.three, paddingHorizontal: Spacing.four, paddingBottom: Spacing.five },
    card: { gap: Spacing.two, padding: Spacing.three },
    titulo: { textTransform: 'uppercase', letterSpacing: 0.8 },
    niveis: { flexDirection: 'row', gap: Spacing.two },
    nivel: { flex: 1, borderWidth: 1.5, borderRadius: Raio.medio, paddingVertical: Spacing.two, paddingHorizontal: Spacing.one },
    centro: { textAlign: 'center' },
    tabela: { gap: 0 },
    linhaDaTabela: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.two },
    comFio: { borderTopWidth: StyleSheet.hairlineWidth },
    rotuloDoNivel: { flex: 1 },
    valor: { width: 64, textAlign: 'right' },
    matriz: { gap: Spacing.two },
    linhaDaMatriz: { flexDirection: 'row', alignItems: 'stretch', gap: Spacing.two },
    cabecaDaLinha: { width: 64, alignSelf: 'center' },
    celula: { flex: 1 },
    quadrante: { gap: Spacing.half, padding: Spacing.two, borderRadius: Raio.medio, borderWidth: 1.5 },
});
