// Em JavaScript, como os outros testes que leem arquivos: o Node lê, e os tipos dele não entram no
// tsconfig para o código do app não poder usá-los por engano.
const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');

// O repositório é de um autor só, e o rodapé do relatório diz isso ("Feito por Tiago Cavalcanti").
// Os comentários e as mensagens dos scripts e da `src/lib` falam do autor, e não de "o grupo".
//
// "Grupo" no sentido de grupo de pessoas (grupo de controle, grupo por sexo ou idade, "todo o grupo"
// da conta do ganho) é outra coisa e fica. O texto do termo (src/constants/termo.ts) também fica: mudar
// o termo pede novo aceite, e isso é a entrega 11.

const RAIZ = join(__dirname, '..', '..');
const SCRIPTS = join(RAIZ, 'scripts');
const DO_GRUPO = /\b(?:d?o|com o|para o) grupo\b/i;

// As expressões da `src/lib` e da `src/data` em que "o grupo" era o autor.
const DO_AUTOR_NO_CODIGO = [
    'grupo envia',
    'o grupo gera',
    'chave do grupo',
    'arquivos do grupo',
    'escolhas do grupo',
    'fica só com o grupo',
    'adaptado pelo grupo',
    'decidida pelo grupo',
    'para o grupo trabalhar',
    'conta de teste do grupo',
];

function arquivosDe(pasta, extensao) {
    return readdirSync(pasta)
        .filter((nome) => extensao.test(nome))
        .map((nome) => join(pasta, nome));
}

function linhasCom(arquivos, achou) {
    return arquivos.flatMap((arquivo) =>
        readFileSync(arquivo, 'utf8')
            .split('\n')
            .map((linha, i) => ({ onde: `${arquivo.replace(RAIZ + '/', '')}:${i + 1}`, linha }))
            .filter(({ linha }) => achou(linha))
            .map(({ onde }) => onde)
    );
}

it('nenhum script fala de "o grupo": fala do autor', () => {
    expect(linhasCom(arquivosDe(SCRIPTS, /\.(ts|js)$/), (linha) => DO_GRUPO.test(linha))).toEqual([]);
});

it('a src/lib e a src/data falam do autor onde "o grupo" era ele', () => {
    const arquivos = [...arquivosDe(join(RAIZ, 'src', 'lib'), /\.tsx?$/), join(RAIZ, 'src', 'data', 'mapeadores.ts')];

    expect(linhasCom(arquivos, (linha) => DO_AUTOR_NO_CODIGO.some((trecho) => linha.toLowerCase().includes(trecho)))).toEqual([]);
});
