import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { BotaoPrincipal } from '@/components/botao-principal';
import { BotaoSecundario } from '@/components/botao-secundario';
import { ICONE_DA_MEDALHA } from '@/components/conquistas/icone-da-medalha';
import { AntesEDepois } from '@/components/licao/antes-e-depois';
import { Mascote } from '@/components/mascote';
import { MatrizDeQuadrantes } from '@/components/resultado/matriz-de-quadrantes';
import { ResultadoDoBloco } from '@/components/resultado/resultado-do-bloco';
import { Superficie, SuperficieQueLevaToque } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
    MEDALHAS_DO_APP,
    TEXTOS,
    acertosDoTopico,
    botaoDaSugestao,
    formatarXp,
    quandoARevisaoAbreComQuestoes,
    variacaoDaRevisao,
    variacaoDoFim,
} from '@/constants/textos';
import type { Relatorio } from '@/hooks/use-bloco';
import { useLicoes } from '@/hooks/use-licoes';
import { useTheme } from '@/hooks/use-theme';
import { conquistasDoAluno, medalhasNovasDoPasso, type IdDaMedalha } from '@/lib/conquistas';
import { FASE_DO_PASSO, type PassoComQuestoes, type ResultadoDaLicao } from '@/lib/licao';
import type { FormaPre } from '@/types/domain';

// O fim de cada passo de uma lição (item 30). Entram no lugar do resultado do bloco, dentro da
// tela do bloco: quem escolhe qual mostrar e para onde o botão leva é a rota.

/** Fim do diagnóstico: nenhum número. O acerto dele só aparece no fim da lição, ao lado do depois. */
export function DiagnosticoFeito({ aoContinuar }: { aoContinuar: () => void }) {
    const theme = useTheme();

    return (
        <View style={styles.centro}>
            <Ionicons name="checkmark-done-circle" size={56} color={theme.sucesso} />
            <ThemedText type="subtitle" style={styles.textoCentral}>
                {TEXTOS.diagnosticoFeito}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.textoCentral}>
                {TEXTOS.diagnosticoFeitoDetalhe}
            </ThemedText>
            <BotaoPrincipal rotulo={TEXTOS.irParaOCartao} onPress={aoContinuar} />
        </View>
    );
}

type PraticaFeitaProps = {
    relatorio: Relatorio;
    rotulo: string; // "Fazer a verificação" no meio da lição; "Voltar para a lição" ao rever
    aoContinuar: () => void;
};

/** Fim da prática: o resultado de sempre, com as questões a revisar, e o botão do passo seguinte. */
export function PraticaFeita({ relatorio, rotulo, aoContinuar }: PraticaFeitaProps) {
    const theme = useTheme();

    return (
        <>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <ResultadoDoBloco relatorio={relatorio} medido={false} />
            </ScrollView>
            <View style={[styles.rodape, { borderTopColor: theme.borda }]}>
                <BotaoPrincipal rotulo={rotulo} onPress={aoContinuar} />
            </View>
        </>
    );
}

type FimDaLicaoProps = {
    uid: string;
    topicId: string;
    formaPre: FormaPre | null;
    passo: PassoComQuestoes; // o passo que acabou: dele vêm as medalhas novas
    aoVoltarAoInicio: () => void;
    aoAbrirLicao: (topicId: string) => void; // a próxima lição, que o botão principal abre
    aoAbrirConquistas: () => void;
    relogio?: () => number; // ms; trocável em teste
};

/**
 * Fim da verificação, da revisão ou, no ciclo curto, da prática: o resultado da lição, as medalhas
 * que o passo trouxe e o caminho adiante. Nada por questão: a revisão repete as questões da
 * verificação, e dizer quais a pessoa errou ensinaria o que vai ser medido de novo (item 27).
 */
