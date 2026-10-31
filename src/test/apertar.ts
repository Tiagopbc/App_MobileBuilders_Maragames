import { fireEvent } from '@testing-library/react-native';

// Começa o gesto de toque. O Pressable só marca "apertado" (`pressed`) com o responderGrant, e
// não com o evento pressIn, que o `fireEvent` entrega direto ao `onPressIn`.
export function apertar(elemento: Parameters<typeof fireEvent>[0]) {
    fireEvent(elemento, 'responderGrant', {
        nativeEvent: { touches: [], changedTouches: [], target: 1, identifier: 1, timestamp: 0 },
        persist: () => {},
        currentTarget: 1,
        target: 1,
    });
}
