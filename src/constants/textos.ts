// Único arquivo de strings da home, da questão, do feedback e dos blocos (item 12).
// O dado guarda só o valor (confiança 1, 2, 3; quadrante 'firme', 'fragil'...). O texto que o
// aluno lê mora aqui, ligado a esse valor, então trocar um rótulo não altera dado nem análise.

import type {
    ComoConheceu,
    Confianca,
    Engine,
    EstudoDeGameDesign,
    Experiencia,
    FaixaEtaria,
    Sexo,
    Fase,
    Interesse,
    Linguagem,
    Objetivo,
    Ocupacao,
    SituacaoDeEstudo,
    TempoPorSemana,
} from '../types/domain';
import type { Conquista, IdDaMedalha } from '../lib/conquistas';
import type { EstadoDaLicao, EtapaDaLicao, SegmentoDoParaHoje, SituacaoDaEtapa } from '../lib/licao';
import type { DiaDaSemana } from '../lib/sequencia';
import type { Falta } from '../lib/pergunta';
import type { Sugestao } from '../lib/sugestao';
import type { Taxa } from '../lib/resultado';
import type { PreferenciaDeTema } from '../lib/tema';
import type { Quadrante } from '../lib/quadrante';
import { ORDEM_DE_REVISAO } from '../lib/resultado';
import { dataEmSaoLuis } from '../lib/calendario';

// Ordem em que os níveis aparecem na tela, do menor para o maior.
export const NIVEIS_DE_CONFIANCA: readonly Confianca[] = [1, 2, 3];

export const ROTULO_CONFIANCA: Record<Confianca, string> = {
    1: 'Palpite',
    2: 'Tenho dúvida',
    3: 'Tenho certeza',
};

export const ROTULO_QUADRANTE: Record<Quadrante, string> = {
    firme: 'Firme',
    fragil: 'Frágil',
    lacuna: 'Lacuna',
    ponto_cego: 'Ponto cego',
};

// Para contar: "1 ponto cego", "2 pontos cegos".
const QUADRANTE_NA_CONTAGEM: Record<Quadrante, { um: string; varios: string }> = {
    firme: { um: 'firme', varios: 'firmes' },
    fragil: { um: 'frágil', varios: 'frágeis' },
    lacuna: { um: 'lacuna', varios: 'lacunas' },
    ponto_cego: { um: 'ponto cego', varios: 'pontos cegos' },
};

export const DESCRICAO_QUADRANTE: Record<Quadrante, string> = {
    firme: 'Você sabe e sabe que sabe.',
    fragil: 'Acertou sem certeza. Vale revisar.',
    lacuna: 'Você já sabia que não sabia. É o que estudar.',
    ponto_cego: 'Errou achando que sabia. Corrija este primeiro.',
};

// Dentro de uma lição, os mesmos blocos têm o nome do que fazem por ela (item 30). A fase
// gravada no dado não muda.
export const TITULO_DA_FASE_NA_LICAO: Record<Exclude<Fase, 'pratica'>, string> = {
    pre: 'Diagnóstico',
    pos: 'Verificação',
    reteste: 'Revisão',
};

export const TITULO_DA_ETAPA: Record<EtapaDaLicao, string> = {
    diagnostico: 'Diagnóstico',
    estudo: 'Cartão e prática',
    verificacao: 'Verificação',
    revisao: 'Revisão',
};

export const SITUACAO_DA_ETAPA: Record<SituacaoDaEtapa, string> = {
    feito: 'feito',
    agora: 'agora',
    espera: 'em espera',
    depois: 'depois',
};

export const TEXTO_DA_FALTA: Record<Falta, string> = {
    alternativa_e_confianca: 'Escolha uma alternativa e diga quanto você confia.',
    alternativa: 'Falta escolher uma alternativa.',
    confianca: 'Falta dizer quanto você confia.',
};

