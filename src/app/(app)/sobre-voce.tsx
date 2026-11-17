import { Redirect } from 'expo-router';

import { TelaSobreVoce } from '@/components/perfil/tela-sobre-voce';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { useSession } from '@/lib/session';

// As perguntas opcionais do perfil (item 34): /sobre-voce, aberta pelo cartão do Perfil.
export default function SobreVoceScreen() {
    const { perfil, salvarExtras } = useSession();
    const fechar = useVoltarOu('/perfil');

    if (!perfil) return <Redirect href="/home" />;

    return <TelaSobreVoce inicial={perfil} aoSalvar={salvarExtras} aoSair={fechar} />;
}
