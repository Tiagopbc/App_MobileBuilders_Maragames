// Quadrante acerto × confiança (item 15). Função pura: sem React, sem Firebase, sem estado.
// O quadrante nunca é gravado; mudar o corte aqui recalcula tudo a partir de `answers`.

import type { Confianca } from '../types/domain';

// Valor usado no código. Os rótulos ("Firme", "Frágil", "Lacuna", "Ponto cego") ficam só na tela.
export type Quadrante = 'firme' | 'fragil' | 'lacuna' | 'ponto_cego';

// Os quatro, na ordem de leitura: do acerto com certeza ao erro com certeza.
export const QUADRANTES: readonly Quadrante[] = ['firme', 'fragil', 'lacuna', 'ponto_cego'];

// Só "Tenho certeza" é confiança alta; "Palpite" e "Tenho dúvida" contam como baixa.
export const CONFIANCA_ALTA: Confianca = 3;

export function quadranteDe(correta: boolean, confianca: Confianca): Quadrante {
    const alta = confianca >= CONFIANCA_ALTA;
    if (correta) return alta ? 'firme' : 'fragil';
    return alta ? 'ponto_cego' : 'lacuna';
}

/** Uma contagem nova, com os quatro quadrantes em zero. */
export function semQuadrantes(): Record<Quadrante, number> {
    return { firme: 0, fragil: 0, lacuna: 0, ponto_cego: 0 };
}
