import { ORDEM_DAS_MEDALHAS } from '../../lib/conquistas';
import {
    acertosDoTopico,
    antesEDepois,
    detalheDaEtapa,
    quandoARevisaoAbre,
    detalheDaSugestao,
    contarDias,
    licoesFeitas,
    passoFeitoEm,
    termoAceitoEm,
    proximaRevisao,
    rotuloDoBotaoDaLicao,
    tituloDaSugestao,
    situacaoDaLicao,
    verificacaoEHoje,
    formatarAcertos,
    numeroDaCarta,
    peDaCartaParaLeitor,
    formatarTaxa,
    formatarPontos,
    formatarXp,
    formatarXpTotal,
    resumirQuadrantes,
    resumoDoProgresso,
    xpNaCarta,
    respostasDeMinimas,
    botaoDaSugestao,
    diasAbreviados,
    LETRAS_DA_SEMANA,
    linhaDoModulo,
    rotuloDaEtapaDoParaHoje,
    rotuloDoDiaDaSemana,
    rotuloDoSeloDeXp,
    tituloDaSequencia,
    xpDeHojeNoSelo,
    contagemDeMedalhas,
    quandoARevisaoAbreComQuestoes,
    variacaoDaRevisao,
    variacaoDoFim,
    estadoDaMedalha,
    MEDALHAS_DO_APP,
    TEXTOS_DAS_CONQUISTAS,
    AUTOR,
    TEXTOS_DE_BOAS_VINDAS,
    TEXTOS_DO_LOGIN,
    TEXTOS_DO_PERFIL,
    versaoDoAppNoPerfil,
} from '../textos';

describe('formatarPontos', () => {
    it('põe o sinal: mais, o menos tipográfico e o zero sem sinal', () => {
        expect(formatarPontos(3)).toBe('+3');
        expect(formatarPontos(-4)).toBe('−4');
        expect(formatarPontos(0)).toBe('0');
    });
});

describe('formatarXp', () => {
    it('ganho aparece com sinal de mais', () => {
        expect(formatarXp(3)).toBe('+3 XP');
    });

    it('perda aparece com sinal de menos tipográfico', () => {
        expect(formatarXp(-4)).toBe('−4 XP');
    });

    it('zero aparece sem sinal', () => {
        expect(formatarXp(0)).toBe('0 XP');
    });
});

describe('formatarXpTotal', () => {
    it('o total da home leva o rótulo na frente', () => {
        expect(formatarXpTotal(18)).toBe('XP: +18');
    });

    it('zero aparece sem sinal', () => {
        expect(formatarXpTotal(0)).toBe('XP: 0');
    });
});

describe('acertosDoTopico', () => {
    it('diz os acertos do tópico e o XP que ele rendeu', () => {
        expect(acertosDoTopico(6, 6, 'UX/UI em jogos', 18)).toBe(
            'Você acertou 6 de 6 questões de UX/UI em jogos · +18 XP'
        );
    });

    it('saldo negativo aparece como é', () => {
        expect(acertosDoTopico(1, 6, 'GDD', -5)).toBe('Você acertou 1 de 6 questões de GDD · −5 XP');
    });
});

