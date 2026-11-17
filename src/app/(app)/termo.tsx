import { TelaDeConsentimento } from '@/components/consentimento/tela-de-consentimento';
import { useVoltarOu } from '@/hooks/use-voltar-ou';

// O termo para reler, aberto pelo Perfil: /termo. Só mostra o texto; o aceite continua sendo
// o primeiro passo do primeiro diagnóstico, em /consentimento.
export default function TermoScreen() {
    const fechar = useVoltarOu('/perfil');

    return <TelaDeConsentimento somenteLeitura aoSair={fechar} />;
}
