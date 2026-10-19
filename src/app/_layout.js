import { Stack } from 'expo-router';
import { OpcoesProvider } from '../contexto/OpcoesContext';

// Se alguém abrir um endereço de opções direto (por exemplo /configuracoes/temas),
// a tela inicial entra na pilha antes, para continuar visível atrás do vidro.
export const unstable_settings = {
  anchor: 'index',
};

// Layout raiz: o Stack empilha as telas. O cabeçalho padrão fica escondido
// porque cada tela desenha o próprio título, como no Figma.
// O OpcoesProvider fica por fora para que todas as telas leiam o mesmo Context.
export default function LayoutRaiz() {
  return (
    <OpcoesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* As opções abrem por cima da tela inicial, sem esconder o que fica atrás.
            O vidro desliza sozinho, por isso a troca de tela não tem animação. */}
        <Stack.Screen
          name="(opcoes)"
          options={{
            presentation: 'transparentModal',
            animation: 'none',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
    </OpcoesProvider>
  );
}
