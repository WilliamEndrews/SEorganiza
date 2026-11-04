import { Animated } from 'react-native';

// Tempo, em milissegundos, que o menu e Configurações levam para entrar ou sair.
export const DURACAO_PAINEL = 280;

// Desliza um painel até `destino` (0 = aberto, 1 = fora da tela).
// useNativeDriver é false porque animamos `left`, e o driver nativo não faz isso.
// `aoTerminar` é opcional e só roda se a animação chegar ao fim.
export function animarPainel(valor, destino, aoTerminar) {
  Animated.timing(valor, {
    toValue: destino,
    duration: DURACAO_PAINEL,
    useNativeDriver: false,
  }).start(function (resultado) {
    if (resultado.finished && aoTerminar) aoTerminar();
  });
}
