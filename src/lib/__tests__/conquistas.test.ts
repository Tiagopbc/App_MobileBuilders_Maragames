import type { BlocoQuestao, Fase } from '../../types/domain';
import { licoesDoAluno, type QuestaoDaLicao, type RespostaDaLicao } from '../licao';
import { conquistasDoAluno, medalhasGanhas, ORDEM_DAS_MEDALHAS, type IdDaMedalha } from '../conquistas';

const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;
// Meio-dia de 06/10/2026 em São Luís (UTC−3).
const DIA_1 = Date.UTC(2026, 9, 6, 15);

const q = (id: string, bloco: BlocoQuestao): QuestaoDaLicao => ({ id, topicId: id.split('_')[0], bloco });
const r = (fase: Fase, questionId: string, respondidaEm = DIA_1): RespostaDaLicao => ({ fase, questionId, respondidaEm });
const varias = (fase: Fase, ids: string[], respondidaEm = DIA_1) => ids.map((id) => r(fase, id, respondidaEm));

// MDA tem o ciclo completo; GDD e c1 a c5 só têm prática. MDA e GDD são do módulo Fundamentos;
// c1 a c5, do módulo Prática.
const QUESTOES: QuestaoDaLicao[] = [
    q('mda_a1', 'forma_a'),
    q('mda_a2', 'forma_a'),
    q('mda_b1', 'forma_b'),
    q('mda_b2', 'forma_b'),
    q('mda_p1', 'pratica'),
    q('mda_p2', 'pratica'),
    q('gdd_p1', 'pratica'),
    q('gdd_p2', 'pratica'),
    ...['c1', 'c2', 'c3', 'c4', 'c5'].map((t) => q(`${t}_p1`, 'pratica')),
];
const TOPICOS = ['mda', 'gdd', 'c1', 'c2', 'c3', 'c4', 'c5'];
const MODULOS: Record<string, string> = { mda: 'Fundamentos', gdd: 'Fundamentos' };
for (const t of ['c1', 'c2', 'c3', 'c4', 'c5']) MODULOS[t] = 'Prática';

const FORMA_A = ['mda_a1', 'mda_a2'];
const FORMA_B = ['mda_b1', 'mda_b2'];
const PRATICA = ['mda_p1', 'mda_p2'];

// Quem tem a forma A faz A no diagnóstico e B na verificação e na revisão.
const ateAVerificacao = (quando = DIA_1) => [
    ...varias('pre', FORMA_A, quando),
    ...varias('pratica', PRATICA, quando),
    ...varias('pos', FORMA_B, quando),
];
const revisao = (quando: number) => varias('reteste', FORMA_B, quando);
const gddFeita = (quando = DIA_1) => varias('pratica', ['gdd_p1', 'gdd_p2'], quando);
const cFeita = (topico: string, quando = DIA_1) => [r('pratica', `${topico}_p1`, quando)];

function conquistas(respostas: RespostaDaLicao[], agora = DIA_1) {
    const licoes = licoesDoAluno({ topicos: TOPICOS, respostas, questoes: QUESTOES, formaPre: 'A', agora });
    return conquistasDoAluno({
        licoes: licoes.map((l) => ({ ...l, modulo: MODULOS[l.topicId] ?? null })),
        respostas,
        questoes: QUESTOES,
        formaPre: 'A',
    });
}
const medalha = (respostas: RespostaDaLicao[], id: IdDaMedalha, agora = DIA_1) =>
    conquistas(respostas, agora).find((c) => c.id === id)!;

