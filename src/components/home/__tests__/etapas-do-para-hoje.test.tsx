import { act, render, screen, within } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import type { SegmentoDoParaHoje } from '@/lib/licao';
import { escolherTema } from '@/lib/tema';

import { EtapasDoParaHoje } from '../etapas-do-para-hoje';

// As barras de etapa do Para hoje: uma por etapa da lição, cada uma com o nome embaixo.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

const SEGMENTOS: SegmentoDoParaHoje[] = [
    { etapa: 'diagnostico', situacao: 'feito', progresso: null },
    { etapa: 'estudo', situacao: 'agora', progresso: { respondidas: 1, total: 4 } },
    { etapa: 'verificacao', situacao: 'depois', progresso: null },
    { etapa: 'revisao', situacao: 'selada', progresso: null },
];

describe('as etapas do Para hoje', () => {
    it('mostra o nome de cada etapa, com o progresso na da vez', async () => {
        await render(<EtapasDoParaHoje segmentos={SEGMENTOS} />);

        expect(screen.getByText('Diagnóstico')).toBeOnTheScreen();
        expect(screen.getByText('Cartão e prática 1/4')).toBeOnTheScreen();
        expect(screen.getByText('Verificação')).toBeOnTheScreen();
        expect(screen.getByText('Revisão')).toBeOnTheScreen();
    });

    it('o leitor de tela ouve a lista inteira de uma vez, com a situação de cada etapa', async () => {
        await render(<EtapasDoParaHoje segmentos={SEGMENTOS} />);

        expect(
            screen.getByLabelText('Etapas: Diagnóstico, feito. Cartão e prática 1/4, agora. Verificação, depois. Revisão, selada.')
        ).toBeOnTheScreen();
    });

    it('a etapa da vez enche na proporção do que já foi respondido', async () => {
        await render(<EtapasDoParaHoje segmentos={SEGMENTOS} />);

        expect(screen.getByTestId('preenchimento-estudo')).toHaveStyle({ width: '25%' });
    });

    it('a da vez, sem resposta ainda, fica vazia', async () => {
        const novo: SegmentoDoParaHoje[] = [{ etapa: 'diagnostico', situacao: 'agora', progresso: null }];
        await render(<EtapasDoParaHoje segmentos={novo} />);

        expect(screen.getByTestId('preenchimento-diagnostico')).toHaveStyle({ width: '0%' });
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    const cores = Colors[esquema];

    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('feita é cheia na cor de sucesso, a da vez enche na primária, depois é o trilho e a selada é tracejada', async () => {
        await render(<EtapasDoParaHoje segmentos={SEGMENTOS} />);

        expect(within(screen.getByTestId('etapa-diagnostico')).getByTestId('barra')).toHaveStyle({ backgroundColor: cores.sucesso });
        expect(screen.getByTestId('preenchimento-estudo')).toHaveStyle({ backgroundColor: cores.primaria });
        expect(within(screen.getByTestId('etapa-verificacao')).getByTestId('barra')).toHaveStyle({ backgroundColor: cores.borda });
        expect(within(screen.getByTestId('etapa-revisao')).getByTestId('barra')).toHaveStyle({ borderStyle: 'dashed' });
    });
});
