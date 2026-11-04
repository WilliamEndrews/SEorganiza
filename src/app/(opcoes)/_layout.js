import { useEffect } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Stack, ThemeProvider } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  CONFIG_ALTURA,
  CONFIG_LARGURA,
  CONFIG_X,
  CONFIG_Y,
  TELA_ALTURA,
  TELA_LARGURA,
} from '../../constantes/figma';
import { TEMA_NAVEGACAO_TRANSPARENTE } from '../../constantes/navegacao';
import { useOpcoes } from '../../contexto/OpcoesContext';

// Se abrir direto algo como /configuracoes/temas, a lista de Configurações
// entra antes na pilha, para o Voltar levar até ela.
export const unstable_settings = {
  anchor: 'configuracoes/index',
};

// Painel de vidro de todas as telas de opções (Configurações, categorias e
// tarefas). Fica por cima da tela inicial, e o Stack de dentro troca só o
// conteúdo do vidro.
export default function LayoutOpcoes() {
  const { entrarNasOpcoes, voltarAoMenu, alvoDesfoque, deslizeConfig } = useOpcoes();
  const tela = useWindowDimensions();
  const escalaX = tela.width / TELA_LARGURA;
  const escalaY = tela.height / TELA_ALTURA;
  const esquerdaConfig = CONFIG_X * escalaX;
  const deslocamentoConfig = deslizeConfig.interpolate({
    inputRange: [0, 1],
    outputRange: [esquerdaConfig, tela.width],
  });

  // Quando abre, o menu sai e o vidro desliza para dentro.
  // A lista vazia [] faz isso rodar uma vez só. O return roda quando fecha
  // (até pelo Voltar do Android) e deixa o vidro fora da tela para a próxima vez.
  useEffect(function () {
    entrarNasOpcoes();
    return function () {
      deslizeConfig.setValue(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.tela}>
      <Pressable
        style={styles.faixaFechar}
        onPress={voltarAoMenu}
        accessibilityRole="button"
        accessibilityLabel="Fechar Configurações"
      />

      <Animated.View
        style={[
          styles.painel,
          {
            width: CONFIG_LARGURA * escalaX,
            height: CONFIG_ALTURA * escalaY,
            left: deslocamentoConfig,
            top: CONFIG_Y * escalaY,
            borderRadius: 28 * escalaX,
          },
        ]}
      >
        <BlurView
          blurTarget={alvoDesfoque}
          intensity={80}
          tint="dark"
          blurMethod="dimezisBlurViewSdk31Plus"
          style={styles.vidroConfig}
        >
          <View style={styles.veuConfig} />
          <View style={styles.veuConfig} />
          <LinearGradient
            colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.65, y: 1 }}
            style={[styles.brilho, { pointerEvents: 'none' }]}
          />
          {/* Tema com fundo transparente para o vidro aparecer atrás das telas. */}
          <ThemeProvider value={TEMA_NAVEGACAO_TRANSPARENTE}>
            <Stack
              id={undefined}
              screenOptions={{
                headerShown: false,
                animation: 'none',
                contentStyle: { backgroundColor: 'transparent' },
              }}
              screenLayout={RolagemConfig}
            />
          </ThemeProvider>
        </BlurView>
      </Animated.View>
    </View>
  );
}

// Rotas com FlatList já rolam sozinhas (aula 02). FlatList dentro de ScrollView
// dá aviso no console, então essas ficam de fora.
const ROTAS_COM_LISTA = ['categoria/[id]', 'tarefas/concluidas', 'tarefas/excluidas'];

// As outras rotas ganham uma ScrollView, para dar para rolar quando a letra do
// celular está grande e a página não cabe no painel.
function RolagemConfig({ route, children }) {
  if (ROTAS_COM_LISTA.includes(route.name)) {
    return <View style={styles.tela}>{children}</View>;
  }
  return (
    <ScrollView contentContainerStyle={styles.rolagemConfig} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  faixaFechar: {
    ...StyleSheet.absoluteFill,
  },
  painel: {
    position: 'absolute',
    overflow: 'hidden',
  },
  vidroConfig: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  // Preto a 45%. No Figma são dois retângulos assim, um em cima do outro,
  // por isso o véu aparece duas vezes no painel.
  veuConfig: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  brilho: {
    ...StyleSheet.absoluteFill,
  },
  // flexGrow faz o conteúdo ocupar o painel todo. O padding embaixo evita que
  // o último item encoste na borda.
  rolagemConfig: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
