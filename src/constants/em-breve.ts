// Os módulos que ainda não têm questões: aparecem na lista de lições só com os títulos, para
// mostrar o que vem depois. A lista fica em content/em-breve.json, ao lado do conteúdo com questões.
import emBreve from '../../content/em-breve.json';

export type ModuloEmBreve = { modulo: string; licoes: string[] };

export const MODULOS_EM_BREVE: readonly ModuloEmBreve[] = emBreve;
