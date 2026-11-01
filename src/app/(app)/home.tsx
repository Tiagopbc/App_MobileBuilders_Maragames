import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { BotaoPrincipal } from '@/components/botao-principal';
import { FundoDaMarca } from '@/components/fundo-da-marca';
import { CartaoDaSequencia } from '@/components/home/cartao-da-sequencia';
import { EtapasDoParaHoje } from '@/components/home/etapas-do-para-hoje';
import { RevisaoSelada } from '@/components/home/revisao-selada';
import { SeloDeXp } from '@/components/home/selo-de-xp';
import { Superficie, SuperficieQueLevaToque } from '@/components/superficie';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  TEXTOS,
  detalheDaSugestao,
  linhaDoModulo,
  proximaRevisao,
  quandoARevisaoAbre,
  rotuloDoBotaoDaLicao,
  tituloDaSugestao,
} from '@/constants/textos';
import { useAoVoltarAoApp } from '@/hooks/use-ao-voltar-ao-app';
import { useLicoes, type LicaoDoAluno } from '@/hooks/use-licoes';
import { useTheme } from '@/hooks/use-theme';
import { destinoDaLicao, licaoFeita, segmentosDoParaHoje } from '@/lib/licao';
import { participanteDoRoteiro } from '@/lib/participante';
import { semanaDaSequencia } from '@/lib/sequencia';
import { useSession } from '@/lib/session';
import { xpDeHoje } from '@/lib/xp';

type Atalho = {
  id: string;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  rota: '/licoes' | '/progresso' | '/perfil';
  // Só o ícone: o título vira o nome do botão para o leitor de tela.
  soIcone?: boolean;
};

// Os atalhos são dados: acrescentar ou reordenar é mexer nesta lista, sem tocar no layout (item 6).
const ATALHOS: Atalho[] = [
  { id: 'licoes', titulo: 'Lições', icone: 'book', rota: '/licoes' },
  { id: 'progresso', titulo: 'Progresso', icone: 'stats-chart', rota: '/progresso' },
  { id: 'perfil', titulo: 'Perfil', icone: 'person', rota: '/perfil', soIcone: true },
];

