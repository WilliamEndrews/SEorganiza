import { Stack } from 'expo-router';
import { OpcoesProvider } from '../contexto/OpcoesContext';


export const unstable_settings = {
  anchor: '(principal)',
};

// O OpcoesProvider fica por fora para que todas as telas leiam o mesmo Context.
export default function LayoutRaiz() {
  return (
    <OpcoesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* (principal) é o grupo das páginas principais: "/" e "/calendario".
            O _layout.js dele desenha o fundo, a barra e o menu. */}
        <Stack.Screen name="(principal)" />
        
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
