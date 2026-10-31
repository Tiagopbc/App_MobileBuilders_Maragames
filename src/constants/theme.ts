/**
 * Cores, fontes e espaçamentos do app. É o único arquivo onde uma cor pode ser escrita:
 * telas e componentes pegam tudo daqui, por `useTheme` (item 28 das decisões).
 */

import '@/global.css';

import { Platform } from 'react-native';

// Identidade da Beast Maragames, a partir do protótipo do grupo: roxo da marca sobre fundos
// claros lilases, e o mesmo roxo clareado no tema escuro. Os dois temas têm os mesmos nomes.
// Todo par de texto e fundo usado nas telas é conferido em __tests__/theme.test.ts.
export const Colors = {
  light: {
    text: '#1A1530',
    textSecondary: '#5E5873',
    background: '#F5F3FA', // fundo lilás claro: os cards brancos se destacam dele
    backgroundElement: '#FFFFFF', // cartões e itens de lista
    backgroundSelected: '#F1EDF8',
    borda: '#E4E0EE',
    bordaSelecionada: '#554495',
    primaria: '#3B2781', // links, ícones e destaques sobre o fundo
    botao: '#3B2781',
    textoDoBotao: '#FFFFFF',
    fundoDaLogo: '#FFFFFF',
    veu: '#000000', // o fundo escurecido atrás de uma lista aberta por cima da tela, com opacidade
    // Estado e quadrante: sucesso = Firme, aviso = Frágil, lacuna = Lacuna, erro = Ponto cego.
    sucesso: '#1E7A4C',
    aviso: '#8A6100',
    lacuna: '#1F3C86',
    erro: '#B91E1E',
    // Cards com relevo e carta de jogo, com a mesma estrutura do escuro: o card branco com borda
    // lilás e o relevo lilás embaixo.
    cartao: '#FFFFFF',
    bordaDoCartao: '#D9D1EB',
    cartaoSelecionado: '#EDE7F8',
    fundoDaLetra: '#F1EDF8',
    textoDaLetra: '#5E5873',
    fundoCerta: '#E3F3EA',
    fundoErrada: '#FBE6E6',
    relevoDoBotao: '#24105A',
    // Botões com degradê, como no escuro: do roxo vivo, em cima, ao roxo da marca, embaixo. O
    // secundário é o card branco com relevo.
    botaoTopo: '#5A3FB2',
    botaoMeio: '#47309C',
    botaoBase: '#3B2781',
    haloDoBotao: '#3B2781',
    secundarioTopo: '#FFFFFF',
    secundarioBase: '#FFFFFF',
    bordaDoSecundario: '#D9D1EB',
    placaDaCarta: '#F1EDF8',
    caixaDaCarta: '#F5F3FA',
    bordaDaCaixa: '#E4E0EE',
    textoDoPe: '#5E5873',
    // Direção estética: nomes novos, que as telas passam a usar aos poucos.
    relevoDoSecundario: '#C2B6DD', // a borda de baixo do botão secundário
    textoDeApoio: '#5E5873', // explicação e nota sob um título; no claro, igual ao textSecondary
    realce: '#E9E3F5', // anel do lobinho, selo da fase e esqueleto de carregamento
    fundoApagado: '#F5F3FA', // alternativa que não é a certa, depois do veredito
    relevoDoCartao: '#C2B6DD', // a borda de baixo do card que leva toque
    fundoFirme: '#E3F3EA',
    fundoFragil: '#FBF0D6',
    fundoPontoCego: '#FBE6E6',
    fundoLacuna: '#E6EBFA',
    botaoDesabilitado: '#E4E0EE', // o texto do botão desativado usa textSecondary
  },
  dark: {
    text: '#F2F1F6',
    textSecondary: '#9AA0AE',
    background: '#0E1015',
    backgroundElement: '#181B22',
    backgroundSelected: '#3B2781',
    borda: '#2C313C',
    bordaSelecionada: '#BEB1D7',
    primaria: '#BEB1D7',
    botao: '#554495',
    textoDoBotao: '#FFFFFF',
    fundoDaLogo: '#FFFFFF', // a logo é roxa: no escuro ela vai sobre um círculo branco
    veu: '#000000',
    // No protótipo escuro estas quatro são fundos com texto branco. Aqui elas são texto, ícone
    // e borda sobre fundo escuro, então entram clareadas: as do protótipo não passam no contraste.
    sucesso: '#3DD68C',
    aviso: '#FFCA16',
    lacuna: '#9EB1FF',
    erro: '#FF6369',
    // Roxo da marca + Tátil: superfícies puxadas para o roxo, com borda roxa e relevo embaixo.
    cartao: '#1A1730',
    bordaDoCartao: '#3B2781',
    cartaoSelecionado: '#2A2152',
    fundoDaLetra: '#3B2781',
    textoDaLetra: '#E4DDF3',
    fundoCerta: '#142522',
    fundoErrada: '#24152A',
    relevoDoBotao: '#24105A',
    // Violeta com halo: do violeta vivo, em cima, ao roxo profundo, embaixo, com uma sombra roxa
    // suave por baixo. É mais violeta que o roxo da marca, para o botão chamar o toque.
    botaoTopo: '#8146E8',
    botaoMeio: '#5B2BD6',
    botaoBase: '#3B1E8C',
    haloDoBotao: '#5B2BD6',
    secundarioTopo: '#2B1D63',
    secundarioBase: '#150D33',
    bordaDoSecundario: '#4C1D95',
    placaDaCarta: '#2A2152',
    caixaDaCarta: '#120F22',
    bordaDaCaixa: '#33285F',
    textoDoPe: '#9D92C4',
    relevoDoSecundario: '#4C1D95', // no escuro, repete a borda do secundário
    textoDeApoio: '#C9C6D6',
    realce: '#2A2152',
    fundoApagado: '#14121F',
    relevoDoCartao: '#3B2781',
    fundoFirme: '#11271E',
    fundoFragil: '#2A2210',
    fundoPontoCego: '#2B1419',
    fundoLacuna: '#171C35',
    // Quase sem roxo, para não parecer o card selecionado (cartaoSelecionado, #2A2152).
    botaoDesabilitado: '#23212F',
  },
} as const;

