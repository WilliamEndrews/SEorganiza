import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, ThemeProvider, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import {
  PAINEL_ALTURA,
  PAINEL_LARGURA,
  PAINEL_X,
  PAINEL_Y,
  TELA_ALTURA,
  TELA_LARGURA,
  vidro,
} from '../../constantes/figma';
import { temaDoModo } from '../../constantes/temas';
import { TEMA_NAVEGACAO_TRANSPARENTE } from '../../constantes/navegacao';
import { useOpcoes } from '../../contexto/OpcoesContext';
import { animarPainel } from '../../utilidades/animarPainel';
import PainelOpcoes from '../../menu/PainelOpcoes';

/*
 LAYOUT DO GRUPO (principal): a "moldura" das páginas principais.
*/



/* - Aqui no layout (fica PARADO): o degradê do fundo, o véu da noite, o sol ou a
  lua, o botão +, a barra de baixo e o menu de opções.
  Nas rotas (é o que vai DESLIZAR):
    index.js      -> "/"           título "Seja bem vindo" e tarefas
    calendario.js -> "/calendario" logo, calendário e tarefas

*/

/* Este código veio quase todo da TelaInicial: a única diferença é que, no lugar
 do título e do card, agora existe o "palco", onde o Stack desenha a rota atual*/

export const unstable_settings = {
  anchor: 'index',
};

