// A sequência de dias (item 23): quantos dias de calendário seguidos o aluno respondeu.
// Função pura: sem React, sem Firebase, sem estado. Nada aqui é gravado: sai de `answers`, e o
// horário atual entra como parâmetro.

import type { Answer } from '../types/domain';
import { dataEmSaoLuis, diaDeCalendario } from './calendario';

/**
 * Dias seguidos com pelo menos uma resposta confirmada, de qualquer fase. Antes de responder
 * hoje, a sequência que vinha até ontem continua valendo; um dia inteiro sem resposta zera.
 */
export function sequenciaDeDias(respostas: readonly Pick<Answer, 'respondidaEm'>[], agora: number): number {
    const dias = new Set(respostas.map((r) => diaDeCalendario(r.respondidaEm)));
    const hoje = diaDeCalendario(agora);

    let dia = dias.has(hoje) ? hoje : hoje - 1;
    let sequencia = 0;
    while (dias.has(dia)) {
        sequencia += 1;
        dia -= 1;
    }
    return sequencia;
}

export interface DiaDaSemana {
    feito: boolean; // houve resposta, de qualquer fase, nesse dia
    hoje: boolean;
}

/**
 * A semana do card da sequência, de segunda a domingo: a que contém hoje. Mostra o que houve, e não
 * o que falta: os dias sem resposta, passados ou futuros, são só vazios.
 */
export function semanaDaSequencia(respostas: readonly Pick<Answer, 'respondidaEm'>[], agora: number): DiaDaSemana[] {
    const dias = new Set(respostas.map((r) => diaDeCalendario(r.respondidaEm)));
    const hoje = diaDeCalendario(agora);
    // `diaDaSemana` conta o domingo como 0; aqui a segunda é o 0.
    const segunda = hoje - ((dataEmSaoLuis(agora).diaDaSemana + 6) % 7);

    return Array.from({ length: 7 }, (_, i) => ({ feito: dias.has(segunda + i), hoje: segunda + i === hoje }));
}