export function FimDaLicao({
    uid,
    topicId,
    formaPre,
    passo,
    aoVoltarAoInicio,
    aoAbrirLicao,
    aoAbrirConquistas,
    relogio,
}: FimDaLicaoProps) {
    const theme = useTheme();
    // A mesma conta da lista de lições, refeita agora que o passo terminou: dela saem também a
    // próxima lição sugerida e as medalhas.
    const { estado, recarregar } = useLicoes({ uid, formaPre, relogio });

    useEffect(() => {
        recarregar();
    }, [recarregar]);

    if (estado.tipo === 'carregando') {
        return (
            <View style={styles.centro}>
                <ActivityIndicator />
            </View>
        );
    }

    const licao = estado.tipo === 'pronto' ? estado.licoes.find((l) => l.topicId === topicId) : undefined;
    if (estado.tipo !== 'pronto' || !licao || licao.resultado === null) {
        return (
            <View style={styles.centro}>
                <ThemedText style={styles.textoCentral}>{TEXTOS.erroAoCarregarLicao}</ThemedText>
                <BotaoPrincipal rotulo={TEXTOS.tentarDeNovo} onPress={recarregar} />
            </View>
        );
    }

    const { resultado, titulo } = licao;
    const conquistas = conquistasDoAluno({
        licoes: estado.licoes,
        respostas: estado.respostas,
        questoes: estado.questoes,
        formaPre,
    });
    const medalhasNovas = medalhasNovasDoPasso(conquistas, estado.respostas, topicId, FASE_DO_PASSO[passo]);
    const proximaId = 'topicId' in estado.sugestao ? estado.sugestao.topicId : null;
    const proxima = estado.licoes.find((l) => l.topicId === proximaId);
    const rotuloDaProxima = botaoDaSugestao(estado.sugestao, proxima?.titulo ?? null);

    return (
        <>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.heroi}>
                    <View style={styles.palco}>
                        <View style={[styles.anel, { backgroundColor: theme.realce }]} />
                        <Mascote altura={140} />
                    </View>
                    <ThemedText type="title" accessibilityRole="header" style={styles.textoCentral}>
                        {/* "Concluída" é a lição com a revisão feita (como na lista de Lições): no fim da
                            verificação ainda falta a revisão, 7 dias depois. A lição curta não tem revisão. */}
                        {resultado.ciclo === 'curto'
                            ? TEXTOS.licaoConcluida
                            : resultado.revisao
                              ? TEXTOS.revisaoFeita
                              : TEXTOS.verificacaoFeita}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.textoCentral}>
                        {titulo}
                    </ThemedText>
                </View>

                {resultado.ciclo === 'curto' ? (
                    <ThemedText style={styles.textoCentral}>
                        {acertosDoTopico(resultado.pratica.acertos, resultado.pratica.total, titulo, resultado.xp)}
                    </ThemedText>
                ) : (
                    <Superficie style={styles.cartao}>
                        {resultado.revisao ? (
                            <AntesEDepois
                                rotuloAntes={TEXTOS.naVerificacao}
                                antes={resultado.depois}
                                rotuloDepois={TEXTOS.hoje}
                                depois={resultado.revisao}
                            />
                        ) : (
                            <AntesEDepois
                                rotuloAntes={TEXTOS.antesDiagnostico}
                                antes={resultado.antes}
                                rotuloDepois={TEXTOS.depoisVerificacao}
                                depois={resultado.depois}
                            />
                        )}
                        <VariacaoDoFim resultado={resultado} />
                        <ThemedText type="small" themeColor="textSecondary">
                            {/* O saldo aparece como é, inclusive negativo (item 14). Na revisão feita, o número é só
                                o da revisão: o da lição inteira parecia o custo de uma revisão curta. */}
                            {resultado.xpDaRevisao === null
                                ? `${TEXTOS.xpDaLicao}: ${formatarXp(resultado.xp)}`
                                : `${TEXTOS.xpDaRevisao}: ${formatarXp(resultado.xpDaRevisao)}`}
                        </ThemedText>
                    </Superficie>
                )}

                <View style={styles.secao}>
                    <ThemedText type="smallBold">{TEXTOS.comoVoceRespondeuNaLicao}</ThemedText>
                    <MatrizDeQuadrantes quadrantes={resultado.quadrantes} />
                </View>

                {medalhasNovas.map((medalha) => (
                    <MedalhaNova key={medalha.id} id={medalha.id} aoAbrir={aoAbrirConquistas} />
                ))}

                {licao.estado.tipo === 'aguardando_revisao' && resultado.ciclo === 'completo' && (
                    <View style={styles.aviso}>
                        <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} style={styles.iconeDoAviso} />
                        <ThemedText type="small" style={styles.cresce}>
                            {quandoARevisaoAbreComQuestoes(licao.estado.liberaEm, resultado.depois.total)}
                        </ThemedText>
                    </View>
                )}
            </ScrollView>

            <View style={[styles.rodape, { borderTopColor: theme.borda }]}>
                {rotuloDaProxima && proximaId && (
                    <BotaoPrincipal rotulo={rotuloDaProxima} onPress={() => aoAbrirLicao(proximaId)} />
                )}
                <BotaoSecundario rotulo={TEXTOS.voltarAoInicio} onPress={aoVoltarAoInicio} />
            </View>
        </>
    );
}