describe('os textos da lição', () => {
    const progresso = (respondidas: number) => ({ respondidas, total: 3, proximaQuestaoId: 'q' });

    it('o botão diz o passo da vez', () => {
        expect(rotuloDoBotaoDaLicao({ tipo: 'nova' })).toBe('Começar');
        expect(rotuloDoBotaoDaLicao({ tipo: 'diagnostico', ...progresso(1) })).toBe('Continuar o diagnóstico');
        expect(rotuloDoBotaoDaLicao({ tipo: 'estudo', ...progresso(0) })).toBe('Abrir o cartão');
        expect(rotuloDoBotaoDaLicao({ tipo: 'estudo', ...progresso(2) })).toBe('Continuar a prática');
        expect(rotuloDoBotaoDaLicao({ tipo: 'verificacao', ...progresso(0) })).toBe('Fazer a verificação');
        expect(rotuloDoBotaoDaLicao({ tipo: 'verificacao', ...progresso(1) })).toBe('Continuar a verificação');
        expect(rotuloDoBotaoDaLicao({ tipo: 'revisao', liberadaEm: 0, ...progresso(0) })).toBe('Fazer a revisão');
        expect(rotuloDoBotaoDaLicao({ tipo: 'revisao', liberadaEm: 0, ...progresso(1) })).toBe('Continuar a revisão');
    });

    it('a etapa parada no meio diz onde a pessoa parou; as outras, o tamanho', () => {
        const noEstudo = { tipo: 'estudo', ...progresso(2) } as const;

        expect(detalheDaEtapa('estudo', 3, noEstudo)).toBe('2 de 3');
        expect(detalheDaEtapa('diagnostico', 3, noEstudo)).toBe('3 questões');
        expect(detalheDaEtapa('verificacao', 1, noEstudo)).toBe('1 questão');
    });

    it('a revisão diz quando abre, até abrir', () => {
        expect(detalheDaEtapa('revisao', 3, { tipo: 'nova' })).toBe('7 dias depois da verificação');
        expect(detalheDaEtapa('revisao', 3, { tipo: 'aguardando_revisao', liberaEm: 0, diasRestantes: 5 })).toBe('Abre em 5 dias');
        expect(detalheDaEtapa('revisao', 3, { tipo: 'aguardando_revisao', liberaEm: 0, diasRestantes: 1 })).toBe('Abre amanhã');
        expect(detalheDaEtapa('revisao', 3, { tipo: 'revisao', liberadaEm: 0, ...progresso(0) })).toBe('3 questões');
    });

    it('a situação da lição, para a lista', () => {
        expect(situacaoDaLicao({ tipo: 'nova' })).toBe('Nova');
        expect(situacaoDaLicao({ tipo: 'diagnostico', ...progresso(1) })).toBe('Em andamento');
        expect(situacaoDaLicao({ tipo: 'estudo', ...progresso(0) })).toBe('Em andamento');
        expect(situacaoDaLicao({ tipo: 'verificacao', ...progresso(0) })).toBe('Em andamento');
        expect(situacaoDaLicao({ tipo: 'aguardando_revisao', liberaEm: 0, diasRestantes: 5 })).toBe('Revisão em 5 dias');
        expect(situacaoDaLicao({ tipo: 'aguardando_revisao', liberaEm: 0, diasRestantes: 1 })).toBe('Revisão amanhã');
        expect(situacaoDaLicao({ tipo: 'revisao', liberadaEm: 0, ...progresso(0) })).toBe('Revisão disponível');
        expect(situacaoDaLicao({ tipo: 'concluida', concluidaEm: 0 })).toBe('Concluída');
    });

    it('o Para hoje: título, detalhe e a próxima revisão', () => {
        expect(tituloDaSugestao('Framework MDA', { tipo: 'nova' })).toBe('Framework MDA');
        expect(tituloDaSugestao('Framework MDA', { tipo: 'revisao', liberadaEm: 0, ...progresso(0) })).toBe('Revisão de Framework MDA');
        expect(detalheDaSugestao({ tipo: 'nova' })).toBe('Lição nova');
        expect(detalheDaSugestao({ tipo: 'estudo', ...progresso(0) })).toBe('Cartão e prática');
        expect(detalheDaSugestao({ tipo: 'diagnostico', ...progresso(2) })).toBe('Diagnóstico · 2 de 3');
        expect(detalheDaSugestao({ tipo: 'revisao', liberadaEm: 0, ...progresso(0) })).toBe('3 questões');
        expect(proximaRevisao('Framework MDA', 5)).toBe('Próxima revisão: Framework MDA, em 5 dias.');
        expect(proximaRevisao('Framework MDA', 1)).toBe('Próxima revisão: Framework MDA, amanhã.');
    });

    it('o atalho Lições conta as feitas, no singular e no plural', () => {
        expect(licoesFeitas(0, 9)).toBe('0 de 9 feitas');
        expect(licoesFeitas(1, 9)).toBe('1 de 9 feita');
        expect(licoesFeitas(3, 9)).toBe('3 de 9 feitas');
    });

    it('o histórico e o termo dizem a data no fuso de São Luís', () => {
        // 02:00 UTC de 09/10 ainda é 08/10 em São Luís.
        expect(passoFeitoEm('pre', Date.UTC(2026, 9, 9, 2))).toBe('Diagnóstico · 08/10');
        expect(passoFeitoEm('reteste', Date.UTC(2026, 9, 15, 15))).toBe('Revisão · 15/10');
        expect(termoAceitoEm(Date.UTC(2026, 9, 6, 15))).toBe('Termo de participação aceito em 06/10/2026.');
    });

    it('a sequência, no singular e no plural', () => {
        expect(contarDias(1)).toBe('1 dia');
        expect(contarDias(3)).toBe('3 dias');
    });

    it('o antes e o depois saem em contagem, e não em percentual', () => {
        expect(antesEDepois({ acertos: 1, total: 3 }, { acertos: 3, total: 3 })).toBe('Antes 1 de 3 → Depois 3 de 3');
        expect(verificacaoEHoje({ acertos: 3, total: 3 }, { acertos: 2, total: 3 })).toBe('Na verificação 3 de 3 → Hoje 2 de 3');
    });

    it('a data da revisão sai no fuso de São Luís, com o artigo do dia', () => {
        // 16/10/2026 é sexta; 17/10, sábado.
        expect(quandoARevisaoAbre(Date.UTC(2026, 9, 16, 3))).toBe('A revisão abre na sexta, 16/10.');
        expect(quandoARevisaoAbre(Date.UTC(2026, 9, 17, 3))).toBe('A revisão abre no sábado, 17/10.');
    });
});

