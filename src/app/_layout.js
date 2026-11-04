import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Jaro_400Regular } from '@expo-google-fonts/jaro';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { JuliusSansOne_400Regular } from '@expo-google-fonts/julius-sans-one';
import { ContaProvider, useConta } from '../contexto/ContaContext';
import { OpcoesProvider } from '../contexto/OpcoesContext';
import {
  FONTE_DESTAQUE_CONTA,
  FONTE_LINK_CONTA,
  FONTE_TITULO_CONTA,
} from '../constantes/figma';

// Se abrir direto um endereço de opções, a tela inicial entra antes na pilha,
// para continuar aparecendo atrás do vidro.
export const unstable_settings = {
  anchor: '(principal)',
};

// Layout raiz: os Providers ficam por fora para todas as telas usarem os
// mesmos Contexts (aula 03).
export default function LayoutRaiz() {
  // Fontes do Login e do Cadastro. O nome à esquerda é o que vai no fontFamily.
  const [fontesProntas, erroFontes] = useFonts({
    [FONTE_TITULO_CONTA]: Jaro_400Regular,
    [FONTE_LINK_CONTA]: JetBrainsMono_400Regular,
    [FONTE_DESTAQUE_CONTA]: JuliusSansOne_400Regular,
  });

  // Espera as fontes carregarem (é rápido). Se der erro, segue com a fonte do
  // sistema para não travar.
  if (!fontesProntas && !erroFontes) {
    return null;
  }

  // ContaProvider por fora: o OpcoesProvider precisa saber quem está logado.
  return (
    <ContaProvider>
      <OpcoesProvider>
        <PilhaDeTelas />
      </OpcoesProvider>
    </ContaProvider>
  );
}

// Fica separado porque useConta só funciona dentro do ContaProvider.
function PilhaDeTelas() {
  const { emailLogado, carregandoConta } = useConta();

  // Espera ler a sessão salva. Sem isso, o Login pisca para quem já entrou.
  if (carregandoConta) {
    return null;
  }

  const logado = emailLogado !== null;

  return (
    // id={undefined} só existe porque a checagem de tipos do SDK 58 pede.
    // No app não muda nada (vale para os outros Stacks também).
    <Stack id={undefined} screenOptions={{ headerShown: false }}>
      {/* Stack.Protected: as telas de dentro só existem quando guard é true.
          Logado vê o app, deslogado vê só Login e Cadastro. */}
      <Stack.Protected guard={logado} redirectTo="/login">
        {/* Páginas principais: "/" e "/calendario". */}
        <Stack.Screen name="(principal)" />
        {/* As opções abrem por cima da tela inicial. O vidro já tem a própria
            animação, por isso animation: 'none'. */}
        <Stack.Screen
          name="(opcoes)"
          options={{
            presentation: 'transparentModal',
            animation: 'none',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack.Protected>
      {/* Login e Cadastro: só para quem ainda não entrou. */}
      <Stack.Protected guard={!logado}>
        <Stack.Screen name="(conta)" />
      </Stack.Protected>
    </Stack>
  );
}
