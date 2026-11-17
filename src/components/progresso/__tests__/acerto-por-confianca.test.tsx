import { render, screen } from '@testing-library/react-native';

import { AcertoPorConfianca } from '../acerto-por-confianca';

describe('AcertoPorConfianca', () => {
    it('mostra o título e o acerto de cada nível, lido junto pelo leitor de tela', async () => {
        await render(
            <AcertoPorConfianca
                porConfianca={{ 1: { acertos: 1, total: 2 }, 2: { acertos: 0, total: 0 }, 3: { acertos: 3, total: 3 } }}
            />
        );

        expect(screen.getByText('Acerto por confiança')).toBeOnTheScreen();
        expect(screen.getByLabelText('Palpite: 1 de 2')).toBeOnTheScreen();
        expect(screen.getByLabelText('Tenho dúvida: sem respostas')).toBeOnTheScreen();
        expect(screen.getByLabelText('Tenho certeza: 3 de 3')).toBeOnTheScreen();
    });
});