export default function HomeScreen() {
  const { perfil, user, precisaDaAutoavaliacao } = useSession();
  const theme = useTheme();
  const router = useRouter();

  const { formaPre } = participanteDoRoteiro(perfil);
  // Nada é guardado: as lições saem das respostas, a cada vez que a home aparece.
  const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });

  // Roda quando a home ganha foco, inclusive na volta de uma lição, e não só na primeira vez.
  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar])
  );
  // E quando o app volta do segundo plano: a revisão abre pela virada do dia, e quem deixou o
  // app aberto e volta no dia dela não troca de tela.
  useAoVoltarAoApp(recarregar);

  const pronto = estado.tipo === 'pronto' ? estado : null;
  const sugestao = pronto?.sugestao;
  // A lição que o Para hoje aponta: a da revisão, a que ficou pela metade ou a próxima nova.
  const sugerida =
    pronto && sugestao && (sugestao.tipo === 'revisao' || sugestao.tipo === 'continuar' || sugestao.tipo === 'nova')
      ? pronto.licoes.find((l) => l.topicId === sugestao.topicId)
      : undefined;
  const agendadas = (pronto?.licoes ?? [])
    .flatMap((l) => (l.estado.tipo === 'aguardando_revisao' ? [{ ...l, estado: l.estado }] : []))
    .sort((a, b) => a.estado.liberaEm - b.estado.liberaEm);

  // O "+7 hoje" e a semana saem das mesmas respostas, no instante em que a home foi desenhada.
  const doDia = useMemo(() => {
    if (!pronto) return null;
    // O instante da leitura: o mesmo da sequência e da sugestão.
    const { agora } = pronto;
    return {
      xp: xpDeHoje({
        respostas: pronto.respostas,
        questoes: pronto.questoes,
        topicos: pronto.licoes.map((l) => l.topicId),
        formaPre,
        agora,
      }),
      semana: semanaDaSequencia(pronto.respostas, agora),
    };
  }, [pronto, formaPre]);

  // O módulo da lição sugerida e quantas lições dele já estão feitas.
  const doModulo = sugerida?.modulo
    ? pronto?.licoes.filter((l) => l.modulo === sugerida.modulo)
    : undefined;

  function abrirSugerida(licao: LicaoDoAluno) {
    const { topicId } = licao;
    const destino = destinoDaLicao(licao, formaPre !== null);

    // A página da lição entra primeiro na pilha: sair do passo volta para ela, e não para a home.
    router.push({ pathname: '/licoes/[topicId]', params: { topicId } });
    // Sem o termo aceito, quem explica o que falta é a página da lição.
    if (!destino || destino.tipo === 'termo') return;
    // Antes do primeiro diagnóstico vêm as notas por módulo (item 34): a página da lição leva a elas.
    if (destino.passo === 'diagnostico' && precisaDaAutoavaliacao && licao.estado.tipo === 'nova') return;
    if (destino.passo === 'cartao') router.push({ pathname: '/licoes/[topicId]/cartao', params: { topicId } });
    else router.push({ pathname: '/licoes/[topicId]/[passo]', params: { topicId, passo: destino.passo } });
  }

  return (
    <FundoDaMarca style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
          <View style={styles.topo}>
            <View style={styles.saudacao}>
              <ThemedText type="title">Olá, {perfil?.apelido}</ThemedText>
              <ThemedText themeColor="textSecondary">O que vamos estudar hoje?</ThemedText>
            </View>
            {pronto && pronto.xp !== null && doDia && <SeloDeXp xp={pronto.xp} deHoje={doDia.xp} />}
          </View>

          {/* Para hoje: a trilha diária como sugestão, um passo só, sem limite por dia (item 30). */}
          <Superficie tamanho="grande" style={styles.cartao}>
            <View style={styles.topo}>
              <ThemedText type="smallBold" themeColor="primaria" style={styles.ola}>
                {TEXTOS.paraHoje}
              </ThemedText>
              {sugerida && doModulo && sugerida.modulo && (
                <ThemedText type="small" themeColor="textoDeApoio" style={styles.modulo}>
                  {linhaDoModulo(sugerida.modulo, doModulo.filter(licaoFeita).length, doModulo.length)}
                </ThemedText>
              )}
            </View>

            {estado.tipo === 'carregando' && <ActivityIndicator />}

            {estado.tipo === 'erro' && (
              <>
                <ThemedText type="small" themeColor="erro">
                  {TEXTOS.erroAoCarregarLicoes}
                </ThemedText>
                <BotaoPrincipal rotulo={TEXTOS.tentarDeNovo} onPress={recarregar} />
              </>
            )}

            {sugerida && (
              <>
                <ThemedText style={styles.titulo}>{tituloDaSugestao(sugerida.titulo, sugerida.estado)}</ThemedText>
                {/* Pela metade, a barra da etapa já diz onde a pessoa parou: o detalhe só repetiria. */}
                {(sugerida.estado.tipo === 'nova' || sugerida.estado.tipo === 'revisao') && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {detalheDaSugestao(sugerida.estado)}
                  </ThemedText>
                )}
                <EtapasDoParaHoje segmentos={segmentosDoParaHoje(sugerida)} />
                <BotaoPrincipal rotulo={rotuloDoBotaoDaLicao(sugerida.estado)} onPress={() => abrirSugerida(sugerida)} />
              </>
            )}

            {sugestao?.tipo === 'em_dia' && (
              <>
                <ThemedText style={styles.titulo}>{TEXTOS.tudoEmDia}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {proximaRevisao(
                    pronto?.licoes.find((l) => l.topicId === sugestao.topicId)?.titulo ?? '',
                    sugestao.diasRestantes
                  )}
                </ThemedText>
              </>
            )}

            {sugestao?.tipo === 'tudo_concluido' && (
              <ThemedText style={styles.titulo}>{TEXTOS.todasAsLicoesConcluidas}</ThemedText>
            )}
          </Superficie>

          {pronto && doDia && <CartaoDaSequencia sequencia={pronto.sequencia} semana={doDia.semana} />}

          {/* Sem botão: a revisão que vence sobe sozinha para o Para hoje. */}
          {agendadas.map((licao) => (
            <RevisaoSelada
              key={licao.topicId}
              titulo={licao.titulo}
              quandoAbre={quandoARevisaoAbre(licao.estado.liberaEm)}
              diasRestantes={licao.estado.diasRestantes}
            />
          ))}

          <View style={styles.grade}>
            {ATALHOS.map((item) => (
              <SuperficieQueLevaToque
                key={item.id}
                tamanho="pequeno"
                accessibilityRole="button"
                accessibilityLabel={item.titulo}
                onPress={() => router.push(item.rota)}
                style={[styles.atalho, item.soIcone && styles.soIcone]}>
                <Ionicons name={item.icone} size={20} color={theme.primaria} />
                {!item.soIcone && <ThemedText type="smallBold">{item.titulo}</ThemedText>}
              </SuperficieQueLevaToque>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </FundoDaMarca>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  conteudo: {
    flexGrow: 1,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  saudacao: {
    flex: 1,
    gap: Spacing.one,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  // Texto comprido quebra a linha em vez de empurrar o que está ao lado para fora da tela.
  ola: {
    flexShrink: 1,
    flexGrow: 1,
  },
  modulo: {
    flexShrink: 1,
    textAlign: 'right',
  },
  cartao: {
    gap: Spacing.three - 4,
    padding: Spacing.three,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  grade: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  // Lições e Progresso dividem a largura; o Perfil é só o ícone, num botão estreito.
  atalho: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingHorizontal: Spacing.three - 4,
  },
  soIcone: {
    flex: 0,
    width: 52,
    paddingHorizontal: 0,
  },
});
