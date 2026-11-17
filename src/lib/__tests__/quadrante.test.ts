import { quadranteDe } from '../quadrante';

describe('quadranteDe', () => {
    it('acerto com certeza é firme', () => {
        expect(quadranteDe(true, 3)).toBe('firme');
    });

    it('acerto com palpite é frágil', () => {
        expect(quadranteDe(true, 1)).toBe('fragil');
    });

    it('acerto com dúvida é frágil: o nível 2 conta como confiança baixa', () => {
        expect(quadranteDe(true, 2)).toBe('fragil');
    });

    it('erro com palpite é lacuna', () => {
        expect(quadranteDe(false, 1)).toBe('lacuna');
    });

    it('erro com dúvida é lacuna: o nível 2 conta como confiança baixa', () => {
        expect(quadranteDe(false, 2)).toBe('lacuna');
    });

    it('erro com certeza é ponto cego', () => {
        expect(quadranteDe(false, 3)).toBe('ponto_cego');
    });
});
