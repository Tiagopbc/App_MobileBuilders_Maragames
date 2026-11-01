import { useNetInfo } from '@react-native-community/netinfo';
import { act, render, screen } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { escolherTema } from '@/lib/tema';

import { FaixaSemConexao } from '../faixa-sem-conexao';

// A faixa de aviso do alto da pergunta, quando o aparelho perde a rede. Só diz o que é verdade:
// as escolhas continuam marcadas. Não promete fila offline.

const rede = useNetInfo as jest.Mock;

afterEach(async () => {
    rede.mockReturnValue({ isConnected: true });
    await act(() => escolherTema('sistema'));
});

describe('a faixa sem conexão', () => {
    it('com rede, não aparece', async () => {
        rede.mockReturnValue({ isConnected: true });
        await render(<FaixaSemConexao />);

        expect(screen.queryByText(/Sem conexão/)).toBeNull();
    });

    it('sem rede, avisa e diz que as escolhas continuam marcadas', async () => {
        rede.mockReturnValue({ isConnected: false });
        await render(<FaixaSemConexao />);

        expect(screen.getByText('Sem conexão. Suas escolhas continuam marcadas.')).toBeOnTheScreen();
    });

    it('enquanto o estado da rede é desconhecido, não assusta: não aparece', async () => {
        rede.mockReturnValue({ isConnected: null });
        await render(<FaixaSemConexao />);

        expect(screen.queryByText(/Sem conexão/)).toBeNull();
    });

    it('é um aviso que o leitor de tela anuncia quando aparece', async () => {
        rede.mockReturnValue({ isConnected: false });
        await render(<FaixaSemConexao />);

        expect(screen.getByRole('alert')).toBeOnTheScreen();
    });

    it('aparece e some quando a rede vai e volta', async () => {
        rede.mockReturnValue({ isConnected: true });
        const { rerender } = await render(<FaixaSemConexao />);

        rede.mockReturnValue({ isConnected: false });
        await rerender(<FaixaSemConexao />);
        expect(screen.getByText(/Sem conexão/)).toBeOnTheScreen();

        rede.mockReturnValue({ isConnected: true });
        await rerender(<FaixaSemConexao />);
        expect(screen.queryByText(/Sem conexão/)).toBeNull();
    });
});

describe.each([
    ['claro', 'light'],
    ['escuro', 'dark'],
] as const)('no tema %s', (tema, esquema) => {
    beforeEach(async () => {
        await act(() => escolherTema(tema));
    });

    it('tem o fundo e o contorno de aviso', async () => {
        rede.mockReturnValue({ isConnected: false });
        await render(<FaixaSemConexao />);

        expect(screen.getByRole('alert')).toHaveStyle({
            backgroundColor: Colors[esquema].fundoFragil,
            borderColor: Colors[esquema].aviso,
        });
    });
});
