import { act, render, screen } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { CampoTexto } from '../campo-texto';

// O campo é só uma linha embaixo, sem caixa. Em repouso a linha usa o texto secundário, que lê
// contra o fundo nos dois temas; com erro, a linha e a mensagem ficam na cor de erro.

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe.each([
    ['claro', Colors.light],
    ['escuro', Colors.dark],
] as const)('o campo de texto no tema %s', (tema, cores) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('não tem caixa: só a linha de baixo, em texto secundário, e o fundo transparente', async () => {
        await render(<CampoTexto rotulo="E-mail" value="" onChangeText={() => {}} />);

        expect(screen.getByLabelText('E-mail')).toHaveStyle({
            borderWidth: 0,
            borderBottomWidth: 1.5,
            borderBottomColor: cores.textSecondary,
            backgroundColor: 'transparent',
        });
    });

    it('com erro, a linha e a mensagem ficam na cor de erro', async () => {
        await render(<CampoTexto rotulo="E-mail" erro="Informe o e-mail." value="" onChangeText={() => {}} />);

        expect(screen.getByLabelText('E-mail')).toHaveStyle({ borderBottomColor: cores.erro });
        expect(screen.getByText('Informe o e-mail.')).toHaveStyle({ color: cores.erro });
    });

    it('o rótulo tem 13 de tamanho, em texto secundário', async () => {
        await render(<CampoTexto rotulo="E-mail" value="" onChangeText={() => {}} />);

        expect(screen.getByText('E-mail')).toHaveStyle({ fontSize: 13, color: cores.textSecondary });
    });

    it('com um botão à direita, o texto para antes dele', async () => {
        await render(
            <CampoTexto rotulo="Senha" value="" onChangeText={() => {}} aDireita={<></>} />,
        );

        expect(screen.getByLabelText('Senha')).toHaveStyle({ paddingRight: 48 });
    });
});
