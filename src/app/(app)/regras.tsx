import { TelaDeRegras } from '@/components/boas-vindas/tela-de-regras';
import { useVoltarOu } from '@/hooks/use-voltar-ou';

// As Regras do jogo: /regras.
export default function RegrasScreen() {
    const voltar = useVoltarOu('/');

    return <TelaDeRegras aoVoltar={voltar} />;
}
