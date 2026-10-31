import { act, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { BotaoPrincipal } from '../botao-principal';
import { BotaoSecundario } from '../botao-secundario';

// Os botões têm o relevo dos cards nos dois temas: o principal, uma borda de baixo roxa e o degradê;
// o secundário vira o card. Desativado, o botão tem cor própria, e nunca opacidade.

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

describe('no tema claro', () => {
    beforeEach(async () => {
        await act(() => escolherTema('claro'));
    });

    it('o botão principal tem o degradê do roxo vivo ao roxo da marca e o relevo embaixo', async () => {
        const { principal } = await abrir();
        const { botaoTopo, botaoMeio, botaoBase, relevoDoBotao } = Colors.light;

        expect(principal).toHaveStyle({
            borderBottomWidth: 2.5,
            borderBottomColor: relevoDoBotao,
            backgroundImage: `linear-gradient(180deg, ${botaoTopo} 0%, ${botaoMeio} 55%, ${botaoBase} 100%)`,
        });
        expect(StyleSheet.flatten(principal.props.style).boxShadow).toMatch(/^inset /);
    });

    it('o botão secundário é o card branco, com o relevo lilás embaixo', async () => {
        const { secundario } = await abrir();

        expect(secundario).toHaveStyle({
            borderColor: Colors.light.bordaDoSecundario,
            borderBottomColor: Colors.light.relevoDoSecundario,
            borderBottomWidth: 4,
        });
    });
});

describe.each([
    ['claro', Colors.light],
    ['escuro', Colors.dark],
] as const)('botões desativados no tema %s', (tema, cores) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    async function abrirDesativados() {
        await render(
            <>
                <BotaoPrincipal rotulo="Próximo" onPress={() => {}} desabilitado />
                <BotaoSecundario rotulo="Voltar" onPress={() => {}} desabilitado />
            </>,
        );
        return {
            principal: screen.getByRole('button', { name: 'Próximo' }),
            secundario: screen.getByRole('button', { name: 'Voltar' }),
        };
    }

    it('o principal usa a cor de botão desativado, sem opacidade, degradê, halo nem relevo', async () => {
        const { principal } = await abrirDesativados();
        const estilo = StyleSheet.flatten(principal.props.style);

        expect(principal).toHaveStyle({ backgroundColor: cores.botaoDesabilitado, borderBottomWidth: 0 });
        expect(estilo.opacity).toBe(1);
        expect(estilo.backgroundImage).toBeUndefined();
        expect(estilo.boxShadow).toBeUndefined();
        expect(screen.getByText('Próximo')).toHaveStyle({ color: cores.textSecondary });
    });

    it('o secundário também usa a cor de botão desativado, sem opacidade nem degradê', async () => {
        const { secundario } = await abrirDesativados();
        const estilo = StyleSheet.flatten(secundario.props.style);

        expect(secundario).toHaveStyle({ backgroundColor: cores.botaoDesabilitado });
        expect(estilo.opacity).toBe(1);
        expect(estilo.backgroundImage).toBeUndefined();
        expect(screen.getByText('Voltar')).toHaveStyle({ color: cores.textSecondary });
    });
});