export const TEXTOS = {
    perguntaDeConfianca: 'Quanto você confia?',
    comoFuncionamOsPontos: 'Como funcionam os pontos',
    confirmar: 'Confirmar',
    proxima: 'Próxima',
    concluir: 'Concluir',
    sairDoBloco: 'Sair do bloco',
    semFeedback: 'Sem resultado por questão: tudo aparece no fim do bloco.',
    acertou: 'Você acertou',
    errou: 'Você errou',
    respostaCerta: 'Resposta certa',
    voltarAoInicio: 'Voltar ao início',
    tentarDeNovo: 'Tentar de novo',
    carregando: 'Carregando',
    erroAoCarregar: 'Não foi possível carregar as questões. Confira a conexão e tente de novo.',
    erroAoGravar: 'Não foi possível gravar a resposta. Confira a conexão e confirme de novo.',
    confirmarDeNovo: 'Confirmar de novo',
    semConexao: 'Sem conexão. Suas escolhas continuam marcadas.',
    semConsentimento: 'Este bloco só abre depois do termo de consentimento.',
    blocoSemQuestoes: 'Este bloco não tem questões. O conteúdo foi carregado no banco?',
    progressoDoBloco: 'Progresso no bloco',
    sair: 'Sair',
    paginaNaoExiste: 'Essa página não existe.',
    paginaNaoExisteDetalhe: 'O endereço pode ter mudado ou ter sido digitado errado.',
    comecar: 'Começar',
    sairDoCartao: 'Sair do cartão',
    voltar: 'Voltar',
    proximo: 'Próximo',
    comecarPratica: 'Começar a prática',
    conceito: 'Conceito', // o tipo da carta, no pé da carta de jogo
    abrindoPratica: 'Abrindo a prática',
    erroAoCarregarCartao: 'Não foi possível carregar o cartão. Confira a conexão e tente de novo.',
    resultado: 'Resultado',
    xpDoBloco: 'XP do bloco',
    comoVoceRespondeu: 'Como você respondeu',
    acertoPorTopico: 'Acerto por tópico',
    acertoPorConfianca: 'Acerto por confiança',
    revisarPrimeiro: 'O que revisar primeiro',
    nadaARevisar: 'Nada a revisar: tudo o que você respondeu está firme.',
    semRespostas: 'sem respostas',
    semFeedbackNaLicao: 'Sem resultado por questão: tudo aparece no fim da lição.',
    fecharLicao: 'Fechar a lição',
    conferindoLicao: 'Conferindo a lição',
    licaoNaoExiste: 'Essa lição não existe.',
    erroAoCarregarLicao: 'Não foi possível carregar a lição. Confira a conexão e tente de novo.',
    termoAntesDoDiagnostico: 'Antes do diagnóstico, você lê e aceita o termo de participação.',
    reverCartao: 'Rever o cartão',
    verPratica: 'Ver a prática',
    revisaoDepoisDaVerificacao: '7 dias depois da verificação',
    diagnosticoFeito: 'Diagnóstico feito',
    diagnosticoFeitoDetalhe: 'O resultado aparece no fim da lição, ao lado da verificação.',
    irParaOCartao: 'Ir para o cartão',
    fazerVerificacao: 'Fazer a verificação',
    voltarParaALicao: 'Voltar para a lição',
    licaoConcluida: 'Lição concluída', // só a lição curta, que não tem revisão
    verificacaoFeita: 'Verificação feita',
    revisaoFeita: 'Revisão feita',
    xpDaLicao: 'XP da lição',
    xpDaRevisao: 'XP da revisão',
    antesDiagnostico: 'Antes · diagnóstico',
    depoisVerificacao: 'Depois · verificação',
    naVerificacao: 'Na verificação',
    hoje: 'Hoje', // sem o intervalo: a revisão não fecha, e a distância real fica para a análise
    comoVoceRespondeuNaLicao: 'Como você respondeu nesta lição',
    medalhaNova: 'Medalha nova',
    licoes: 'Lições',
    perfil: 'Perfil',
    progresso: 'Progresso',
    semRespostasAVista: 'Ainda não há respostas para mostrar.',
    cadaRespostaCai: 'Cada resposta cai em um destes quatro lugares, conforme você acerta e quanto confia:',
    poucasRespostas: 'Ainda são poucas respostas.',
    respostasAteALeituraFirme: 'Respostas até a leitura firme',
    quandoOsNumerosAparecem: 'Os números aparecem quando você termina a prática ou a verificação de uma lição.',
    xpTotal: 'XP total',
    sequencia: 'Sequência',
    meuDominio: 'Meu domínio',
    historico: 'Histórico',
    revisarNaPratica: 'O que revisar na prática',
    abrirALicao: 'Abrir a lição',
    progressoDaLicao: 'Domínio da lição',
    emailDaConta: 'E-mail da conta',
    meusDados: 'Meus dados',
    conta: 'Conta',
    estudo: 'Estudo',
    entraPorSenha: 'Você entra por e-mail e senha.',
    redefinirASenha: 'Redefinir a senha',
    linkEnviadoParaAConta: 'Enviamos um link para o e-mail da conta. Confira também o spam.',
    erroAoEnviarOLink: 'Não foi possível enviar o e-mail. Tente de novo.',
    lerOTermo: 'Ler o termo',
    aparencia: 'Aparência',
    salvarAlteracoes: 'Salvar alterações',
    alteracoesSalvas: 'Alterações salvas.',
    termoAindaNaoAceito: 'O termo de participação aparece antes do seu primeiro diagnóstico.',
    paraHoje: 'Para hoje',
    licaoNova: 'Lição nova',
    tudoEmDia: 'Tudo em dia',
    todasAsLicoesConcluidas: 'Você concluiu todas as lições.',
    revisoesAgendadas: 'Revisões agendadas',
    outrasLicoes: 'Outras lições',
    emBreve: 'Em breve',
    erroAoCarregarLicoes: 'Não foi possível carregar as lições. Confira a conexão e tente de novo.',
} as const;

/** "Game Engines · Em breve": o título de um módulo que ainda não tem questões. */
export function moduloEmBreve(modulo: string): string {
    return `${modulo} · Em breve`;
}

/** O botão do Progresso vazio: leva à primeira lição. */
export function comecarLicao(titulo: string): string {
    return `Começar ${titulo}`;
}

/** O aviso de poucas respostas: de onde a leitura passa a ser firme. */
export function leituraMaisFirme(minima: number): string {
    return `Os números mudam rápido; a leitura fica mais firme a partir de ${minima}.`;
}

