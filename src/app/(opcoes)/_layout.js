import { useEffect } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
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
import { useOpcoes } from '../../contexto/OpcoesContext';

// Se alguém abrir um endereço como /configuracoes/temas direto, a lista de
// Configurações entra na pilha antes. Assim, Voltar leva para a lista.
export const unstable_settings = {
  anchor: 'configuracoes/index',
};

const TEMA_TRANSPARENTE = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

// Moldura de vidro comum a todas as rotas de opções (Configurações, categorias e
// tarefas). As listas usam a mesma posição e o mesmo tamanho de Configurações. Ela fica sobre a tela inicial, que continua desenhada por baixo.
// O Stack de dentro troca só o conteúdo do vidro, sem animação própria.
export default function LayoutOpcoes() {
  const { entrarNasOpcoes, voltarAoMenu, alvoDesfoque, deslizeConfig } = useOpcoes();
  const tela = Dimensions.get('window');
  const escalaX = tela.width / TELA_LARGURA;
  const escalaY = tela.height / TELA_ALTURA;
  const esquerdaConfig = CONFIG_X * escalaX;
  const deslocamentoConfig = deslizeConfig.interpolate({
    inputRange: [0, 1],
    outputRange: [esquerdaConfig, tela.width],
  });

  // Ao entrar nas opções, o menu (se estiver aberto) sai primeiro e depois o vidro
  // entra. A tela inicial continua visível atrás, então a saída do menu aparece.
  // Ao sair por outro caminho (como o Voltar do Android), o vidro fica pronto,
  // fora da tela, para a próxima entrada.
  // A lista vazia faz isto rodar só na entrada. entrarNasOpcoes é recriada a cada
  // desenho do Provider; colocá-la na lista repetiria a animação a cada mudança.
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
          {/* Cada tela da pilha pinta o fundo com a cor do tema. Aqui o fundo do tema
              fica transparente para o vidro aparecer atrás das páginas. */}
          <ThemeProvider value={TEMA_TRANSPARENTE}>
            <Stack
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

// Rotas que já rolam sozinhas, porque a lista delas é uma FlatList. Uma FlatList
// dentro de uma ScrollView perde a vantagem de desenhar só o que aparece, e o
// React Native avisa disso no console.
const ROTAS_COM_LISTA = ['categoria/[id]', 'tarefas/concluidas', 'tarefas/excluidas'];

// As outras rotas de opções ficam dentro de uma ScrollView.
// Com letra grande, a página pode ficar maior que o painel e, assim, dá para rolar.
// Com letra normal, o conteúdo cabe e nada rola.
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
  // Preenchimento pedido: #000000 a 45%.
  // O Figma tem dois retângulos empilhados (Rectangle 16 e Rectangle 21).
  // Duas camadas de 45% dão cerca de 70% de preto (1 - 0,55 × 0,55).
  // Conferi na imagem: o painel sobre o fundo claro mede perto de #3C4E54,
  // que combina com 70%. Por isso o véu aparece duas vezes no painel.
  // O gelo 12 do Figma não usa a mesma escala do Expo (1 a 100).
  // Refração, dispersão e splay não existem no Expo.
  veuConfig: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  brilho: {
    ...StyleSheet.absoluteFill,
  },
  // Rolagem do painel: flexGrow faz o conteúdo ocupar o painel todo quando cabe.
  // O respiro embaixo evita que o último item encoste na borda ao rolar.
  rolagemConfig: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
