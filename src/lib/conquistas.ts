// As medalhas da tela de Conquistas, calculadas das respostas. Funções puras: sem React, sem
// Firebase, sem estado. Nada aqui é gravado: a medalha é ganha quando a conta fecha, e a data é a
// do momento em que a resposta que a fechou passou a poder aparecer.
//
// Duas regras valem para todas: nenhuma medalha depende da certeza declarada nem de ter errado, e
// nenhuma revela acerto no meio de uma fase medida. Por isso a lição só conta quando a verificação
// termina (e a revisão, só quando é concluída), os mesmos cortes de `respostasAVista`.
// A exceção é "3 dias seguidos": conta dias com qualquer resposta, como a sequência da carta, porque
// um dia com resposta não diz nada sobre acerto.

import type { Answer, Fase, FormaPre } from '../types/domain';
import { questoesDoBlocoMedido } from './bloco';
import { diaDeCalendario } from './calendario';
import { DIAS_ATE_A_REVISAO, licaoFeita, type Licao, type QuestaoDaLicao } from './licao';

export type IdDaMedalha =
    | 'primeira_licao'
    | 'tres_dias'
    | 'modulo_inteiro'
    | 'revisao_em_dia'
    | 'ciclo_completo'
    | 'cinco_licoes';

// A ordem da grade na tela.
export const ORDEM_DAS_MEDALHAS: readonly IdDaMedalha[] = [
    'primeira_licao',
    'tres_dias',
    'modulo_inteiro',
    'revisao_em_dia',
    'ciclo_completo',
    'cinco_licoes',
];

const LICOES_PARA_A_MEDALHA = 5;

export interface Conquista {
    id: IdDaMedalha;
    ganhaEm: number | null; // ms; null enquanto a medalha não foi ganha
    progresso: { feito: number; total: number } | null; // só nas medalhas de contagem
}

export interface EntradaDasConquistas {
    licoes: readonly (Pick<Licao, 'topicId' | 'ciclo' | 'estado'> & { modulo: string | null })[];
    respostas: readonly Pick<Answer, 'questionId' | 'fase' | 'respondidaEm'>[]; // todas as do aluno
    questoes: readonly QuestaoDaLicao[];
    formaPre: FormaPre | null;
}

const menor = (valores: readonly number[]): number | null => (valores.length > 0 ? Math.min(...valores) : null);

/**
 * Quando a lição passou a contar como feita: o fim da prática no ciclo curto; no completo, o fim
 * da verificação, sem esperar a revisão. Null enquanto não passou disso.
 */
function feitaEm(licao: EntradaDasConquistas['licoes'][number], entrada: EntradaDasConquistas): number | null {
    if (!licaoFeita(licao)) return null;
    if (licao.estado.tipo === 'concluida' && licao.ciclo === 'curto') return licao.estado.concluidaEm;
    if (entrada.formaPre === null) return null;

    const idsDoPos = new Set(questoesDoBlocoMedido(entrada.questoes, 'pos', [licao.topicId], entrada.formaPre).map((q) => q.id));
    const horarios = entrada.respostas.filter((r) => r.fase === 'pos' && idsDoPos.has(r.questionId)).map((r) => r.respondidaEm);
    return horarios.length > 0 ? Math.max(...horarios) : null;
}

/** O primeiro horário do terceiro de três dias de calendário seguidos com resposta, ou null. */
function tresDiasSeguidosEm(respostas: EntradaDasConquistas['respostas']): number | null {
    const dias = new Set(respostas.map((r) => diaDeCalendario(r.respondidaEm)));
    const terceiros = [...dias].filter((dia) => dias.has(dia - 1) && dias.has(dia - 2));
    if (terceiros.length === 0) return null;

    const primeiro = Math.min(...terceiros);
    return menor(respostas.filter((r) => diaDeCalendario(r.respondidaEm) === primeiro).map((r) => r.respondidaEm));
}

/**
 * O módulo de que mais lições já foram feitas (no empate, o primeiro na ordem das lições) e,
 * entre os módulos prontos, a data do que ficou pronto primeiro. Lição sem módulo não conta.
 */