/** Quantas respostas já há, até a amostra mínima. */
export function respostasDeMinimas(total: number, minima: number): string {
    return `${total} de ${minima} respostas`;
}

/** A frase de abertura do Progresso, em pedaços: os números ganham a cor do quadrante. */
export function partesDoResumo(total: number, firmes: number, pontosCegos: number): { texto: string; cor?: 'sucesso' | 'erro' }[] {
    const partes: { texto: string; cor?: 'sucesso' | 'erro' }[] = [
        { texto: `De ${total} ${total === 1 ? 'resposta' : 'respostas'}, ` },
    ];
    if (firmes === 0) partes.push({ texto: 'nenhuma', cor: 'sucesso' }, { texto: ' está firme.' });
    else if (firmes === 1) partes.push({ texto: '1', cor: 'sucesso' }, { texto: ' está firme.' });
    else partes.push({ texto: String(firmes), cor: 'sucesso' }, { texto: ' estão firmes.' });
    if (pontosCegos > 0) {
        partes.push({ texto: ' Em ' }, { texto: String(pontosCegos), cor: 'erro' }, { texto: ', você achou que sabia.' });
    }
    return partes;
}

export function resumoDoProgresso(total: number, firmes: number, pontosCegos: number): string {
    return partesDoResumo(total, firmes, pontosCegos).map((p) => p.texto).join('');
}

/** O que o leitor de tela diz de uma lição de módulo em breve. */
export function licaoEmBreve(titulo: string): string {
    return `${titulo}, em breve`;
}

/** "8 de 12". */
export function formatarTaxa(acertos: number, total: number): string {
    return total === 0 ? TEXTOS.semRespostas : `${acertos} de ${total}`;
}

/** "Acertou 8 de 12". */
export function formatarAcertos(acertos: number, total: number): string {
    return `Acertou ${acertos} de ${total}`;
}

/** "2 pontos cegos · 1 lacuna": o que há para revisar, do mais urgente ao menos. Firme não entra. */
export function resumirQuadrantes(quadrantes: Record<Quadrante, number>): string {
    return ORDEM_DE_REVISAO.filter((q) => quadrantes[q] > 0)
        .map((q) => {
            const n = quadrantes[q];
            return `${n} ${n === 1 ? QUADRANTE_NA_CONTAGEM[q].um : QUADRANTE_NA_CONTAGEM[q].varios}`;
        })
        .join(' · ');
}

/** "2 de 6": a posição do slide dentro do cartão. */
export function posicaoNoCartao(indice: number, total: number): string {
    return `${indice + 1} de ${total}`;
}

/** O número da carta no pé da carta de jogo, como numa carta colecionável: "4/5". */
export function numeroDaCarta(indice: number, total: number): string {
    return `${indice + 1}/${total}`;
}

/** O pé da carta lido em voz alta: "Conceito, 4 de 5". */
export function peDaCartaParaLeitor(indice: number, total: number): string {
    return `${TEXTOS.conceito}, ${posicaoNoCartao(indice, total)}`;
}

/** "dia seguido" ou "dias seguidos", sob o número grande da tela da sequência. */
export function diasSeguidos(dias: number): string {
    return dias === 1 ? 'dia seguido' : 'dias seguidos';
}

/** "3 questões", "1 questão". */
export function contarQuestoes(n: number): string {
    return `${n} ${n === 1 ? 'questão' : 'questões'}`;
}

/** O que o botão principal da lição diz em cada estado. */
export function rotuloDoBotaoDaLicao(estado: EstadoDaLicao): string {
    switch (estado.tipo) {
        case 'diagnostico':
            return 'Continuar o diagnóstico';
        case 'estudo':
            return estado.respondidas === 0 ? 'Abrir o cartão' : 'Continuar a prática';
        case 'verificacao':
            return estado.respondidas === 0 ? TEXTOS.fazerVerificacao : 'Continuar a verificação';
        case 'revisao':
            return estado.respondidas === 0 ? 'Fazer a revisão' : 'Continuar a revisão';
        default:
            return TEXTOS.comecar;
    }
}

/** A situação de uma lição, para a lista: "Nova", "Em andamento", "Revisão em 5 dias"... */
export function situacaoDaLicao(estado: EstadoDaLicao): string {
    switch (estado.tipo) {
        case 'nova':
            return 'Nova';
        case 'aguardando_revisao':
            return estado.diasRestantes === 1 ? 'Revisão amanhã' : `Revisão em ${estado.diasRestantes} dias`;
        case 'revisao':
            return 'Revisão disponível';
        case 'concluida':
            return 'Concluída';
        default:
            return 'Em andamento';
    }
}

/** "em 5 dias", "amanhã": quanto falta para uma revisão abrir. */
export function emQuantosDias(diasRestantes: number): string {
    return diasRestantes === 1 ? 'amanhã' : `em ${diasRestantes} dias`;
}

/** "Próxima revisão: Framework MDA, em 5 dias.": o Para hoje de quem está em dia. */
export function proximaRevisao(titulo: string, diasRestantes: number): string {
    return `Próxima revisão: ${titulo}, ${emQuantosDias(diasRestantes)}.`;
}

/** O título do Para hoje: a revisão leva o nome do que é; nos outros casos, o da lição. */
export function tituloDaSugestao(titulo: string, estado: EstadoDaLicao): string {
    return estado.tipo === 'revisao' ? `Revisão de ${titulo}` : titulo;
}

