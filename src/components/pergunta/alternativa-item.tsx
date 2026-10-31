import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { TextoComCodigo } from '@/components/texto-com-codigo';
import { ThemedText } from '@/components/themed-text';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

// Antes de confirmar só existem 'normal' e 'selecionada'. 'certa', 'errada' e 'apagada'
// aparecem no feedback da prática, nunca nos blocos medidos.
export type EstadoDaAlternativa = 'normal' | 'selecionada' | 'certa' | 'errada' | 'apagada';

// Como cada estado aparece: o fundo do card, a cor da borda e do quadrado da letra e, no
// feedback, um ícone.
type Aparencia = { fundo: ThemeColor; cor: ThemeColor | null; icone: keyof typeof Ionicons.glyphMap | null };

// O estado é dito por forma e por cor: a selecionada ganha borda e quadrado cheios; certa e
// errada ganham também um ícone, para quem não distingue verde de vermelho.
const APARENCIA: Record<EstadoDaAlternativa, Aparencia> = {
    normal: { fundo: 'cartao', cor: null, icone: null },
    selecionada: { fundo: 'cartaoSelecionado', cor: 'bordaSelecionada', icone: null },
    certa: { fundo: 'fundoCerta', cor: 'sucesso', icone: 'checkmark-circle' },
    errada: { fundo: 'fundoErrada', cor: 'erro', icone: 'close-circle' },
    apagada: { fundo: 'fundoApagado', cor: null, icone: null },
};

type AlternativaItemProps = {
    letra: string; // posição na tela (A, B, C, D), não o id da alternativa
    texto: string;
    estado: EstadoDaAlternativa;
    marcada: boolean; // é a escolha do aluno, antes ou depois de confirmar
    desabilitada: boolean;
    onPress: () => void;
};

export function AlternativaItem({ letra, texto, estado, marcada, desabilitada, onPress }: AlternativaItemProps) {
    const theme = useTheme();
    const relevo = useRelevo();
    const { fundo, cor, icone } = APARENCIA[estado];
    const selecionada = estado === 'selecionada';
    const apagada = estado === 'apagada';

    return (
        <Pressable
            accessibilityRole="radio"
            accessibilityLabel={`${letra}. ${texto.replaceAll('`', '')}`}
            aria-checked={marcada}
            disabled={desabilitada}
            onPress={onPress}
            style={({ pressed }) => [
                styles.item,
                {
                    backgroundColor: theme[fundo],
                    borderColor: cor ? theme[cor] : theme.bordaDoCartao,
                    opacity: apagada ? 1 : pressed ? 0.7 : 1,
                },
                // A escolhida fica "apertada": perde o relevo e desce. A margem de baixo devolve
                // o que sobra, para a lista não pular. A apagada é chapada: perde o relevo sem
                // descer, e o texto passa para o de apoio, em vez de desbotar com opacidade. O
                // relevo embaixo tem cor própria; certa e errada mantêm a cor do próprio estado.
                selecionada
                    ? { borderBottomWidth: 1.5, marginTop: relevo.afunda, marginBottom: relevo.espessura - relevo.afunda }
                    : apagada
                      ? { borderBottomWidth: 1.5, marginTop: 0, marginBottom: relevo.espessura }
                      : {
                            borderBottomWidth: 1.5 + relevo.espessura,
                            borderBottomColor: cor ? theme[cor] : theme.relevoDoCartao,
                            marginTop: 0,
                            marginBottom: 0,
                        },
            ]}>
            <View
                style={[
                    styles.letra,
                    // Selecionada: o roxo do botão. Certa e errada: a cor do próprio estado.
                    { backgroundColor: selecionada ? theme.botao : cor ? theme[cor] : theme.fundoDaLetra },
                    !cor && { borderWidth: 1.5, borderColor: theme.bordaDoCartao },
                ]}>
                <ThemedText
                    type="smallBold"
                    // Sobre a cor de estado, a letra usa a cor do fundo da tela: é o par que o
                    // teste de contraste confere, nos dois temas.
                    themeColor={selecionada ? 'textoDoBotao' : cor ? 'background' : 'textoDaLetra'}>
                    {letra}
                </ThemedText>
            </View>
            <View style={styles.texto}>
                <TextoComCodigo themeColor={apagada ? 'textSecondary' : undefined}>{texto}</TextoComCodigo>
            </View>
            {icone && cor && <Ionicons name={icone} size={22} color={theme[cor]} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three,
        minHeight: 56,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    letra: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    texto: { flex: 1 },
});
