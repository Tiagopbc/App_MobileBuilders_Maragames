import type { Ionicons } from '@expo/vector-icons';

import type { IdDaMedalha } from '@/lib/conquistas';

// O ícone de cada medalha, o mesmo nas Conquistas e no aviso de medalha nova do fim da lição.
export const ICONE_DA_MEDALHA: Record<IdDaMedalha, keyof typeof Ionicons.glyphMap> = {
    primeira_licao: 'ribbon',
    tres_dias: 'flame',
    modulo_inteiro: 'layers-outline',
    revisao_em_dia: 'refresh-outline',
    ciclo_completo: 'sync-outline',
    cinco_licoes: 'albums-outline',
};
