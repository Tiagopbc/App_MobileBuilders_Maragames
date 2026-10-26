import { act, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { BotaoPrincipal } from '../botao-principal';
import { BotaoSecundario } from '../botao-secundario';

// No escuro, os botões ganham o relevo dos cards: o principal, uma borda de baixo roxa; o
// secundário vira o card roxo. No claro, ficam como antes.

async function abrir() {
    await render(
        <>
            <BotaoPrincipal rotulo="Próximo" onPress={() => {}} />
            <BotaoSecundario rotulo="Voltar" onPress={() => {}} />
        </>,
    );
    return {
        principal: screen.getByRole('button', { name: 'Próximo' }),
        secundario: screen.getByRole('button', { name: 'Voltar' }),
    };
}

afterEach(async () => {
    await act(() => escolherTema('sistema'));
});

describe('no tema escuro', () => {
    beforeEach(async () => {
        await act(() => escolherTema('escuro'));
    });

    it('o botão principal tem o relevo roxo embaixo', async () => {
        const { principal } = await abrir();

        expect(principal).toHaveStyle({ borderBottomWidth: 3.5, borderBottomColor: Colors.dark.relevoDoBotao });
    });

    // Violeta com halo: o degradê vai do violeta vivo, em cima, ao roxo profundo, embaixo.
    it('o botão principal tem o degradê violeta, a luz no topo e o halo', async () => {
        const { principal } = await abrir();
        const { botaoTopo, botaoMeio, botaoBase, haloDoBotao } = Colors.dark;

        expect(principal).toHaveStyle({
            backgroundImage: `linear-gradient(180deg, ${botaoTopo} 0%, ${botaoMeio} 55%, ${botaoBase} 100%)`,
        });
        expect(StyleSheet.flatten(principal.props.style).boxShadow).toMatch(/^inset /);
        expect(StyleSheet.flatten(principal.props.style).boxShadow).toContain(haloDoBotao);
    });

    it('o botão secundário é o card com degradê escuro e relevo', async () => {
        const { secundario } = await abrir();
        const { secundarioTopo, secundarioBase, bordaDoSecundario } = Colors.dark;

        expect(secundario).toHaveStyle({
            backgroundImage: `linear-gradient(180deg, ${secundarioTopo} 0%, ${secundarioBase} 100%)`,
            borderColor: bordaDoSecundario,
            borderBottomWidth: 5,
        });
    });
});

describe('no tema claro, como antes', () => {
    beforeEach(async () => {
        await act(() => escolherTema('claro'));
    });

    it('o botão principal não tem borda, degradê nem halo', async () => {
        const { principal } = await abrir();

        expect(principal).toHaveStyle({ borderBottomWidth: 0, backgroundColor: Colors.light.botao });
        expect(StyleSheet.flatten(principal.props.style).backgroundImage).toBeUndefined();
        expect(StyleSheet.flatten(principal.props.style).boxShadow).toBeUndefined();
    });

    it('o botão secundário é só contorno', async () => {
        const { secundario } = await abrir();

        expect(secundario).toHaveStyle({ borderColor: Colors.light.borda, borderBottomWidth: 1.5 });
        expect(secundario).not.toHaveStyle({ backgroundColor: Colors.light.cartao });
    });
});