/** A linha sob o título do Para hoje: "Lição nova", "Cartão e prática · 1 de 2", "3 questões". */
export function detalheDaSugestao(estado: EstadoDaLicao): string {
    switch (estado.tipo) {
        case 'diagnostico':
        case 'estudo':
        case 'verificacao': {
            const etapa = TITULO_DA_ETAPA[estado.tipo];
            return estado.respondidas === 0 ? etapa : `${etapa} · ${formatarTaxa(estado.respondidas, estado.total)}`;
        }
        case 'revisao':
            return estado.respondidas === 0 ? contarQuestoes(estado.total) : formatarTaxa(estado.respondidas, estado.total);
        default:
            return TEXTOS.licaoNova;
    }
}

/** "3 de 9 feitas": o resumo do atalho Lições. Feita é a lição que já passou da verificação. */
export function licoesFeitas(feitas: number, total: number): string {
    return `${feitas} de ${total} ${feitas === 1 ? 'feita' : 'feitas'}`;
}

// As três opções de tema do Perfil. O valor guardado no aparelho é a chave, e não o rótulo.
export const ROTULO_DO_TEMA: Record<PreferenciaDeTema, string> = {
    sistema: 'Do sistema',
    claro: 'Claro',
    escuro: 'Escuro',
};

// O nome de cada fase quando ela aparece como passo feito, no histórico do tópico.
export const TITULO_DO_PASSO_FEITO: Record<Fase, string> = {
    pre: 'Diagnóstico',
    pratica: 'Prática',
    pos: 'Verificação',
    reteste: 'Revisão',
};

/** "Diagnóstico · 08/10": um passo do histórico, com o dia em que terminou (fuso de São Luís). */
export function passoFeitoEm(fase: Fase, em: number): string {
    return `${TITULO_DO_PASSO_FEITO[fase]} · ${diaEMes(dataEmSaoLuis(em))}`;
}