function modulos(licoes: EntradaDasConquistas['licoes'], feitas: readonly (number | null)[]) {
    const porModulo = new Map<string, (number | null)[]>();
    licoes.forEach((licao, i) => {
        if (licao.modulo !== null) porModulo.set(licao.modulo, [...(porModulo.get(licao.modulo) ?? []), feitas[i]]);
    });

    let maisAdiantado: { feito: number; total: number } | null = null;
    const prontosEm: number[] = [];
    for (const lista of porModulo.values()) {
        const datas = lista.filter((d): d is number => d !== null);
        if (!maisAdiantado || datas.length > maisAdiantado.feito) maisAdiantado = { feito: datas.length, total: lista.length };
        if (datas.length === lista.length) prontosEm.push(Math.max(...datas));
    }
    return { progresso: maisAdiantado, ganhaEm: menor(prontosEm) };
}

/** As seis medalhas, na ordem da tela, com a data de cada uma que já foi ganha. */
export function conquistasDoAluno(entrada: EntradaDasConquistas): Conquista[] {
    const { licoes, respostas } = entrada;
    const feitas = licoes.map((licao) => feitaEm(licao, entrada));
    const datasDasFeitas = feitas.filter((d): d is number => d !== null).sort((a, b) => a - b);

    const concluidas = licoes.flatMap((licao, i) =>
        licao.ciclo === 'completo' && licao.estado.tipo === 'concluida' ? [{ concluidaEm: licao.estado.concluidaEm, feitaEm: feitas[i]! }] : []
    );
    // A revisão abre 7 dias de calendário depois da verificação: em dia é terminar nesse mesmo dia.
    const emDia = concluidas.filter(
        (c) => diaDeCalendario(c.concluidaEm) === diaDeCalendario(c.feitaEm) + DIAS_ATE_A_REVISAO
    );
    const modulo = modulos(licoes, feitas);

    const porId: Record<IdDaMedalha, Omit<Conquista, 'id'>> = {
        primeira_licao: { ganhaEm: datasDasFeitas[0] ?? null, progresso: null },
        tres_dias: { ganhaEm: tresDiasSeguidosEm(respostas), progresso: null },
        modulo_inteiro: modulo,
        revisao_em_dia: { ganhaEm: menor(emDia.map((c) => c.concluidaEm)), progresso: null },
        ciclo_completo: { ganhaEm: menor(concluidas.map((c) => c.concluidaEm)), progresso: null },
        cinco_licoes: {
            ganhaEm: datasDasFeitas[LICOES_PARA_A_MEDALHA - 1] ?? null,
            progresso: { feito: Math.min(datasDasFeitas.length, LICOES_PARA_A_MEDALHA), total: LICOES_PARA_A_MEDALHA },
        },
    };
    return ORDEM_DAS_MEDALHAS.map((id) => ({ id, ...porId[id] }));
}

/** Quantas medalhas já têm data: o "2/6" da carta e o "2 de 6" da tela. */
export function medalhasGanhas(conquistas: readonly Pick<Conquista, 'ganhaEm'>[]): number {
    return conquistas.filter((c) => c.ganhaEm !== null).length;
}

/**
 * As medalhas ganhas durante o passo que acabou de terminar, para o aviso do fim da lição: as que
 * têm data a partir da primeira resposta do passo (`fase` do `topicId`). A medalha de um passo
 * anterior não repete, e o passo sem resposta não tem medalha nova.
 */
export function medalhasNovasDoPasso(
    conquistas: readonly Conquista[],
    respostas: readonly Pick<Answer, 'topicId' | 'fase' | 'respondidaEm'>[],
    topicId: string,
    fase: Fase
): Conquista[] {
    const horarios = respostas.filter((r) => r.topicId === topicId && r.fase === fase).map((r) => r.respondidaEm);
    if (horarios.length === 0) return [];

    const desde = Math.min(...horarios);
    return conquistas.filter((c) => c.ganhaEm !== null && c.ganhaEm >= desde);
}
