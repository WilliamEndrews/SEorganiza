import { Animated } from 'react-native';

// Tempo, em milissegundos, que o menu e Configurações levam para entrar ou sair.
export const DURACAO_PAINEL = 280;

// Desliza um painel até `destino` (0 = aberto, 1 = fora da tela).
// useNativeDriver fica false porque os painéis animam `left`, e o driver nativo
// não anima essa propriedade.
// `aoTerminar` é opcional e só roda se a animação chegar ao fim (não roda se
// outra animação a interromper no meio).
export function animarPainel(valor, destino, aoTerminar) {
  Animated.timing(valor, {
    toValue: destino,
    duration: DURACAO_PAINEL,
    useNativeDriver: false,
  }).start(function (resultado) {
    if (resultado.finished && aoTerminar) aoTerminar();
  });
}
