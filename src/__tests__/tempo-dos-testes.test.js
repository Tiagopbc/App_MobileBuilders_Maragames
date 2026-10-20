// Os testes de tela montam o app inteiro e, num computador ocupado, passam dos 5 segundos que o
// Jest dá por padrão: falham por demora, sem erro nenhum no código. O limite fica em 15 segundos.
const { jest: configuracao } = require('../../package.json');

it('cada teste tem até 15 segundos antes de ser dado como falho por demora', () => {
    expect(configuracao.testTimeout).toBe(15000);
});
