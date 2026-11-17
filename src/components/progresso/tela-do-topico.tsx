import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BotaoPrincipal } from '@/components/botao-principal';
import { MatrizDeQuadrantes } from '@/components/resultado/matriz-de-quadrantes';
import { SeloQuadrante } from '@/components/selo-quadrante';
import { Superficie } from '@/components/superficie';
import { TextoComCodigo } from '@/components/texto-com-codigo';
import { ThemedText } from '@/components/themed-text';
import { CabecalhoComFechar, MolduraDaTela } from '@/components/moldura-da-tela';
import { Carregando, ErroAoCarregar } from '@/components/estado-da-carga';
import { AcertoPorConfianca } from '@/components/progresso/acerto-por-confianca';
import { Spacing } from '@/constants/theme';
import {
    TEXTOS,
    antesEDepois,
    formatarTaxa,
    formatarXp,
    passoFeitoEm,
    verificacaoEHoje,
} from '@/constants/textos';
import type { EstadoDasLicoes } from '@/hooks/use-licoes';
import { useTheme } from '@/hooks/use-theme';
import { questoesDaPratica } from '@/lib/bloco';
import { historicoDoTopico, resumoDasRespostas } from '@/lib/progresso';
import { resultadoDoBloco } from '@/lib/resultado';

type TelaDoTopicoProps = {
    estado: EstadoDasLicoes; // chega do `useLicoes`; quem lê e recarrega é a rota
    topicId: string;
    aoAbrirLicao: () => void; // quem navega é a rota
    aoTentarDeNovo: () => void;
    aoSair: () => void;
};

// O detalhe de um tópico no Progresso (Fase 5 do plano). Os números saem só do que já pode
// aparecer; o histórico diz quais passos foram feitos, sem dizer o acerto. Questão só é citada
// se for da prática: as dos blocos sem feedback voltam na revisão (item 27).
export function TelaDoTopico({ estado, topicId, aoAbrirLicao, aoTentarDeNovo, aoSair }: TelaDoTopicoProps) {
    const theme = useTheme();
    const pronto = estado.tipo === 'pronto' ? estado : null;
    const licao = pronto?.licoes.find((l) => l.topicId === topicId);

    const aVista = pronto ? pronto.aVista.filter((r) => r.topicId === topicId) : [];
    const resumo = resumoDasRespostas(aVista);
    const historico = pronto ? historicoDoTopico(pronto.respostas, topicId) : [];
    // Na prática o feedback já foi dado questão a questão, então citá-las não revela nada.
    const aRevisar = pronto
        ? resultadoDoBloco(
              aVista.filter((r) => r.fase === 'pratica'),
              questoesDaPratica(pronto.questoes, topicId)
          ).questoesARevisar
        : [];
    const enunciadoDe = (id: string) => pronto?.questoes.find((q) => q.id === id)?.enunciado ?? '';

    return (
        <MolduraDaTela largura="conteudo">
            <CabecalhoComFechar rotulo={TEXTOS.voltar} aoFechar={aoSair}>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cresce} numberOfLines={1}>
                    {TEXTOS.progresso}
                </ThemedText>
            </CabecalhoComFechar>

            {estado.tipo === 'carregando' && <Carregando />}

            {estado.tipo === 'erro' && <ErroAoCarregar mensagem={TEXTOS.erroAoCarregarLicoes} aoTentarDeNovo={aoTentarDeNovo} />}

            {pronto && !licao && (
                <View style={styles.centro}>
                    <ThemedText style={styles.textoCentral}>{TEXTOS.licaoNaoExiste}</ThemedText>
                    <BotaoPrincipal rotulo={TEXTOS.voltar} onPress={aoSair} />
                </View>
            )}

            {pronto && licao && (
                <>
                    <ScrollView contentContainerStyle={styles.conteudo}>
                        <ThemedText type="subtitle">{licao.titulo}</ThemedText>

                        {aVista.length === 0 ? (
                            <Superficie style={styles.cartao}>
                                <ThemedText>{TEXTOS.semRespostasAVista}</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary">
                                    {TEXTOS.quandoOsNumerosAparecem}
                                </ThemedText>
                            </Superficie>
                        ) : (
                            <>
                                <Superficie style={styles.cartao}>
                                    {licao.dominio && (
                                        <ThemedText style={styles.numero}>
                                            {`Domínio ${formatarTaxa(licao.dominio.acertos, licao.dominio.total)}`}
                                        </ThemedText>
                                    )}
                                    {licao.resultado?.ciclo === 'completo' && (
                                        <>
                                            <ThemedText>
                                                {antesEDepois(licao.resultado.antes, licao.resultado.depois)}
                                            </ThemedText>
                                            {licao.resultado.revisao && (
                                                <ThemedText>
                                                    {verificacaoEHoje(licao.resultado.depois, licao.resultado.revisao)}
                                                </ThemedText>
                                            )}
                                        </>
                                    )}
                                    {licao.resultado && (
                                        <ThemedText type="small" themeColor="textSecondary">
                                            {`${TEXTOS.xpDaLicao}: ${formatarXp(licao.resultado.xp)}`}
                                        </ThemedText>
                                    )}
                                </Superficie>

                                <View style={styles.secao}>
                                    <ThemedText type="smallBold">{TEXTOS.comoVoceRespondeu}</ThemedText>
                                    <MatrizDeQuadrantes quadrantes={resumo.quadrantes} />
                                </View>

                                <AcertoPorConfianca porConfianca={resumo.porConfianca} espaco={Spacing.two} />
                            </>
                        )}

                        {aRevisar.length > 0 && (
                            <View style={styles.secao}>
                                <ThemedText type="smallBold">{TEXTOS.revisarNaPratica}</ThemedText>
                                {aRevisar.map((questao) => (
                                    <Superficie key={questao.questionId} style={styles.cartao}>
                                        <SeloQuadrante quadrante={questao.quadrante} />
                                        <TextoComCodigo type="small">{enunciadoDe(questao.questionId)}</TextoComCodigo>
                                    </Superficie>
                                ))}
                            </View>
                        )}

                        {historico.length > 0 && (
                            <View style={styles.secao}>
                                <ThemedText type="smallBold">{TEXTOS.historico}</ThemedText>
                                {historico.map((passo) => (
                                    <View key={passo.fase} style={styles.par}>
                                        <Ionicons name="checkmark-circle" size={18} color={theme.sucesso} />
                                        <ThemedText style={styles.cresce}>{passoFeitoEm(passo.fase, passo.em)}</ThemedText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View style={[styles.rodape, { borderTopColor: theme.borda }]}>
                        <BotaoPrincipal rotulo={TEXTOS.abrirALicao} onPress={aoAbrirLicao} />
                    </View>
                </>
            )}
        </MolduraDaTela>
    );
}

const styles = StyleSheet.create({
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
    textoCentral: { textAlign: 'center' },
    conteudo: { gap: Spacing.four, paddingHorizontal: Spacing.four, paddingBottom: Spacing.four },
    secao: { gap: Spacing.two },
    cartao: { gap: Spacing.one, padding: Spacing.three },
    numero: { fontSize: 22, lineHeight: 28, fontWeight: 700 },
    par: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: 32 },
    cresce: { flex: 1 },
    rodape: {
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
