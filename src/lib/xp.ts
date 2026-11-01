// XP pela pontuação por certeza de Gardner-Medwin, com o erro adaptado pelo grupo para 4 alternativas (item 14).
// Função pura: sem React, sem Firebase, sem estado. O XP nunca é gravado, é calculado de `answers`.

import type { Answer, Confianca, FormaPre } from '../types/domain';
import { diaDeCalendario, inicioDoDia } from './calendario';
import { licoesDoAluno, respostasAVista, type Licao, type QuestaoDaLicao } from './licao';

// Dúvida compensa a partir de 50% de chance de acerto e certeza a partir de 75%;
// abaixo disso, palpite rende mais e nunca perde ponto.
const XP_ACERTO: Record<Confianca, number> = { 1: 1, 2: 2, 3: 3 };
const XP_ERRO: Record<Confianca, number> = { 1: 0, 2: -1, 3: -4 };

export function xpDaResposta(correta: boolean, confianca: Confianca): number {
    return correta ? XP_ACERTO[confianca] : XP_ERRO[confianca];
}

/** Saldo do conjunto de respostas. Pode ser negativo: o piso do total exibido é decisão da tela (item 24). */
export function somarXp(respostas: readonly Pick<Answer, 'correta' | 'confianca'>[]): number {
    return respostas.reduce((saldo, r) => saldo + xpDaResposta(r.correta, r.confianca), 0);
}

/**
 * O total que a home mostra, ou null enquanto nada conta. Só entram as respostas que já podem
 * aparecer (`respostasAVista`): a prática sempre; o diagnóstico e a verificação quando a
 * verificação termina; a revisão quando a lição é concluída. Com um bloco sem feedback pela
 * metade, o total mudando a cada questão revelaria o acerto (itens 14 e 19). `respostas` vem da
 * mais antiga para a mais recente; cada questão conta uma vez por fase, pela resposta mais
 * recente, como no resultado do bloco. O piso em 0 vale só aqui, no acumulado.
 */
export function xpDasLicoes(
    respostas: readonly Pick<Answer, 'fase' | 'questionId' | 'topicId' | 'correta' | 'confianca'>[],
    licoes: readonly { topicId: string; ciclo: Licao['ciclo']; estado: Pick<Licao['estado'], 'tipo'> }[]
): number | null {
    const ultimaPorQuestao = new Map<string, Pick<Answer, 'correta' | 'confianca'>>();
    for (const r of respostasAVista(respostas, licoes)) ultimaPorQuestao.set(`${r.fase}|${r.questionId}`, r);
    if (ultimaPorQuestao.size === 0) return null;

    return Math.max(0, somarXp([...ultimaPorQuestao.values()]));
}

export interface EntradaDoXpDeHoje {
    respostas: readonly Pick<Answer, 'fase' | 'questionId' | 'topicId' | 'correta' | 'confianca' | 'respondidaEm'>[]; // da mais antiga para a mais recente
    questoes: readonly QuestaoDaLicao[];
    topicos: readonly string[]; // ids, na ordem sugerida do conteúdo
    formaPre: FormaPre | null;
    agora: number; // ms; vem de fora para a função continuar pura
}

/**
 * O "+7 hoje" da home: quanto o total mostrado ganhou desde a meia-noite de hoje (fuso de São Luís).
 * É a diferença entre o total de agora e o total que a home mostrava às 00:00, os dois pela regra de
 * `xpDasLicoes`. Assim a soma dos dias fecha com o total, e o diagnóstico respondido há dias só
 * entra no dia em que a verificação termina, quando passa a poder aparecer. Pode ser negativo.
 */
export function xpDeHoje(entrada: EntradaDoXpDeHoje): number {
    const { respostas, questoes, topicos, formaPre, agora } = entrada;
    const inicioDeHoje = inicioDoDia(diaDeCalendario(agora));

    const totalEm = (instante: number, ate: typeof respostas) => {
        const licoes = licoesDoAluno({ topicos, respostas: ate, questoes, formaPre, agora: instante });
        return xpDasLicoes(ate, licoes) ?? 0;
    };

    return totalEm(agora, respostas) - totalEm(inicioDeHoje, respostas.filter((r) => r.respondidaEm < inicioDeHoje));
}

