// O conteúdo versionado em content/ (item 21), conferido pela mesma validação que o seed usa.
// Fica em JS puro, como os outros testes que leem arquivos do projeto: o script é Node.

const fs = require('fs');
const path = require('path');

const { validar } = require('../../scripts/seed-conteudo');

const ler = (nome) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content', nome), 'utf8'));
const topicos = ler('topicos.json');
const questoes = ler('questoes.json');

const DIFICULDADES = ['avancado', 'basico', 'intermediario'];
const doBloco = (topicId, bloco) => questoes.filter((q) => q.topicId === topicId && q.bloco === bloco);

describe('o conteúdo do repositório', () => {
    it('passa na validação do seed', () => {
        expect(validar(topicos, questoes)).toEqual([]);
    });

    // A prova da Fase 8 do plano: os nove tópicos fazem o ciclo completo da lição.
    it.each(topicos.map((t) => t.topicId))('%s tem diagnóstico e verificação: formas A e B, uma questão por dificuldade', (topicId) => {
        for (const bloco of ['forma_a', 'forma_b']) {
            expect(doBloco(topicId, bloco).map((q) => q.dificuldade).sort()).toEqual(DIFICULDADES);
        }
        expect(doBloco(topicId, 'pratica').length).toBeGreaterThan(0);
    });

    it('nenhuma explicação começa com "Correto.": a tela já diz se a pessoa acertou', () => {
        const comPrefixo = questoes.flatMap((q) =>
            q.alternativas.filter((a) => /^\s*Correto\b/i.test(a.explicacao)).map((a) => `${q.id}/${a.id}`)
        );

        expect(comPrefixo).toEqual([]);
    });

    // O começo não é conferido: explicações de Lógica de Programação abrem com um número ou
    // com o nome de uma variável.
    it('toda explicação é uma frase fechada, com pontuação no fim', () => {
        const fora = questoes.flatMap((q) =>
            q.alternativas.filter((a) => !/[.!?)”"]$/.test(a.explicacao.trim())).map((a) => `${q.id}/${a.id}`)
        );

        expect(fora).toEqual([]);
    });

    // A correta não pode se entregar pelo tamanho. Com quatro alternativas, o acaso a faria a mais
    // longa em cerca de uma questão a cada quatro; acima de 30% vira pista para quem chuta.
    it('a correta é a alternativa mais longa em no máximo 30% das questões', () => {
        const tamanho = (a) => a.texto.length;
        const maisLonga = questoes.filter((q) => {
            const correta = tamanho(q.alternativas.find((a) => a.correta));
            return q.alternativas.filter((a) => !a.correta).every((a) => tamanho(a) < correta);
        });

        expect(maisLonga.length).toBeLessThanOrEqual(Math.floor(questoes.length * 0.3));
    });

    it('toda questão diz de onde veio', () => {
        expect(questoes.filter((q) => typeof q.fonte !== 'string' || q.fonte.trim() === '').map((q) => q.id)).toEqual([]);
    });
});

describe('a validação do seed', () => {
    const semUma = (id) => questoes.filter((q) => q.id !== id);
    const umTopico = topicos[0].topicId;

    it('tópico com forma incompleta é erro: sem as três dificuldades não há antes e depois', () => {
        const umaDaFormaB = doBloco(umTopico, 'forma_b')[0];

        expect(validar(topicos, semUma(umaDaFormaB.id))).toEqual([
            expect.stringContaining(`${umTopico}: forma_b deve ter uma questão básica, uma intermediária e uma avançada`),
        ]);
    });

    it('tópico da trilha diária só com prática continua válido: é o ciclo curto', () => {
        const base = doBloco(umTopico, 'pratica')[0];
        const curto = { ...topicos[0], topicId: 'ciclo_curto', ordem: 99, lessonOrder: 99, trilha: 'diaria' };
        const pratica = [1, 2, 3, 4, 5].map((n) => ({ ...base, id: `ciclo_curto_0${n}`, topicId: 'ciclo_curto' }));

        expect(validar([...topicos, curto], [...questoes, ...pratica])).toEqual([]);
    });

    it('tópico com uma forma só é erro', () => {
        const semFormaB = questoes.filter((q) => q.topicId !== umTopico || q.bloco !== 'forma_b');

        expect(validar(topicos, semFormaB)).toEqual([expect.stringContaining(`${umTopico}: forma_b`)]);
    });
});

// Por agora só Fundamentos de Game Design tem questões. Os outros módulos aparecem na lista de
// lições como "em breve", só com os títulos, a partir de content/em-breve.json.
describe('os módulos em breve', () => {
    const emBreve = ler('em-breve.json');

    it('o conteúdo com questões é só o módulo Fundamentos de Game Design, com 5 lições', () => {
        expect(topicos.map((t) => t.modulo)).toEqual(Array(5).fill('Fundamentos de Game Design'));
        expect(topicos.map((t) => t.titulo)).toEqual([
            'O que é Game Design',
            'Framework MDA',
            'Core Loop e Diversão',
            'Balanceamento de Jogo',
            'Level Design',
        ]);
    });

    it('são os outros 5 módulos, cada um com 5 lições', () => {
        expect(emBreve.map((m) => m.modulo)).toEqual([
            'Game Engines',
            'Programação para Jogos',
            'Arte & Pixel Art',
            'Áudio & Música',
            'Publicação & Monetização',
        ]);
        for (const m of emBreve) {
            expect(m.licoes).toHaveLength(5);
            for (const titulo of m.licoes) expect(titulo.trim()).not.toBe('');
        }
    });

    it('nenhum módulo em breve repete um módulo que já tem questões', () => {
        const comQuestoes = new Set(topicos.map((t) => t.modulo));
        expect(emBreve.filter((m) => comQuestoes.has(m.modulo))).toEqual([]);
    });
});
