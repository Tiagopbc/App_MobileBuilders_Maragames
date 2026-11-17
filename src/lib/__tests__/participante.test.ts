import { formaDoParticipante } from '../participante';

describe('formaDoParticipante', () => {
    it.each([
        [1, 'A'],
        [2, 'B'],
        [3, 'A'],
        [15, 'A'],
        [16, 'B'],
    ] as const)('o %iº participante a aceitar recebe a forma %s', (ordem, forma) => {
        expect(formaDoParticipante(ordem)).toBe(forma);
    });

    it.each([0, -1, 1.5, NaN])('recusa %p, que não é posição de ninguém na fila', (ordem) => {
        expect(() => formaDoParticipante(ordem)).toThrow();
    });
});
