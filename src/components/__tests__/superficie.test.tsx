import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Colors, Raio, Relevo } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';
import { apertar } from '@/test/apertar';

import { Superficie, SuperficieQueLevaToque } from '../superficie';

// O card único das telas: o mesmo da prática. Fundo e contorno do cartão, borda de baixo grossa
// com a cor do relevo e, se leva toque, desce ao ser apertado em vez de perder opacidade.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    const cores = Colors[esquema];
    const relevo = Relevo[esquema];

    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('o card parado tem o fundo do cartão, o contorno e o relevo embaixo', async () => {
        await render(<Superficie testID="card" />);

        expect(screen.getByTestId('card')).toHaveStyle({
            backgroundColor: cores.cartao,
            borderColor: cores.bordaDoCartao,
            borderWidth: 1.5,
            borderBottomColor: cores.relevoDoCartao,
            borderBottomWidth: 1.5 + relevo.espessura,
            borderRadius: Raio.card,
        });
    });

    it('o tamanho muda só o raio: 12, 16 (padrão) e 20', async () => {
        await render(
            <>
                <Superficie testID="pequeno" tamanho="pequeno" />
                <Superficie testID="padrao" />
                <Superficie testID="grande" tamanho="grande" />
            </>,
        );

        expect(screen.getByTestId('pequeno')).toHaveStyle({ borderRadius: 12 });
        expect(screen.getByTestId('padrao')).toHaveStyle({ borderRadius: 16 });
        expect(screen.getByTestId('grande')).toHaveStyle({ borderRadius: 20 });
    });

    it('o estilo de quem usa vem por cima: o espaçamento e o alinhamento', async () => {
        await render(<Superficie testID="card" style={{ padding: 16, alignItems: 'center' }} />);

        expect(screen.getByTestId('card')).toHaveStyle({ padding: 16, alignItems: 'center' });
    });

    it('o card que leva toque, parado, tem o mesmo relevo do card parado', async () => {
        await render(<SuperficieQueLevaToque testID="card" onPress={() => {}} />);

        expect(screen.getByTestId('card')).toHaveStyle({
            backgroundColor: cores.cartao,
            borderBottomColor: cores.relevoDoCartao,
            borderBottomWidth: 1.5 + relevo.espessura,
            marginTop: 0,
            opacity: 1,
        });
    });

    it('apertado, desce e perde o relevo, sem opacidade, e a lista não pula', async () => {
        await render(<SuperficieQueLevaToque testID="card" onPress={() => {}} />);

        await act(() => apertar(screen.getByTestId('card')));

        expect(screen.getByTestId('card')).toHaveStyle({
            borderBottomWidth: 1.5,
            marginTop: relevo.afunda,
            marginBottom: relevo.espessura - relevo.afunda,
            opacity: 1,
        });
    });

    it('aceita o estilo como função, como o Pressable, e repassa o que o leitor de tela usa', async () => {
        await render(
            <SuperficieQueLevaToque
                accessibilityRole="button"
                accessibilityLabel="Abrir lição"
                onPress={() => {}}
                style={({ pressed }) => ({ gap: pressed ? 2 : 8 })}>
                <Text>Lição</Text>
            </SuperficieQueLevaToque>,
        );

        expect(screen.getByRole('button', { name: 'Abrir lição' })).toHaveStyle({ gap: 8 });
    });
});