/** A linha sob o antes e o depois: o que mudou no resultado. Só a melhora ganha a cor de sucesso. */
function VariacaoDoFim({ resultado }: { resultado: Extract<ResultadoDaLicao, { ciclo: 'completo' }> }) {
    const theme = useTheme();

    if (resultado.revisao) {
        return <ThemedText type="smallBold">{variacaoDaRevisao(resultado.revisao)}</ThemedText>;
    }

    const { texto, melhorou } = variacaoDoFim(resultado.antes, resultado.depois);
    return (
        <View style={styles.variacao}>
            {melhorou && <Ionicons name="trending-up" size={18} color={theme.sucesso} />}
            <ThemedText type="smallBold" themeColor={melhorou ? 'sucesso' : 'text'}>
                {texto}
            </ThemedText>
        </View>
    );
}

/** O aviso de medalha ganha neste passo: leva às Conquistas. */
function MedalhaNova({ id, aoAbrir }: { id: IdDaMedalha; aoAbrir: () => void }) {
    const theme = useTheme();
    const { nome } = MEDALHAS_DO_APP[id];

    return (
        <SuperficieQueLevaToque
            accessibilityRole="link"
            accessibilityLabel={`${TEXTOS.medalhaNova}: ${nome}`}
            onPress={aoAbrir}
            style={styles.medalha}>
            <View style={[styles.disco, { backgroundColor: theme.primaria }]}>
                <Ionicons name={ICONE_DA_MEDALHA[id]} size={22} color={theme.background} />
            </View>
            <View style={styles.cresce}>
                <ThemedText type="small" themeColor="textSecondary">
                    {TEXTOS.medalhaNova}
                </ThemedText>
                <ThemedText style={styles.nomeDaMedalha}>{nome}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </SuperficieQueLevaToque>
    );
}

const styles = StyleSheet.create({
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
    textoCentral: { textAlign: 'center' },
    conteudo: { gap: Spacing.three, paddingHorizontal: Spacing.four, paddingBottom: Spacing.four },
    heroi: { alignItems: 'center', gap: Spacing.one },
    palco: { width: 180, height: 140, alignItems: 'center', justifyContent: 'flex-end' },
    anel: { position: 'absolute', top: 6, width: 130, height: 130, borderRadius: 65 },
    cartao: { alignSelf: 'stretch', gap: Spacing.two, padding: Spacing.three },
    variacao: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + Spacing.half },
    secao: { alignSelf: 'stretch', gap: Spacing.two },
    medalha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: 10, paddingHorizontal: 14 },
    disco: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    nomeDaMedalha: { fontSize: 16, lineHeight: 22, fontWeight: 600 },
    cresce: { flex: 1 },
    aviso: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
    iconeDoAviso: { marginTop: 1 },
    rodape: {
        gap: Spacing.two,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
