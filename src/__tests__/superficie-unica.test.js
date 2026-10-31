// Em JavaScript, como os outros testes que leem arquivos com o Node.
const { readdirSync, readFileSync } = require('fs');
const { join, relative } = require('path');

// O card das telas é um só: o `Superficie` (src/components/superficie.tsx), com o fundo do cartão,
// o contorno e o relevo da prática. Uma tela que monta o próprio card com `backgroundElement`
// volta a ficar chapada e diferente das outras.

const RAIZ = join(__dirname, '..');

function arquivos(pasta) {
    return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
        const caminho = join(pasta, item.name);
        if (item.isDirectory()) return item.name === '__tests__' ? [] : arquivos(caminho);
        return item.name.endsWith('.tsx') ? [caminho] : [];
    });
}

it('nenhuma tela monta o próprio card com backgroundElement', () => {
    const comCardProprio = arquivos(RAIZ)
        .map((caminho) => relative(RAIZ, caminho))
        .filter((caminho) => readFileSync(join(RAIZ, caminho), 'utf8').includes('backgroundElement'));

    expect(comCardProprio).toEqual([]);
});

it('nenhuma tela escreve o relevo à mão: só o Superficie usa relevoDoCartao em card de tela', () => {
    const comRelevoProprio = arquivos(join(RAIZ, 'app'))
        .map((caminho) => relative(RAIZ, caminho))
        .filter((caminho) => readFileSync(join(RAIZ, caminho), 'utf8').includes('relevoDoCartao'));

    expect(comRelevoProprio).toEqual([]);
});