describe('resumirQuadrantes', () => {
    it('lista o que há para revisar, do mais urgente ao menos, no plural certo', () => {
        expect(resumirQuadrantes({ firme: 1, fragil: 2, lacuna: 1, ponto_cego: 2 })).toBe(
            '2 pontos cegos · 1 lacuna · 2 frágeis'
        );
    });

    it('usa o singular quando é um só', () => {
        expect(resumirQuadrantes({ firme: 0, fragil: 1, lacuna: 0, ponto_cego: 1 })).toBe('1 ponto cego · 1 frágil');
    });

    it('deixa de fora o que está zerado e o que está firme', () => {
        expect(resumirQuadrantes({ firme: 3, fragil: 0, lacuna: 2, ponto_cego: 0 })).toBe('2 lacunas');
    });
});

describe('resumoDoProgresso', () => {
    it('diz quantas respostas, quantas estão firmes e em quantas a pessoa achou que sabia', () => {
        expect(resumoDoProgresso(15, 9, 2)).toBe('De 15 respostas, 9 estão firmes. Em 2, você achou que sabia.');
        expect(resumoDoProgresso(4, 2, 1)).toBe('De 4 respostas, 2 estão firmes. Em 1, você achou que sabia.');
    });

    it('sem ponto cego, a segunda frase some', () => {
        expect(resumoDoProgresso(8, 8, 0)).toBe('De 8 respostas, 8 estão firmes.');
    });

    it('concorda com o singular e com o zero', () => {
        expect(resumoDoProgresso(1, 1, 0)).toBe('De 1 resposta, 1 está firme.');
        expect(resumoDoProgresso(4, 0, 1)).toBe('De 4 respostas, nenhuma está firme. Em 1, você achou que sabia.');
    });
});

describe('xpNaCarta', () => {
    it('é o número grande da carta: com sinal quando há XP, e 0 quando não há', () => {
        expect(xpNaCarta(18)).toBe('+18');
        expect(xpNaCarta(3)).toBe('+3');
        expect(xpNaCarta(0)).toBe('0');
    });
});

describe('os textos das Conquistas', () => {
    it('cada medalha tem nome e uma frase do que fazer, na ordem da tela', () => {
        expect(ORDEM_DAS_MEDALHAS.map((id) => MEDALHAS_DO_APP[id].nome)).toEqual([
            'Primeira lição',
            '3 dias seguidos',
            'Um módulo inteiro',
            'Revisão em dia',
            'Ciclo completo',
            '5 lições',
        ]);
        expect(MEDALHAS_DO_APP.modulo_inteiro.descricao).toBe('Terminar todas as lições de um módulo.');
        expect(MEDALHAS_DO_APP.ciclo_completo.descricao).toBe('Terminar uma lição com a revisão feita.');
    });

    it('nenhuma medalha fala em certeza, em acerto ou em ranking', () => {
        for (const id of ORDEM_DAS_MEDALHAS) {
            const { nome, descricao } = MEDALHAS_DO_APP[id];
            expect(`${nome} ${descricao}`).not.toMatch(/certeza|acert|errad|erro|ranking|melhor/i);
        }
        expect(TEXTOS_DAS_CONQUISTAS.apoio).toBe('Medalhas só suas. Elas mostram o que você fez, sem comparar com ninguém.');
    });

    it('conta as medalhas: "2 de 6"', () => {
        expect(contagemDeMedalhas(2, 6)).toBe('2 de 6');
        expect(contagemDeMedalhas(0, 6)).toBe('0 de 6');
    });

    it('a medalha ganha diz o dia, no fuso de São Luís', () => {
        // 01:30 UTC de 13/11 ainda é 12/11 em São Luís.
        expect(estadoDaMedalha({ ganhaEm: Date.UTC(2026, 10, 13, 1, 30), progresso: null })).toBe('Ganhou em 12/11');
    });

    it('a medalha bloqueada diz que está bloqueada, com a contagem quando há', () => {
        expect(estadoDaMedalha({ ganhaEm: null, progresso: null })).toBe('Bloqueada');
        expect(estadoDaMedalha({ ganhaEm: null, progresso: { feito: 1, total: 5 } })).toBe('Bloqueada · 1 de 5');
    });
});

