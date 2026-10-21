import { DefaultTheme } from 'expo-router';

// Tema de navegação com o fundo transparente.

export const TEMA_NAVEGACAO_TRANSPARENTE = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};
