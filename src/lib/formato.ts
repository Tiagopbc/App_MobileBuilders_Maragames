// Os números em texto, do jeito que o relatório e o resumo da exportação os escrevem.
// Função pura: sem React, sem Firebase, sem estado.

import type { Taxa } from './resultado';

/** "3 de 4". */
export const fracao = (taxa: Taxa) => `${taxa.acertos} de ${taxa.total}`;

/** Com vírgula, como se lê em português: "0,42". */
export const decimal = (valor: number, casas = 1) => valor.toFixed(casas).replace('.', ',');

/** "1 pessoa", "2 pessoas". */
export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