describe('o fim da lição', () => {
    it('quando o depois melhora, diz quantos acertos a mais, sem dizer a causa', () => {
        expect(variacaoDoFim({ acertos: 1, total: 3 }, { acertos: 3, total: 3 })).toEqual({
            texto: 'Você acertou 2 a mais na verificação',
            melhorou: true,
        });
    });

    it('quando o depois é igual, diz que o resultado é o mesmo, sem tom de derrota', () => {
        expect(variacaoDoFim({ acertos: 2, total: 3 }, { acertos: 2, total: 3 })).toEqual({
            texto: 'Mesmo resultado do diagnóstico',
            melhorou: false,
        });
    });

    it('quando o depois é menor, diz quantos a menos, em tom neutro', () => {
        expect(variacaoDoFim({ acertos: 3, total: 3 }, { acertos: 2, total: 3 })).toEqual({
            texto: 'Você acertou 1 a menos que no diagnóstico',
            melhorou: false,
        });
    });

    it('nenhuma frase atribui o ganho ao estudo', () => {
        const frases = [
            variacaoDoFim({ acertos: 0, total: 3 }, { acertos: 3, total: 3 }).texto,
            variacaoDoFim({ acertos: 2, total: 3 }, { acertos: 2, total: 3 }).texto,
            variacaoDoFim({ acertos: 3, total: 3 }, { acertos: 0, total: 3 }).texto,
            variacaoDaRevisao({ acertos: 2, total: 3 }),
        ];
        for (const frase of frases) expect(frase).not.toMatch(/estud|graças|por causa/i);
    });

    it('a revisão diz o que a pessoa lembrou, sem comparar com a verificação', () => {
        expect(variacaoDaRevisao({ acertos: 2, total: 3 })).toBe('Você lembrou 2 de 3. A revisão mostra o que ficou.');
    });

    it('avisa quando a revisão abre e quantas questões tem', () => {
        // 06/11/2026 é sexta-feira.
        expect(quandoARevisaoAbreComQuestoes(Date.UTC(2026, 10, 6, 15), 3)).toBe(
            'A revisão abre na sexta, 06/11. São 3 questões para ver o quanto ficou.'
        );
        expect(quandoARevisaoAbreComQuestoes(Date.UTC(2026, 10, 7, 15), 1)).toBe(
            'A revisão abre no sábado, 07/11. É 1 questão para ver o quanto ficou.'
        );
    });

    it('o botão principal leva à próxima lição que o app sugere, e some quando não há', () => {
        expect(botaoDaSugestao({ tipo: 'nova', topicId: 'gdd' }, 'GDD')).toBe('Começar GDD');
        expect(botaoDaSugestao({ tipo: 'continuar', topicId: 'gdd' }, 'GDD')).toBe('Continuar GDD');
        expect(botaoDaSugestao({ tipo: 'revisao', topicId: 'mda' }, 'Framework MDA')).toBe('Fazer a revisão de Framework MDA');
        expect(botaoDaSugestao({ tipo: 'em_dia', topicId: 'mda', liberaEm: 1, diasRestantes: 3 }, 'Framework MDA')).toBeNull();
        expect(botaoDaSugestao({ tipo: 'tudo_concluido' }, null)).toBeNull();
    });
});

