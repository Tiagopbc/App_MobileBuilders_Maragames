import { render, screen, userEvent } from '@testing-library/react-native';

import { Carregando, ErroAoCarregar } from '../estado-da-carga';

describe('Carregando', () => {
    it('mostra o indicador no centro', async () => {
        await render(<Carregando />);

        expect(screen.getByTestId('carregando')).toBeOnTheScreen();
    });

    it('leva o rótulo dado para o leitor de tela', async () => {
        await render(<Carregando rotulo="Abrindo a prática" />);

        expect(screen.getByLabelText('Abrindo a prática')).toBeOnTheScreen();
    });
});

describe('ErroAoCarregar', () => {
    it('mostra a mensagem e o "Tentar de novo" chama a nova tentativa', async () => {
        const aoTentarDeNovo = jest.fn();
        await render(<ErroAoCarregar mensagem="Não foi possível carregar." aoTentarDeNovo={aoTentarDeNovo} />);

        expect(screen.getByText('Não foi possível carregar.')).toBeOnTheScreen();
        await userEvent.setup().press(screen.getByRole('button', { name: 'Tentar de novo' }));
        expect(aoTentarDeNovo).toHaveBeenCalledTimes(1);
    });
});
