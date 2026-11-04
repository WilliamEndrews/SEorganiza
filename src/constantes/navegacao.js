import { DefaultTheme } from 'expo-router';

// Tema de navegação com fundo transparente. Por padrão cada tela do Stack
// pinta um fundo cinza-claro e esconde o que tem atrás (o vidro ou o degradê).
// Os layouts (principal) e (opcoes) usam este tema.
export const TEMA_NAVEGACAO_TRANSPARENTE = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};
