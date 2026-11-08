// Em JavaScript, como os outros testes que leem arquivos: o Node lê, e os tipos dele não entram no
// tsconfig para o código do app não poder usá-los por engano.
const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');

// O repositório é de um autor só, e o rodapé do relatório diz isso ("Feito por Tiago Cavalcanti").
// Os comentários e as mensagens dos scripts falam do autor, e não de "o grupo".

const SCRIPTS = join(__dirname, '..', '..', 'scripts');
const DO_GRUPO = /\b(?:d?o|com o|para o) grupo\b/i;

it('nenhum script fala de "o grupo": fala do autor', () => {
    const comGrupo = readdirSync(SCRIPTS)
        .filter((nome) => /\.(ts|js)$/.test(nome))
        .flatMap((nome) =>
            readFileSync(join(SCRIPTS, nome), 'utf8')
                .split('\n')
                .map((linha, i) => ({ onde: `${nome}:${i + 1}`, linha }))
                .filter(({ linha }) => DO_GRUPO.test(linha))
                .map(({ onde }) => onde)
        );

    expect(comGrupo).toEqual([]);
});
