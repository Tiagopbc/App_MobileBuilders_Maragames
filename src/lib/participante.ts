// A forma do diagnóstico de cada participante (item 22). Função pura: sem React, sem Firebase,
// sem estado.

import type { FormaPre } from '../types/domain';

/**
 * Forma do pré-teste de quem é o `ordem`-ésimo a aceitar o termo: A, B, A, B...
 * Alternar garante metades iguais, o que um sorteio não garante com cerca de 15 pessoas.
 * A mesma conta está no firestore.rules (`formaDoContador`). Mudou uma, muda a outra.
 */
export function formaDoParticipante(ordem: number): FormaPre {
    if (!Number.isInteger(ordem) || ordem < 1) throw new Error(`Ordem de aceite inválida: ${ordem}.`);
    return ordem % 2 === 1 ? 'A' : 'B';
}
