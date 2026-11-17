// Ajudantes dos testes de src/lib: o horário de São Luís e uma questão pronta.

import type { BlocoQuestao, Question } from '../types/domain';

/** Horário de São Luís (UTC−3) em milissegundos. Ex.: em('2026-10-30 20:00'). */
export function em(dataHora: string): number {
    return Date.parse(`${dataHora.replace(' ', 'T')}:00-03:00`);
}

/** Uma questão de múltipla escolha em que a alternativa "a" é a certa. */
export function questao(id: string, topicId: string, bloco: BlocoQuestao, order: number): Question {
    return {
        id,
        lessonId: `licao_${topicId}`,
        topicId,
        order,
        bloco,
        dificuldade: 'basico',
        formato: 'multipla_escolha',
        enunciado: `Enunciado de ${id}`,
        alternativas: [
            { id: 'a', texto: 'A certa', correta: true, explicacao: '' },
            { id: 'b', texto: 'O distrator B', correta: false, explicacao: '' },
            { id: 'c', texto: 'O distrator C', correta: false, explicacao: '' },
            { id: 'd', texto: 'O distrator D', correta: false, explicacao: '' },
        ],
        fonte: null,
        versaoConteudo: 'v1',
    };
}
