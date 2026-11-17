// Domínio por tópico: taxa de acerto simples, sem peso de confiança (item 14).
// Função pura: sem React, sem Firebase, sem estado. Nada aqui é gravado, tudo sai de `answers`.

import type { Answer } from '../types/domain';

export interface Dominio {
    acertos: number;
    total: number; // questões distintas já respondidas no tópico
    taxa: number; // acertos / total, de 0 a 1
}

type RespostaDoDominio = Pick<Answer, 'topicId' | 'questionId' | 'correta' | 'respondidaEm'>;

/**
 * Cada questão conta uma vez, pela resposta mais recente em qualquer fase: é a leitura
 * "o que o aluno sabe agora", e a questão repetida no reteste não entra duas vezes.
 * Tópico sem resposta não aparece no resultado.
 */
export function dominioPorTopico(respostas: readonly RespostaDoDominio[]): Record<string, Dominio> {
    const dominio: Record<string, Dominio> = {};
    for (const r of maisRecentePor(respostas, (x) => x.questionId)) {
        const d = (dominio[r.topicId] ??= { acertos: 0, total: 0, taxa: 0 });
        d.total += 1;
        if (r.correta) d.acertos += 1;
        d.taxa = d.acertos / d.total;
    }
    return dominio;
}

/**
 * A resposta mais recente de cada chave, pelo horário; no empate, vale a que vem depois na lista.
 * A chave diz o que conta como a mesma resposta: a questão, ou a questão dentro de uma fase.
 */
export function maisRecentePor<R extends Pick<Answer, 'respondidaEm'>>(respostas: readonly R[], chave: (r: R) => string): R[] {
    const ultimas = new Map<string, R>();
    for (const r of respostas) {
        const atual = ultimas.get(chave(r));
        if (!atual || r.respondidaEm >= atual.respondidaEm) ultimas.set(chave(r), r);
    }
    return [...ultimas.values()];
}