/** "3 dias", "1 dia": a sequência, quando o rótulo ao lado já diz o que é. */
export function contarDias(dias: number): string {
    return `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

/** "domínio 5 de 7": o acerto simples no tópico, em contagem (item 14). */
export function dominioEmContagem(dominio: Taxa): string {
    return `domínio ${formatarTaxa(dominio.acertos, dominio.total)}`;
}

/** "Abre amanhã", "Abre em 5 dias": a revisão em espera, na linha da etapa. */
export function contagemDaRevisao(diasRestantes: number): string {
    return diasRestantes === 1 ? 'Abre amanhã' : `Abre em ${diasRestantes} dias`;
}

/**
 * O detalhe de uma linha da página da lição: o tamanho da etapa ou, na etapa em andamento, onde
 * a pessoa parou. A revisão que ainda não abriu diz quando abre.
 */
export function detalheDaEtapa(etapa: EtapaDaLicao, total: number, estado: EstadoDaLicao): string {
    if (etapa === 'revisao') {
        if (estado.tipo === 'aguardando_revisao') return contagemDaRevisao(estado.diasRestantes);
        if (estado.tipo !== 'revisao' && estado.tipo !== 'concluida') return TEXTOS.revisaoDepoisDaVerificacao;
    }
    const daVez = { diagnostico: 'diagnostico', estudo: 'estudo', verificacao: 'verificacao', revisao: 'revisao' } as const;
    if (estado.tipo === daVez[etapa] && estado.respondidas > 0) return formatarTaxa(estado.respondidas, estado.total);
    return contarQuestoes(total);
}

/** "Antes 1 de 3 → Depois 3 de 3": o diagnóstico ao lado da verificação. */
export function antesEDepois(antes: Taxa, depois: Taxa): string {
    return `Antes ${formatarTaxa(antes.acertos, antes.total)} → Depois ${formatarTaxa(depois.acertos, depois.total)}`;
}

/** "Na verificação 3 de 3 → Hoje 2 de 3": o que ficou, 7 dias depois. */
export function verificacaoEHoje(depois: Taxa, revisao: Taxa): string {
    return `Na verificação ${formatarTaxa(depois.acertos, depois.total)} → Hoje ${formatarTaxa(revisao.acertos, revisao.total)}`;
}

/** "Você acertou 5 de 6 questões de UX/UI em jogos · +13 XP": o fim de um tópico da trilha. */
export function acertosDoTopico(acertos: number, total: number, topico: string, xp: number): string {
    return `Você acertou ${acertos} de ${total} questões de ${topico} · ${formatarXp(xp)}`;
}

const DIAS_DA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const doisDigitos = (n: number) => String(n).padStart(2, '0');
const diaEMes = (d: { dia: number; mes: number }) => `${doisDigitos(d.dia)}/${doisDigitos(d.mes)}`;
// Sábado e domingo são masculinos; os outros dias, femininos (a segunda, a terça...).
const noOuNa = (diaDaSemana: number) => (diaDaSemana === 0 || diaDaSemana === 6 ? 'no' : 'na');

/** "Termo de participação aceito em 06/10/2026." Data no fuso de São Luís. */
export function termoAceitoEm(consentiuEm: number): string {
    const dia = dataEmSaoLuis(consentiuEm);
    return `Termo de participação aceito em ${diaEMes(dia)}/${dia.ano}.`;
}

/** "A revisão abre na sexta, 16/10." Data no fuso de São Luís. */
export function quandoARevisaoAbre(liberaEm: number): string {
    const abre = dataEmSaoLuis(liberaEm);
    return `A revisão abre ${noOuNa(abre.diaDaSemana)} ${DIAS_DA_SEMANA[abre.diaDaSemana]}, ${diaEMes(abre)}.`;
}

/** "A revisão abre na sexta, 06/11. São 3 questões para ver o quanto ficou.": o aviso do fim da verificação. */
export function quandoARevisaoAbreComQuestoes(liberaEm: number, questoes: number): string {
    const quantas = questoes === 1 ? 'É 1 questão' : `São ${questoes} questões`;
    return `${quandoARevisaoAbre(liberaEm)} ${quantas} para ver o quanto ficou.`;
}

/**
 * A linha sob o antes e o depois do fim da verificação. Só diz o que mudou no resultado: o app
 * não mede o que causou a mudança, então nenhuma frase atribui o ganho ao estudo. Só a melhora
 * ganha a cor de sucesso; igual ou menor fica em tom neutro, sem cara de derrota.
 */
export function variacaoDoFim(antes: Taxa, depois: Taxa): { texto: string; melhorou: boolean } {
    const diferenca = depois.acertos - antes.acertos;
    if (diferenca > 0) return { texto: `Você acertou ${diferenca} a mais na verificação`, melhorou: true };
    if (diferenca < 0) return { texto: `Você acertou ${-diferenca} a menos que no diagnóstico`, melhorou: false };
    return { texto: 'Mesmo resultado do diagnóstico', melhorou: false };
}

/** A linha do fim da revisão: o que a pessoa lembrou, sem comparar com a verificação. */
export function variacaoDaRevisao(revisao: Taxa): string {
    return `Você lembrou ${formatarTaxa(revisao.acertos, revisao.total)}. A revisão mostra o que ficou.`;
}

/** O botão principal do fim da lição: a próxima lição que o app sugere. Null quando não há o que abrir já. */
export function botaoDaSugestao(sugestao: Sugestao, titulo: string | null): string | null {
    if (titulo === null) return null;
    switch (sugestao.tipo) {
        case 'nova':
            return comecarLicao(titulo);
        case 'continuar':
            return `Continuar ${titulo}`;
        case 'revisao':
            return `Fazer a revisão de ${titulo}`;
        default:
            return null;
    }
}

/** "+3", "−4", "0": os pontos de um nível de certeza na tabela das regras, sem a unidade. */
export function formatarPontos(pontos: number): string {
    if (pontos > 0) return `+${pontos}`;
    if (pontos < 0) return `−${Math.abs(pontos)}`;
    return '0';
}

/** "+3 XP", "−4 XP", "0 XP". O sinal de menos é o tipográfico (U+2212), que alinha com o de mais. */
export function formatarXp(xp: number): string {
    if (xp > 0) return `+${xp} XP`;
    if (xp < 0) return `−${Math.abs(xp)} XP`;
    return '0 XP';
}

/** "XP: +18", para o selo da home. O total tem piso em 0 (item 14), então nunca sai negativo. */
export function formatarXpTotal(xp: number): string {
    return xp > 0 ? `XP: +${xp}` : 'XP: 0';
}

// Tela de login: a chamada da marca e os campos (item 28).
export const TEXTOS_DO_LOGIN = {
    logo: 'Logo da Beast Maragames',
    marca: 'Beast Maragames',
    chamada: 'Hora de soltar a fera?',
    convite: 'Entre para começar o desafio de hoje.',
    email: 'E-mail',
    exemploDeEmail: 'voce@exemplo.com',
    senha: 'Senha',
    dicaDaSenha: 'Mínimo 8 caracteres',
    repetirSenha: 'Repetir senha',
    mostrarASenha: 'Mostrar a senha',
    ocultarASenha: 'Ocultar a senha',
    mostrarASenhaRepetida: 'Mostrar a senha repetida',
    ocultarASenhaRepetida: 'Ocultar a senha repetida',
    esqueciASenha: 'Esqueci a senha',
    informeOEmailParaRedefinir: 'Digite o seu e-mail acima para receber o link de redefinição.',
    // Não diz se a conta existe: quem digita o e-mail de outra pessoa não descobre nada.
    linkDeRedefinicaoEnviado:
        'Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha. Confira também o spam.',
    erroAoEnviarOLink: 'Não foi possível enviar o e-mail. Tente de novo.',
    entrar: 'Entrar',
    semConta: 'Ainda não tem conta?',
    criarConta: 'Criar agora',
    erroAoEntrar: 'Não foi possível entrar. Tente de novo.',
} as const;

// --- Perfil (item 34): o núcleo obrigatório, as perguntas opcionais e a autoavaliação. ---
// No dado vão os valores (`18_24`, `graduacao`); os rótulos abaixo ficam só na tela.

export const ROTULO_DA_FAIXA_ETARIA: Record<FaixaEtaria, string> = {
    '18_24': '18 a 24',
    '25_34': '25 a 34',
    '35_44': '35 a 44',
    '45_mais': '45 ou mais',
};

export const ROTULO_DO_SEXO: Record<Sexo, string> = {
    feminino: 'Feminino',
    masculino: 'Masculino',
    nao_informado: 'Prefiro não informar',
};

export const ROTULO_DA_SITUACAO_DE_ESTUDO: Record<SituacaoDeEstudo, string> = {
    ensino_medio: 'Ensino médio',
    graduacao: 'Graduação',
    pos: 'Pós-graduação',
    formado: 'Já me formei',
    nao_estudo: 'Não estudo',
};

export const ROTULO_DA_EXPERIENCIA: Record<Experiencia, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
};

// O que cada nível quer dizer: é experiência em criar jogos, e não em jogar.
export const DESCRICAO_DA_EXPERIENCIA: Record<Experiencia, string> = {
    iniciante: 'Nunca criei um jogo.',
    intermediario: 'Já fiz protótipo ou participei de game jam.',
    avancado: 'Já publiquei um jogo.',
};

export const ROTULO_DA_OCUPACAO: Record<Ocupacao, string> = {
    estudo: 'Só estudo',
    tecnologia: 'Trabalho com tecnologia',
    outra_area: 'Trabalho em outra área',
};

export const ROTULO_DA_ENGINE: Record<Engine, string> = {
    nenhuma: 'Nenhuma',
    godot: 'Godot',
    unity: 'Unity',
    unreal: 'Unreal',
    gamemaker: 'GameMaker',
    outra: 'Outra',
};

export const ROTULO_DA_LINGUAGEM: Record<Linguagem, string> = {
    nenhuma: 'Nenhuma',
    python: 'Python',
    csharp: 'C#',
    javascript: 'JavaScript',
    gdscript: 'GDScript',
    cpp: 'C++',
    outra: 'Outra',
};

export const ROTULO_DO_ESTUDO_DE_GAME_DESIGN: Record<EstudoDeGameDesign, string> = {
    nunca: 'Nunca estudei',
    sozinho: 'Por conta própria',
    curso: 'Em curso',
    faculdade: 'Na faculdade',
};

export const ROTULO_DO_INTERESSE: Record<Interesse, string> = {
    programacao: 'Programação',
    arte: 'Arte',
    game_design: 'Game design',
    audio: 'Áudio',
    publicacao: 'Publicação',
};

export const ROTULO_DO_OBJETIVO: Record<Objetivo, string> = {
    hobby: 'Hobby',
    carreira: 'Carreira',
    publicar: 'Publicar um jogo',
    faculdade: 'Complementar a faculdade',
};

export const ROTULO_DO_TEMPO_POR_SEMANA: Record<TempoPorSemana, string> = {
    ate_1h: 'Até 1 hora',
    '1_a_3h': '1 a 3 horas',
    mais_de_3h: 'Mais de 3 horas',
};

export const ROTULO_DE_COMO_CONHECEU: Record<ComoConheceu, string> = {
    instagram: 'Instagram',
    amigo: 'Indicação de amigo',
    faculdade: 'Faculdade',
    evento: 'Evento',
    outro: 'Outro',
};

export const TEXTOS_DO_PERFIL = {
    seuPerfil: 'Seu perfil',
    sobreVoce: 'Sobre você',
    estudoEJogos: 'Estudo e jogos',
    nome: 'Nome completo',
    apelido: 'Apelido',
    dicaDoApelido: 'como você aparece no app',
    telefone: 'Telefone',
    faixaEtaria: 'Faixa etária',
    sexo: 'Sexo',
    cidade: 'Cidade',
    uf: 'Estado (UF)',
    escolhaOEstado: 'Escolha',
    fecharALista: 'Fechar a lista',
    situacaoDeEstudo: 'Situação de estudo',
    experiencia: 'Experiência em criar jogos',
    aceitaContato: 'Aceito receber mensagens da Beast Maragames',
    escolhaAFaixaEtaria: 'Escolha a faixa etária.',
    escolhaOSexo: 'Escolha uma das opções de sexo.',
    escolhaASituacao: 'Escolha a situação de estudo.',
    salvarEComecar: 'Salvar e começar',
    servidorRecusou: 'O servidor recusou o perfil. As regras do Firestore foram publicadas?',
    erroAoSalvar: 'Não foi possível salvar. Tente de novo.',
    // "Sobre você e os jogos": as perguntas opcionais.
    sobreVoceEOsJogos: 'Sobre você e os jogos',
    sobreAsOpcionais: 'São opcionais. Ajudam a Beast Maragames a preparar conteúdo para você.',
    responder: 'Responder',
    salvarRespostas: 'Salvar respostas',
    respostasSalvas: 'Respostas salvas.',
    variasOpcoes: 'Pode marcar mais de uma.',
    ocupacao: 'O que você faz hoje?',
    engines: 'Que engines você já usou?',
    linguagens: 'Que linguagens de programação você conhece?',
    estudoDeGameDesign: 'Você já estudou game design?',
    interesses: 'Que áreas de criar jogos mais te interessam?',
    objetivo: 'Qual é o seu objetivo com jogos?',
    tempoPorSemana: 'Quanto tempo por semana você tem para estudar?',
    comoConheceu: 'Como você conheceu a Beast Maragames?',
    alunoDoSite: 'Você já estuda pelo site da Beast Maragames?',
    sim: 'Sim',
    nao: 'Não',
    // A autoavaliação por módulo, antes do primeiro diagnóstico.
    autoavaliacao: 'Antes de começar',
    perguntaDaAutoavaliacao: 'Quanto você acha que já sabe de cada área?',
    sobreAAutoavaliacao: 'De 1 (nada) a 5 (muito). É um palpite seu: não vale ponto e você responde uma vez só.',
    continuar: 'Continuar',
    faltaAvaliar: 'Dê uma nota para cada área para continuar.',
    erroAoGravarAAutoavaliacao: 'Não foi possível gravar as suas notas. Confira a conexão e tente de novo.',
    fecharAAutoavaliacao: 'Fechar',
    erroAoCarregarAsAreas: 'Não foi possível carregar as áreas. Confira a conexão e tente de novo.',
} as const;

/** "3 de 9 respondidas" */
export function extrasRespondidosDe(respondidas: number, total: number): string {
    return `${respondidas} de ${total} respondidas`;
}

/** O que o leitor de tela diz de cada nota: "Arte & Pixel Art: nota 3 de 5". */
export function notaDoModulo(modulo: string, nota: number): string {
    return `${modulo}: nota ${nota} de 5`;
}

// --- Perfil: o cabeçalho e a seção Sobre. ---

// Para onde escrever com dúvida ou para sair do estudo. Escolhido em 12/10/2026; é o
// único contato de pessoa que fica no código, por decisão do grupo.
export const CONTATO_DO_GRUPO = 'pereirabc1981@gmail.com';

// Quem fez o app: o nome do autor, que assina a boas-vindas e a seção Sobre no lugar da marca da cliente.
export const AUTOR = 'Tiago Cavalcanti';

export const TEXTOS_DO_SOBRE = {
    titulo: 'Sobre',
    contato: `Dúvidas ou para sair do estudo, escreva para ${CONTATO_DO_GRUPO}.`,
} as const;

/** "Tiago Cavalcanti · versão 1.0.0" */
export function versaoDoAppNoPerfil(versao: string): string {
    return `${AUTOR} · versão ${versao}`;
}

/**
 * A linha de resumo do cabeçalho do Perfil: "Paulo · XP: +47 · 9 de 9 feitas". São os números
 * da home. Sem lições lidas, fica só o apelido; sem XP à vista (item 14), o XP não aparece.
 */
export function resumoDoPerfil(apelido: string, resumo: { xp: number | null; feitas: number; total: number } | null): string {
    if (!resumo) return apelido;
    const partes = [apelido];
    if (resumo.xp !== null) partes.push(formatarXpTotal(resumo.xp));
    partes.push(licoesFeitas(resumo.feitas, resumo.total));
    return partes.join(' · ');
}


// --- Tela de boas-vindas, Configuração e Regras do jogo. ---

export const TEXTOS_DE_BOAS_VINDAS = {
    nome: 'Maragames App',
    assinatura: `por ${AUTOR}`,
    titulo: 'Solte a fera do game design',
    mascote: 'O lobinho da Beast Maragames segurando um controle',
    jogar: 'Jogar',
    // O nome é um só: o botão ? do topo, o convite e a tela das regras.
    regras: 'Como jogar',
    convite: 'Primeira vez por aqui?',
    conviteApoio: 'Veja como o jogo funciona',
    pessoaJogadora: 'Pessoa jogadora', // o tipo da carta de jogador, na placa
} as const;

/** O XP em número grande, na carta de jogador: "+18"; sem XP, "0". */
export function xpNaCarta(xp: number): string {
    return xp > 0 ? `+${xp}` : '0';
}

// --- Conquistas: as medalhas, que a carta de jogador abre. ---
// Nenhuma frase fala em certeza, acerto ou comparação: a medalha mostra o que a pessoa fez.

export const TEXTOS_DAS_CONQUISTAS = {
    titulo: 'Conquistas',
    apoio: 'Medalhas só suas. Elas mostram o que você fez, sem comparar com ninguém.',
    medalhas: 'medalhas', // a legenda do 3º número da carta
} as const;

export const MEDALHAS_DO_APP: Record<IdDaMedalha, { nome: string; descricao: string }> = {
    primeira_licao: { nome: 'Primeira lição', descricao: 'Terminar a primeira lição, até a verificação.' },
    tres_dias: { nome: '3 dias seguidos', descricao: 'Responder em 3 dias seguidos.' },
    modulo_inteiro: { nome: 'Um módulo inteiro', descricao: 'Terminar todas as lições de um módulo.' },
    revisao_em_dia: { nome: 'Revisão em dia', descricao: 'Fazer a revisão no dia em que ela abre.' },
    ciclo_completo: { nome: 'Ciclo completo', descricao: 'Terminar uma lição com a revisão feita.' },
    cinco_licoes: { nome: '5 lições', descricao: 'Terminar 5 lições.' },
};

/** "2 de 6": quantas medalhas já foram ganhas, no alto da tela. */
export function contagemDeMedalhas(ganhas: number, total: number): string {
    return `${ganhas} de ${total}`;
}

/** "Ganhou em 12/11" (fuso de São Luís), ou "Bloqueada · 1 de 5" quando a medalha conta lições. */
export function estadoDaMedalha(conquista: Pick<Conquista, 'ganhaEm' | 'progresso'>): string {
    if (conquista.ganhaEm !== null) return `Ganhou em ${diaEMes(dataEmSaoLuis(conquista.ganhaEm))}`;
    return conquista.progresso ? `Bloqueada · ${conquista.progresso.feito} de ${conquista.progresso.total}` : 'Bloqueada';
}

// --- Home: o selo de XP, o Para hoje com as etapas, a sequência da semana e as revisões seladas. ---

/** "Fundamentos · 2 de 5 feitas": o módulo da lição do Para hoje e quantas lições dele estão feitas. */
export function linhaDoModulo(modulo: string, feitas: number, total: number): string {
    return `${modulo} · ${licoesFeitas(feitas, total)}`;
}

/** "Cartão e prática 1/4": a etapa de uma barra do Para hoje, com o progresso quando já há resposta. */
export function rotuloDaEtapaDoParaHoje(segmento: Pick<SegmentoDoParaHoje, 'etapa' | 'progresso'>): string {
    const etapa = TITULO_DA_ETAPA[segmento.etapa];
    return segmento.progresso ? `${etapa} ${segmento.progresso.respondidas}/${segmento.progresso.total}` : etapa;
}

/** "+7 hoje", sob o total do selo de XP; null quando o dia não mexeu no total. */
export function xpDeHojeNoSelo(xpDeHoje: number): string | null {
    return xpDeHoje === 0 ? null : `${formatarPontos(xpDeHoje)} hoje`;
}

/** "XP: +18, +7 hoje": o que o leitor de tela ouve no selo, que é um número e uma frase pequena. */
export function rotuloDoSeloDeXp(xp: number, xpDeHoje: number): string {
    const doDia = xpDeHojeNoSelo(xpDeHoje);
    return doDia ? `${formatarXpTotal(xp)}, ${doDia}` : formatarXpTotal(xp);
}

/** "3 dias seguidos", "1 dia seguido": o título do card da sequência. */
export function tituloDaSequencia(dias: number): string {
    return `${dias} ${diasSeguidos(dias)}`;
}

export const TEXTOS_DA_SEQUENCIA = {
    responda: 'responda 1 questão hoje', // o próximo passo do dia, sem cobrar
} as const;

// A semana do card da sequência começa na segunda.
export const LETRAS_DA_SEMANA = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const;
const NOMES_DA_SEMANA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'] as const;

/** "sexta, hoje, sem resposta": o que o leitor de tela ouve em cada dia da semana. */
export function rotuloDoDiaDaSemana(indice: number, dia: DiaDaSemana): string {
    const resposta = dia.feito ? 'com resposta' : 'sem resposta';
    return dia.hoje ? `${NOMES_DA_SEMANA[indice]}, hoje, ${resposta}` : `${NOMES_DA_SEMANA[indice]}, ${resposta}`;
}

/** "5 d": quanto falta para a revisão selada abrir, em poucos caracteres. */
export function diasAbreviados(dias: number): string {
    return `${dias} d`;
}

// As legendas da matriz 2×2: a das Regras do jogo e a do Progresso são a mesma.
export const LEGENDAS_DA_MATRIZ = {
    comCerteza: 'Com certeza',
    semCerteza: 'Sem certeza',
    acertou: 'Acertou',
    errou: 'Errou',
} as const;

// As regras só explicam o que o app já faz: os nomes da certeza e dos quadrantes saem das mesmas
// listas que as telas de resposta e de resultado usam, e os pontos de cada nível saem da conta do
// XP (`src/lib/xp.ts`), na tela das regras.
export const TEXTOS_DAS_REGRAS = {
    jogo: {
        titulo: 'O jogo',
        texto: 'Você aprende game design em lições curtas, como quem joga. Em cada questão, escolhe uma resposta e diz o quanto confia nela.',
        apoio: 'Acertar rende pontos. Saber o que você sabe, e o que ainda não sabe, rende ainda mais.',
    },
    certeza: {
        titulo: 'A certeza',
        texto: 'Marque o nível que combina com o que você sente de verdade. Não existe nível errado.',
    },
    pontos: {
        titulo: 'Os pontos',
        acertar: 'Acertar',
        errar: 'Errar',
        apoio: 'O palpite nunca tira ponto. Errar com certeza custa mais, por isso a certeza compensa quando você realmente sabe.',
    },
    resultado: {
        titulo: 'O resultado',
        texto: 'No fim de cada bloco, cada resposta cai em um destes quadrantes:',
        ...LEGENDAS_DA_MATRIZ,
    },
    licao: {
        titulo: 'A lição',
        etapas: 'Cinco etapas: Diagnóstico, Cartão de conceito, Prática, Verificação e Revisão, que abre 7 dias depois.',
        medido: 'Só na Prática você vê o resultado a cada questão. No Diagnóstico e na Verificação tudo aparece no fim, para medir o que você sabe de verdade.',
    },
    sequencia: {
        titulo: 'A sequência',
        texto: 'Conta os dias seguidos em que você respondeu pelo menos uma questão.',
    },
} as const;
