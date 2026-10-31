import { act, render, screen } from '@testing-library/react-native';

import { ROTULO_QUADRANTE, formatarXp } from '@/constants/textos';
import { Colors } from '@/constants/theme';
import type { Quadrante } from '@/lib/quadrante';
import { escolherTema } from '@/lib/tema';

import { FeedbackQuestao } from '../feedback-questao';

// O veredito: o quadrante é a manchete e dá a cor do card; "Você acertou" ou "Você errou" e o XP
// vêm logo abaixo, em texto, para quem não distingue as cores.

const CASOS: { quadrante: Quadrante; correta: boolean; xp: number; cor: 'sucesso' | 'aviso' | 'lacuna' | 'erro'; fundo: string }[] = [
    { quadrante: 'firme', correta: true, xp: 3, cor: 'sucesso', fundo: 'fundoFirme' },
    { quadrante: 'fragil', correta: true, xp: 1, cor: 'aviso', fundo: 'fundoFragil' },
    { quadrante: 'lacuna', correta: false, xp: 0, cor: 'lacuna', fundo: 'fundoLacuna' },
    { quadrante: 'ponto_cego', correta: false, xp: -4, cor: 'erro', fundo: 'fundoPontoCego' },
];

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it.each(CASOS)('$quadrante: a manchete, a cor do card e o resultado em texto', async ({ quadrante, correta, xp, cor, fundo }) => {
        const cores = Colors[esquema];
        await render(
            <FeedbackQuestao
                feedback={{
                    correta,
                    xp,
                    corretaId: 'c',
                    quadrante,
                    explicacaoDaEscolha: 'Explicação da escolha.',
                    explicacaoDaCorreta: null,
                }}
            />,
        );

        expect(screen.getByTestId('feedback')).toHaveStyle({
            backgroundColor: cores[fundo as keyof typeof cores],
            borderColor: cores[cor],
            borderBottomColor: cores[cor],
        });
        expect(screen.getByText(ROTULO_QUADRANTE[quadrante])).toHaveStyle({ color: cores[cor], fontSize: 22 });
        expect(screen.getByText(correta ? 'Você acertou' : 'Você errou')).toBeOnTheScreen();
        expect(screen.getByText(formatarXp(xp))).toBeOnTheScreen();
        expect(screen.getByText('Explicação da escolha.')).toBeOnTheScreen();
    });
});
