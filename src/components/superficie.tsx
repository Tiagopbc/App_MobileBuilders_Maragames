import { Pressable, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { Raio } from '@/constants/theme';
import { useRelevo, useTheme } from '@/hooks/use-theme';

// O card das telas é um só, o mesmo da prática: o fundo e o contorno do cartão e a borda de baixo
// grossa, na cor do relevo. O raio é o do card (16); o grande (20) é o do login, e o pequeno (12)
// o dos itens dentro de uma explicação. Espaçamento e alinhamento vêm do estilo de quem usa.
type Tamanho = 'pequeno' | 'padrao' | 'grande';

const RAIO: Record<Tamanho, number> = { pequeno: Raio.medio, padrao: Raio.card, grande: 20 };

type SuperficieProps = ViewProps & { tamanho?: Tamanho };

function useEstiloDaSuperficie(tamanho: Tamanho): ViewStyle {
    const theme = useTheme();
    const relevo = useRelevo();

    return {
        backgroundColor: theme.cartao,
        borderColor: theme.bordaDoCartao,
        borderWidth: 1.5,
        borderBottomColor: theme.relevoDoCartao,
        borderBottomWidth: 1.5 + relevo.espessura,
        borderRadius: RAIO[tamanho],
    };
}

export function Superficie({ tamanho = 'padrao', style, ...rest }: SuperficieProps) {
    const base = useEstiloDaSuperficie(tamanho);

    return <View style={[base, style]} {...rest} />;
}

type SuperficieQueLevaToqueProps = Omit<PressableProps, 'style'> & {
    tamanho?: Tamanho;
    style?: StyleProp<ViewStyle> | ((estado: { pressed: boolean }) => StyleProp<ViewStyle>);
};

// Apertado, o card perde o relevo e desce, como a alternativa escolhida; a margem de baixo
// devolve o que sobra, para a lista não pular. Nada de opacidade.
export function SuperficieQueLevaToque({ tamanho = 'padrao', style, ...rest }: SuperficieQueLevaToqueProps) {
    const base = useEstiloDaSuperficie(tamanho);
    const relevo = useRelevo();

    return (
        <Pressable
            style={({ pressed }) => [
                base,
                { opacity: 1 },
                pressed
                    ? { borderBottomWidth: 1.5, marginTop: relevo.afunda, marginBottom: relevo.espessura - relevo.afunda }
                    : { marginTop: 0, marginBottom: 0 },
                typeof style === 'function' ? style({ pressed }) : style,
            ]}
            {...rest}
        />
    );
}
