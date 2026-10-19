import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Opcoes } from '@/components/opcoes';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { TEXTOS_DO_PERFIL } from '@/constants/textos';
import { useTheme } from '@/hooks/use-theme';
import { UFS } from '@/lib/perfil';
import type { Erro } from '@/lib/validacao';

type SeletorDeUfProps = {
    valor: string; // a sigla escolhida, ou '' antes da escolha
    aoEscolher: (uf: string) => void;
    erro?: Erro;
    desabilitado?: boolean;
};

// Na lista, as siglas vêm em ordem alfabética, para achar a do estado sem procurar.
const SIGLAS = [...UFS].sort().map((uf) => ({ valor: uf, rotulo: uf }));

// O estado do perfil: um campo que abre a lista das 27 siglas. Tocar numa sigla escolhe e fecha.
export function SeletorDeUf({ valor, aoEscolher, erro, desabilitado = false }: SeletorDeUfProps) {
    const theme = useTheme();
    const [aberto, setAberto] = useState(false);

    function escolher(uf: string | null) {
        if (uf) aoEscolher(uf);
        setAberto(false);
    }

    return (
        <View style={styles.container}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.rotulo}>
                {TEXTOS_DO_PERFIL.uf}
            </ThemedText>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${TEXTOS_DO_PERFIL.uf}, ${valor || TEXTOS_DO_PERFIL.escolhaOEstado.toLowerCase()}`}
                disabled={desabilitado}
                onPress={() => setAberto(true)}
                style={[styles.campo, { backgroundColor: theme.background, borderColor: erro ? theme.erro : theme.borda }]}>
                <ThemedText style={[styles.valor, !valor && { color: theme.textSecondary }]}>
                    {valor || TEXTOS_DO_PERFIL.escolhaOEstado}
                </ThemedText>
                <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
            </Pressable>
            {erro && (
                <ThemedText type="small" themeColor="erro">
                    {erro}
                </ThemedText>
            )}

            <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
                <Pressable style={styles.fundo} onPress={() => setAberto(false)} accessibilityLabel={TEXTOS_DO_PERFIL.fecharALista}>
                    <View style={[StyleSheet.absoluteFill, styles.veu, { backgroundColor: theme.veu }]} />
                    {/* O toque dentro do painel não fecha a lista: só fora dele. */}
                    <Pressable style={[styles.painel, { backgroundColor: theme.background }]} onPress={() => {}}>
                        <ScrollView contentContainerStyle={styles.lista}>
                            <Opcoes rotulo={TEXTOS_DO_PERFIL.uf} opcoes={SIGLAS} valor={valor || null} aoEscolher={escolher} />
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: Spacing.one },
    rotulo: { fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase' },
    campo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: Spacing.three,
        paddingVertical: 12,
    },
    valor: { fontSize: 16, fontFamily: Fonts.regular },
    fundo: { flex: 1, justifyContent: 'center', padding: Spacing.four },
    veu: { opacity: 0.4 },
    painel: { maxHeight: '80%', width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: 20 },
    lista: { padding: Spacing.four },
});
