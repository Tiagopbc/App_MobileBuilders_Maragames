import { decimal, fracao, plural } from '../formato';

describe('fracao', () => {
    it('escreve os acertos sobre o total', () => {
        expect(fracao({ acertos: 3, total: 4 })).toBe('3 de 4');
        expect(fracao({ acertos: 0, total: 0 })).toBe('0 de 0');
    });
});

describe('decimal', () => {
    it('usa vírgula e uma casa por padrão', () => {
        expect(decimal(2.25)).toBe('2,3');
        expect(decimal(3)).toBe('3,0');
    });

    it('aceita outro número de casas', () => {
        expect(decimal(0.4567, 2)).toBe('0,46');
        expect(decimal(-0.5, 2)).toBe('-0,50');
    });
});

describe('plural', () => {
    it('usa o singular só para um', () => {
        expect(plural(1, 'pessoa', 'pessoas')).toBe('1 pessoa');
        expect(plural(0, 'pessoa', 'pessoas')).toBe('0 pessoas');
        expect(plural(2, 'lição', 'lições')).toBe('2 lições');
    });
});