describe('conquistasDoAluno', () => {
    it('sem resposta nenhuma, as seis medalhas existem, na ordem, e nenhuma foi ganha', () => {
        const todas = conquistas([]);

        expect(todas.map((c) => c.id)).toEqual(ORDEM_DAS_MEDALHAS);
        expect(todas).toHaveLength(6);
        expect(todas.every((c) => c.ganhaEm === null)).toBe(true);
        expect(medalhasGanhas(todas)).toBe(0);
    });

    describe('Primeira lição', () => {
        it('no ciclo curto, vale quando a prática termina, no horário da última resposta', () => {
            const respostas = [r('pratica', 'gdd_p1', DIA_1), r('pratica', 'gdd_p2', DIA_1 + HORA)];

            expect(medalha(respostas, 'primeira_licao').ganhaEm).toBe(DIA_1 + HORA);
        });

        it('com a prática pela metade, ainda não', () => {
            expect(medalha([r('pratica', 'gdd_p1')], 'primeira_licao').ganhaEm).toBeNull();
        });

        it('no ciclo completo, vale quando a verificação termina, sem esperar a revisão', () => {
            const respostas = [...varias('pre', FORMA_A), ...varias('pratica', PRATICA), r('pos', 'mda_b1', DIA_1), r('pos', 'mda_b2', DIA_1 + HORA)];

            expect(medalha(respostas, 'primeira_licao').ganhaEm).toBe(DIA_1 + HORA);
        });

        it('com a verificação pela metade, não vale: a medalha não pode revelar o acerto no meio da fase', () => {
            const respostas = [...varias('pre', FORMA_A), ...varias('pratica', PRATICA), r('pos', 'mda_b1')];

            expect(medalha(respostas, 'primeira_licao').ganhaEm).toBeNull();
        });

        it('só o diagnóstico feito não vale', () => {
            expect(medalha(varias('pre', FORMA_A), 'primeira_licao').ganhaEm).toBeNull();
        });

        it('fica com a data da primeira lição feita, mesmo com outras depois', () => {
            const respostas = [...gddFeita(DIA_1 + 2 * DIA), ...ateAVerificacao(DIA_1 + DIA)];

            expect(medalha(respostas, 'primeira_licao').ganhaEm).toBe(DIA_1 + DIA);
        });
    });

    describe('3 dias seguidos', () => {
        it('vale no primeiro horário do terceiro dia, contando respostas de qualquer fase', () => {
            const respostas = [
                r('pre', 'mda_a1', DIA_1),
                r('pre', 'mda_a2', DIA_1 + DIA),
                r('pratica', 'mda_p1', DIA_1 + 2 * DIA + 3 * HORA),
                r('pratica', 'mda_p2', DIA_1 + 2 * DIA - 2 * HORA),
            ];

            expect(medalha(respostas, 'tres_dias').ganhaEm).toBe(DIA_1 + 2 * DIA - 2 * HORA);
        });

        it('com dois dias, ainda não', () => {
            const respostas = [r('pre', 'mda_a1', DIA_1), r('pre', 'mda_a2', DIA_1 + DIA)];

            expect(medalha(respostas, 'tres_dias').ganhaEm).toBeNull();
        });

        it('um dia pulado quebra a contagem', () => {
            const respostas = [r('pre', 'mda_a1', DIA_1), r('pre', 'mda_a2', DIA_1 + DIA), r('pratica', 'mda_p1', DIA_1 + 3 * DIA)];

            expect(medalha(respostas, 'tres_dias').ganhaEm).toBeNull();
        });

        it('a medalha continua ganha depois que a sequência zera', () => {
            const respostas = [
                r('pre', 'mda_a1', DIA_1),
                r('pre', 'mda_a2', DIA_1 + DIA),
                r('pratica', 'mda_p1', DIA_1 + 2 * DIA),
                r('pratica', 'mda_p2', DIA_1 + 20 * DIA),
            ];

            expect(medalha(respostas, 'tres_dias', DIA_1 + 30 * DIA).ganhaEm).toBe(DIA_1 + 2 * DIA);
        });

        it('o dia vira à meia-noite de São Luís, não do UTC', () => {
            // 22:00 de 06/10 em São Luís já é 07/10 no UTC, mas é o mesmo dia do meio-dia de DIA_1: são dois dias, não três.
            const noite = Date.UTC(2026, 9, 7, 1);
            const respostas = [r('pre', 'mda_a1', DIA_1), r('pre', 'mda_a2', noite), r('pratica', 'mda_p1', noite + DIA)];

            expect(medalha(respostas, 'tres_dias').ganhaEm).toBeNull();
        });
    });

    describe('Um módulo inteiro', () => {
        const modulo = (respostas: RespostaDaLicao[]) => medalha(respostas, 'modulo_inteiro');
        const tresDaPratica = [...cFeita('c1'), ...cFeita('c2'), ...cFeita('c3')];

        it('sem nenhuma lição feita, mostra 0 de tantas, no módulo mais adiantado (o primeiro, no empate)', () => {
            expect(modulo([])).toMatchObject({ ganhaEm: null, progresso: { feito: 0, total: 2 } });
        });

        it('mostra o progresso do módulo mais adiantado', () => {
            expect(modulo(tresDaPratica)).toMatchObject({ ganhaEm: null, progresso: { feito: 3, total: 5 } });
        });

        it('vale quando a última lição do módulo é feita, na data dela', () => {
            const respostas = [...cFeita('c1', DIA_1), ...cFeita('c2', DIA_1), ...cFeita('c3', DIA_1), ...cFeita('c4', DIA_1 + 3 * DIA), ...cFeita('c5', DIA_1 + DIA)];

            expect(modulo(respostas)).toMatchObject({ ganhaEm: DIA_1 + 3 * DIA });
        });

        it('lição do ciclo completo em espera da revisão já conta como feita', () => {
            const respostas = [...ateAVerificacao(DIA_1), ...gddFeita(DIA_1 + HORA)];

            expect(modulo(respostas)).toMatchObject({ ganhaEm: DIA_1 + HORA });
        });

        it('um módulo com uma lição por fazer não vale', () => {
            expect(modulo(ateAVerificacao(DIA_1)).ganhaEm).toBeNull();
        });

        it('com dois módulos prontos, vale a data do que ficou pronto primeiro', () => {
            const praticaToda = ['c1', 'c2', 'c3', 'c4', 'c5'].flatMap((t) => cFeita(t, DIA_1));
            const respostas = [...praticaToda, ...ateAVerificacao(DIA_1 + 5 * DIA), ...gddFeita(DIA_1 + 6 * DIA)];

            expect(modulo(respostas).ganhaEm).toBe(DIA_1);
        });

        it('lição sem módulo não conta para nenhum, e sem módulo nenhum não há progresso', () => {
            const licoes = licoesDoAluno({ topicos: ['gdd'], respostas: gddFeita(), questoes: QUESTOES, formaPre: 'A', agora: DIA_1 });
            const todas = conquistasDoAluno({
                licoes: licoes.map((l) => ({ ...l, modulo: null })),
                respostas: gddFeita(),
                questoes: QUESTOES,
                formaPre: 'A',
            });

            expect(todas.find((c) => c.id === 'modulo_inteiro')).toMatchObject({ ganhaEm: null, progresso: null });
        });
    });

    describe('Revisão em dia', () => {
        const noDiaQueAbre = DIA_1 + 7 * DIA;

        it('vale quando a revisão termina no dia em que abre, na data em que terminou', () => {
            const respostas = [...ateAVerificacao(DIA_1), ...revisao(noDiaQueAbre)];

            expect(medalha(respostas, 'revisao_em_dia', noDiaQueAbre).ganhaEm).toBe(noDiaQueAbre);
        });

        it('feita no dia seguinte, não vale', () => {
            const respostas = [...ateAVerificacao(DIA_1), ...revisao(noDiaQueAbre + DIA)];

            expect(medalha(respostas, 'revisao_em_dia', noDiaQueAbre + DIA).ganhaEm).toBeNull();
        });

        it('com a revisão pela metade, não vale ainda: o resultado dela só aparece ao concluir', () => {
            const respostas = [...ateAVerificacao(DIA_1), r('reteste', 'mda_b1', noDiaQueAbre)];

            expect(medalha(respostas, 'revisao_em_dia', noDiaQueAbre).ganhaEm).toBeNull();
        });

        it('a revisão que abre à noite e termina depois da meia-noite não vale', () => {
            const abre = Date.UTC(2026, 9, 13, 14);
            const respostas = [...ateAVerificacao(DIA_1), r('reteste', 'mda_b1', abre + 9 * HORA), r('reteste', 'mda_b2', abre + 13 * HORA)];

            expect(medalha(respostas, 'revisao_em_dia', abre + 13 * HORA).ganhaEm).toBeNull();
        });
    });

    describe('Ciclo completo', () => {
        it('vale quando a revisão é concluída, mesmo semanas depois, na data em que terminou', () => {
            const fim = DIA_1 + 20 * DIA;
            const respostas = [...ateAVerificacao(DIA_1), ...revisao(fim)];

            expect(medalha(respostas, 'ciclo_completo', fim).ganhaEm).toBe(fim);
        });

        it('a lição em espera da revisão ainda não vale, diferente da Primeira lição', () => {
            const respostas = ateAVerificacao(DIA_1);

            expect(medalha(respostas, 'ciclo_completo').ganhaEm).toBeNull();
            expect(medalha(respostas, 'primeira_licao').ganhaEm).toBe(DIA_1);
        });

        it('lição do ciclo curto não tem revisão, então não vale', () => {
            expect(medalha(gddFeita(), 'ciclo_completo').ganhaEm).toBeNull();
        });
    });

    describe('5 lições', () => {
        it('com quatro feitas, mostra 4 de 5', () => {
            const respostas = [...cFeita('c1'), ...cFeita('c2'), ...cFeita('c3'), ...gddFeita()];

            expect(medalha(respostas, 'cinco_licoes')).toMatchObject({ ganhaEm: null, progresso: { feito: 4, total: 5 } });
        });

        it('vale na data da quinta lição feita, em ordem de tempo e não de tópico', () => {
            const respostas = [
                ...cFeita('c1', DIA_1 + 4 * DIA),
                ...cFeita('c2', DIA_1),
                ...cFeita('c3', DIA_1 + DIA),
                ...gddFeita(DIA_1 + 2 * DIA),
                ...cFeita('c4', DIA_1 + 3 * DIA),
                ...cFeita('c5', DIA_1 + 9 * DIA),
            ];

            expect(medalha(respostas, 'cinco_licoes')).toMatchObject({ ganhaEm: DIA_1 + 4 * DIA, progresso: { feito: 5, total: 5 } });
        });
    });
});

describe('medalhasGanhas', () => {
    it('conta as medalhas com data', () => {
        const respostas = [...gddFeita(DIA_1), r('pre', 'mda_a1', DIA_1 + DIA), r('pre', 'mda_a2', DIA_1 + 2 * DIA)];

        expect(medalhasGanhas(conquistas(respostas, DIA_1 + 2 * DIA))).toBe(2);
    });
});