describe('os textos da home', () => {
    it('a linha do módulo diz quantas lições dele estão feitas, no singular e no plural', () => {
        expect(linhaDoModulo('Fundamentos', 2, 5)).toBe('Fundamentos · 2 de 5 feitas');
        expect(linhaDoModulo('Fundamentos', 1, 5)).toBe('Fundamentos · 1 de 5 feita');
    });

    it('o rótulo da etapa leva o progresso só quando há resposta', () => {
        const base = { etapa: 'estudo' } as const;

        expect(rotuloDaEtapaDoParaHoje({ ...base, progresso: { respondidas: 1, total: 4 } })).toBe('Cartão e prática 1/4');
        expect(rotuloDaEtapaDoParaHoje({ ...base, progresso: null })).toBe('Cartão e prática');
        expect(rotuloDaEtapaDoParaHoje({ etapa: 'revisao', progresso: null })).toBe('Revisão');
    });

    it('o XP do dia leva o sinal, e não aparece quando é zero', () => {
        expect(xpDeHojeNoSelo(7)).toBe('+7 hoje');
        expect(xpDeHojeNoSelo(-2)).toBe('−2 hoje');
        expect(xpDeHojeNoSelo(0)).toBeNull();
    });

    it('o leitor de tela ouve o total e o do dia juntos', () => {
        expect(rotuloDoSeloDeXp(18, 7)).toBe('XP: +18, +7 hoje');
        expect(rotuloDoSeloDeXp(18, 0)).toBe('XP: +18');
        expect(rotuloDoSeloDeXp(0, 0)).toBe('XP: 0');
    });

    it('o título da sequência concorda no singular, e o zero é só um número', () => {
        expect(tituloDaSequencia(3)).toBe('3 dias seguidos');
        expect(tituloDaSequencia(1)).toBe('1 dia seguido');
        expect(tituloDaSequencia(0)).toBe('0 dias seguidos');
    });

    it('a semana começa na segunda, com a letra de cada dia', () => {
        expect(LETRAS_DA_SEMANA).toEqual(['S', 'T', 'Q', 'Q', 'S', 'S', 'D']);
    });

    it('o leitor de tela ouve o nome do dia e se houve resposta, sem cobrar', () => {
        expect(rotuloDoDiaDaSemana(2, { feito: true, hoje: false })).toBe('quarta, com resposta');
        expect(rotuloDoDiaDaSemana(0, { feito: false, hoje: false })).toBe('segunda, sem resposta');
        expect(rotuloDoDiaDaSemana(4, { feito: false, hoje: true })).toBe('sexta, hoje, sem resposta');
        expect(rotuloDoDiaDaSemana(6, { feito: true, hoje: true })).toBe('domingo, hoje, com resposta');
    });

    it('a revisão selada conta os dias de forma curta', () => {
        expect(diasAbreviados(5)).toBe('5 d');
        expect(diasAbreviados(1)).toBe('1 d');
    });
});

describe('respostasDeMinimas', () => {
    it('conta as respostas até a amostra mínima', () => {
        expect(respostasDeMinimas(4, 10)).toBe('4 de 10 respostas');
        expect(respostasDeMinimas(1, 10)).toBe('1 de 10 respostas');
    });
});

describe('formatarTaxa e formatarAcertos', () => {
    it('a taxa diz quantos acertos em quantas respostas', () => {
        expect(formatarTaxa(2, 3)).toBe('2 de 3');
    });

    it('sem resposta naquele grupo, a taxa diz isso em vez de "0 de 0"', () => {
        expect(formatarTaxa(0, 0)).toBe('sem respostas');
    });

    it('o resumo de acertos não depende de plural', () => {
        expect(formatarAcertos(1, 2)).toBe('Acertou 1 de 2');
        expect(formatarAcertos(8, 12)).toBe('Acertou 8 de 12');
    });
});


describe('o pé da carta de conceito', () => {
    it('mostra o número da carta e o total, sem espaço', () => {
        expect(numeroDaCarta(0, 5)).toBe('1/5');
        expect(numeroDaCarta(4, 5)).toBe('5/5');
    });

    it('para o leitor de tela, diz o tipo da carta e a posição por extenso', () => {
        expect(peDaCartaParaLeitor(0, 3)).toBe('Conceito, 1 de 3');
    });
});

describe('a assinatura de quem fez o app', () => {
    it('o autor é uma pessoa só, e a assinatura da boas-vindas diz "by" e o nome', () => {
        expect(AUTOR).toBe('Tiago Cavalcanti');
        expect(TEXTOS_DE_BOAS_VINDAS.assinatura).toBe('by Tiago Cavalcanti');
    });

    it('o Perfil mostra o autor e a versão do app', () => {
        expect(versaoDoAppNoPerfil('1.0.0')).toBe('Tiago Cavalcanti · versão 1.0.0');
    });
});

describe('os textos sem marca de gênero nem promessa que o app não cumpre', () => {
    it('a chamada do login não marca gênero', () => {
        expect(TEXTOS_DO_LOGIN.chamada).toBe('Hora de soltar a fera?');
    });

    it('a dica do apelido não fala em ranking, que o app não tem', () => {
        expect(TEXTOS_DO_PERFIL.dicaDoApelido).toBe('como você aparece no app');
    });

    it('a pergunta sobre o site da cliente não marca gênero', () => {
        expect(TEXTOS_DO_PERFIL.alunoDoSite).toBe('Você já estuda pelo site da Beast Maragames?');
    });
});