// O relevo dos cards: a espessura que a borda de baixo ganha a mais (1,5 + 3,5 = 5 no escuro e
// 1,5 + 2,5 = 4 no claro) e quanto o card desce quando fica apertado (selecionado).
export const Relevo = {
  light: { espessura: 2.5, afunda: 2 },
  dark: { espessura: 3.5, afunda: 3 },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Os raios de canto, com nome: o 14 do botão e da alternativa, o 16 do card, o 18 da carta.
export const Raio = {
  letra: 8,
  medio: 12,
  botao: 14,
  card: 16,
  carta: 18,
  folha: 24,
  selo: 999,
} as const;

// Os oito tamanhos de texto, em Lexend: tamanho, altura da linha e peso (uma chave de `Fonts`).
// Nada abaixo de 12, e o 12 só em rótulo curto.
export const Tipo = {
  display: { tamanho: 28, linha: 34, peso: 'bold' },
  titulo: { tamanho: 24, linha: 30, peso: 'bold' },
  destaque: { tamanho: 22, linha: 28, peso: 'bold' },
  enunciado: { tamanho: 20, linha: 28, peso: 'semibold' },
  corpo: { tamanho: 16, linha: 24, peso: 'regular' },
  legenda: { tamanho: 14, linha: 20, peso: 'regular' },
  rotulo: { tamanho: 13, linha: 18, peso: 'semibold' },
  mini: { tamanho: 12, linha: 16, peso: 'semibold' },
} as const;

// Lexend, a fonte do protótipo. Com fonte própria, cada peso é um arquivo e tem o seu nome de
// família; os arquivos são carregados no layout raiz. Quem escreve texto usa `ThemedText`, que
// escolhe a família pelo peso pedido.
export const Fonts = {
  regular: 'Lexend_400Regular',
  medium: 'Lexend_500Medium',
  semibold: 'Lexend_600SemiBold',
  bold: 'Lexend_700Bold',
  // Trechos de código seguem na fonte monoespaçada do aparelho.
  mono: Platform.select({ ios: 'ui-monospace', web: 'var(--font-mono)', default: 'monospace' }),
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
// As telas de formulário (o perfil) usam uma coluna mais estreita: num computador, um campo da
// largura da tela inteira fica difícil de ler e de preencher.
export const LarguraDoFormulario = 480;