export default function LayoutPrincipal() {
  /* O tema, o nome, as categorias e o menu aberto vêm do Context, porque as
 rotas de opções também leem e alteram esses valores.*/

  const {
    nomeUsuario,
    modoTema,
    categorias,
    adicionarCategoria,
    menuAberto: aberto,
    setMenuAberto: setAberto,
    alvoDesfoque,
    deslizeMenu: deslize,
    voltarAoInicio,
  } = useOpcoes();
  const tela = Dimensions.get('window');
  const tema = temaDoModo(modoTema);
  /* usePathname (Expo Router) devolve o endereço atual, por exemplo "/" ou
   "/calendario". Com ele a barra sabe qual aba está ativa.*/

  const noCalendario = usePathname() === '/calendario';
  const escalaX = tela.width / TELA_LARGURA;
  const escalaY = tela.height / TELA_ALTURA;
  const larguraPainel = PAINEL_LARGURA * escalaX;
  const alturaPainel = PAINEL_ALTURA * escalaY;
  const esquerdaPainel = PAINEL_X * escalaX;
  const topoPainel = PAINEL_Y * escalaY;

  /* O menu abre deslizando sempre que `aberto` vira true, venha a mudança daqui
   (botão da barra) ou do Context (voltar das opções). Quem fecha com animação
   (fecharMenu e entrarNasOpcoes) só muda `aberto` para false no fim.*/
   
  useEffect(
    function () {
      if (aberto) animarPainel(deslize, 0);
      else deslize.setValue(1);
    },
    [aberto, deslize]
  );

  // Para fechar com animação, `aberto` só vira false quando o menu já saiu.
  function fecharMenu() {
    animarPainel(deslize, 1, function () {
      setAberto(false);
    });
  }

  function alternarMenu() {
    if (aberto) fecharMenu();
    else setAberto(true);
  }

  const deslocamento = deslize.interpolate({
    inputRange: [0, 1],
    outputRange: [esquerdaPainel, tela.width],
  });

  return (
    <LinearGradient colors={tema.fundo} locations={tema.posicoes} style={styles.tela}>
      <BlurTargetView ref={alvoDesfoque} style={styles.alvo}>
        {tema.veu ? (
          <View style={[styles.veuTema, { backgroundColor: tema.veu }]} />
        ) : null}
        {/* Sol de dia, lua de noite. Fica atrás das páginas. */}
        <LinearGradient
          colors={tema.astro.cores}
          locations={tema.astro.posicoes}
          style={[styles.astro, { right: tema.astro.direita, top: tema.astro.topo }]}
        />

        {/* PALCO: a única parte da moldura que muda quando a rota muda.
            O <Stack> desenha aqui dentro a rota atual ("/" ou "/calendario").
             headerShown: false -> sem a barra de título padrão; cada página
              desenha o próprio topo, como no Figma.
             animation: 'none' -> o Router troca as rotas sem animação própria.
              Quem anima é o código, igual às opções.
             contentStyle e ThemeProvider transparentes -> as rotas não pintam
              fundo, então o degradê da moldura aparece atrás delas. */}
              


        <View style={styles.palco}>
          <ThemeProvider value={TEMA_NAVEGACAO_TRANSPARENTE}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'none',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="index" />

              {/* presentation 'containedTransparentModal':
                  - "Transparent": o Calendário abre POR CIMA da rota "/" sem
                    escondê-la. A página inicial continua desenhada por baixo, e
                    isso é necessário para as duas deslizarem ao mesmo tempo.
                  - "Contained": a tela fica presa ao palco. No iOS, sem isso, ela
                    cobriria a tela inteira, inclusive a barra de baixo. */}

              <Stack.Screen
                name="calendario"
                options={{ presentation: 'containedTransparentModal' }}
              />
            </Stack>
          </ThemeProvider>

          {/* O + fica na moldura porque está no mesmo lugar nas duas telas do
              Figma: assim ele não desliza junto com as páginas.
              pointerEvents 'box-none': a faixa invisível que centraliza o botão
              não rouba os toques; só o próprio botão recebe toque. */}

          <View style={styles.areaAdicionar}>
            <View style={styles.botaoAdicionar}>
              <View style={styles.anel}>
                <Text style={styles.mais}>+</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.rodape, { backgroundColor: tema.barra }]}>
          <View style={[styles.onda, { backgroundColor: tema.barra }]} />

          {/* Prancheta: volta para a página inicial.
              - disabled: na página inicial não há para onde voltar, então o
                botão não faz nada.
              - accessibilityState.selected: o leitor de tela anuncia qual aba
                está ativa. */}

          <Pressable
            style={styles.botaoBarra}
            onPress={voltarAoInicio}
            disabled={!noCalendario}
            accessibilityRole="button"
            accessibilityLabel="Tarefas"
            accessibilityState={{ selected: !noCalendario }}
          >
            <Ionicons name="clipboard-outline" size={26} color="#ffffff" />
          </Pressable>



          <Link href="/calendario" asChild>
            <Pressable
              style={StyleSheet.flatten(styles.botaoBarra)}
              accessibilityRole="button"
              accessibilityLabel="Calendário"
              accessibilityState={{ selected: noCalendario }}
            >
              <Ionicons name="calendar-outline" size={26} color="#ffffff" />
            </Pressable>
          </Link>
          <Pressable
            style={styles.botaoBarra}
            onPress={alternarMenu}
            accessibilityRole="button"
            accessibilityLabel={aberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <Ionicons name="menu" size={28} color="#ffffff" />
          </Pressable>
        </View>
      </BlurTargetView>

      {aberto ? (
        <Pressable
          style={styles.faixaFechar}
          onPress={fecharMenu}
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
        />
      ) : null}

      <Animated.View
        style={[
          styles.painel,
          vidro,
          {
            width: larguraPainel,
            height: alturaPainel,
            left: deslocamento,
            top: topoPainel,
            borderRadius: 22 * escalaX,
            pointerEvents: aberto ? 'auto' : 'none',
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.72)',
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0)',
          ]}
          locations={[0, 0.28, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.brilho, { pointerEvents: 'none' }]}
        />
        <PainelOpcoes
          escalaX={escalaX}
          escalaY={escalaY}
          nomeUsuario={nomeUsuario}
          categorias={categorias}
          aoAdicionarCategoria={adicionarCategoria}
        />
      </Animated.View>

      <StatusBar style={tema.barraDeStatus} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    overflow: 'hidden',
  },
  alvo: {
    flex: 1,
  },
  // Elipse do sol ou da lua.
  astro: {
    position: 'absolute',
    width: 161,
    height: 108,
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  
  veuTema: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  // O palco ocupa todo o espaço acima da barra de baixo (flex: 1), o mesmo
  // espaço que o antigo `conteudo` da TelaInicial ocupava.
  palco: {
    flex: 1,
  },
  /* Faixa da largura da tela, a 36 px da barra (a mesma distância de antes),
   que centraliza o botão +.*/

  areaAdicionar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  botaoAdicionar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anel: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mais: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 40,
  },
  /* As cores de rodape e onda são trocadas pelo tema em tempo de execução.
   Os valores do dia.*/
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#F4F7F8',
    paddingTop: 18,
    paddingBottom: 28,
  },
  onda: {
    position: 'absolute',
    top: -32,
    left: -40,
    right: -20,
    height: 64,
    backgroundColor: '#F4F7F8',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 160,
  },
  botaoBarra: {
    width: 50,
    height: 50,
    backgroundColor: '#0088FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faixaFechar: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  painel: {
    position: 'absolute',
    overflow: 'hidden',
  },
  brilho: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
