import { Redirect, useRouter } from 'expo-router';

import { TelaDoPerfil } from '@/components/perfil/tela-do-perfil';
import { useLicoes } from '@/hooks/use-licoes';
import { useRecarregarAoFocar } from '@/hooks/use-recarregar-ao-focar';
import { useVoltarOu } from '@/hooks/use-voltar-ou';
import { versaoDoApp } from '@/lib/aparelho';
import { licaoFeita } from '@/lib/licao';
import { useSession } from '@/lib/session';

// O Perfil (Fase 6 do plano): /perfil. É também onde fica o Sair, que saiu da home.
export default function PerfilScreen() {
    const { user, perfil, salvarPerfil, salvarExtras, redefinirSenha, sair } = useSession();
    const router = useRouter();
    const fechar = useVoltarOu('/home');

    // O XP e as lições feitas do cabeçalho são os da home: saem do mesmo hook, e não de outra conta.
    const formaPre = perfil?.formaPre ?? null;
    const { estado, recarregar } = useLicoes({ uid: user?.uid ?? '', formaPre });
    useRecarregarAoFocar(recarregar);

    if (!perfil) return <Redirect href="/home" />;

    // Enquanto as lições não chegam, ou se a leitura falha, o cabeçalho mostra só o apelido.
    const resumo =
        estado.tipo === 'pronto'
            ? { xp: estado.xp, feitas: estado.licoes.filter(licaoFeita).length, total: estado.licoes.length }
            : null;

    return (
        <TelaDoPerfil
            perfil={perfil}
            resumo={resumo}
            versao={versaoDoApp()}
            // Só o núcleo: o aceite de contato é gravado à parte, na seção Conta.
            aoSalvar={(dados) => salvarPerfil(dados)}
            // O link vai sempre para o e-mail da conta: aqui a pessoa já está dentro dela.
            aoRedefinirSenha={() => redefinirSenha(perfil.email)}
            aoMudarAceiteDeContato={(aceitaContato) => salvarExtras({ aceitaContato })}
            aoResponderSobreVoce={() => router.push('/sobre-voce')}
            aoLerOTermo={() => router.push('/termo')}
            aoSairDaConta={sair}
            aoSair={fechar}
        />
    );
}
