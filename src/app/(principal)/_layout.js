import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
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
import BolhaNovaTarefa from '../../inicio/BolhaNovaTarefa';
import { dataDeHoje } from '../../utilidades/ajudantes';

// Layout do grupo (principal) (aula 03 - Expo Router).
// Tudo o que fica aqui aparece nas duas rotas e fica parado: fundo, sol/lua,
// botão +, barra de baixo e menu. Só o "palco" muda: é onde o Stack desenha
// a rota atual ("/" ou "/calendario"), que é a parte que desliza.

// Se abrirem /calendario direto (link ou F5), a rota "/" entra por baixo.
// Assim a prancheta sempre tem para onde voltar.
export const unstable_settings = {
  anchor: 'index',
};

export default function LayoutPrincipal() {
  // Vem do Context porque as telas de opções também usam esses valores.
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
    adicionarTarefa,
    diaSelecionado,
  } = useOpcoes();
  const tela = Dimensions.get('window');
  const tema = temaDoModo(modoTema);
  // usePathname dá o endereço atual. Serve para saber qual aba está ativa.
  const noCalendario = usePathname() === '/calendario';
  const escalaX = tela.width / TELA_LARGURA;
  const escalaY = tela.height / TELA_ALTURA;
  const larguraPainel = PAINEL_LARGURA * escalaX;
  const alturaPainel = PAINEL_ALTURA * escalaY;
  const esquerdaPainel = PAINEL_X * escalaX;
  const topoPainel = PAINEL_Y * escalaY;

  // Sempre que `aberto` vira true (daqui ou voltando das opções), o menu
  // entra deslizando.
  useEffect(
    function () {
      if (aberto) animarPainel(deslize, 0);
      else deslize.setValue(1);
    },
    [aberto, deslize]
  );

  // Só marca como fechado depois que o menu terminou de sair.
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

  // Bolha "Nova tarefa" do botão +. bolhaNaTela diz se ela aparece e
  // aparecerBolha anima (0 = escondida, 1 = na tela).
  // No Calendário a tarefa vai para o dia escolhido; na inicial, para hoje.
  const dataNova = noCalendario ? diaSelecionado : dataDeHoje();
  const [bolhaNaTela, setBolhaNaTela] = useState(false);
  const [aparecerBolha] = useState(function () {
    return new Animated.Value(0);
  });

  function abrirBolha() {
    setBolhaNaTela(true);
    aparecerBolha.setValue(0);
    Animated.timing(aparecerBolha, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  // Só tira a bolha depois que a animação de saída acaba.
  function fecharBolha() {
    Animated.timing(aparecerBolha, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(function () {
      setBolhaNaTela(false);
    });
  }

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

        {/* Palco: o Stack desenha aqui a rota atual.
            animation 'none' porque quem anima o deslize é o nosso código.
            Fundo transparente para o degradê aparecer atrás das páginas. */}
        <View style={styles.palco}>
          <ThemeProvider value={TEMA_NAVEGACAO_TRANSPARENTE}>
            <Stack
              id={undefined}
              screenOptions={{
                headerShown: false,
                animation: 'none',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="index" />
              {/* O Calendário abre por cima da inicial sem escondê-la, para as
                  duas deslizarem juntas. "Contained" segura a tela dentro do
                  palco (no iOS ela cobriria a barra de baixo). */}
              <Stack.Screen
                name="calendario"
                options={{ presentation: 'containedTransparentModal' }}
              />
            </Stack>
          </ThemeProvider>

          {/* O + fica aqui para não deslizar junto com as páginas.
              'box-none' deixa só o botão receber toque, não a faixa em volta. */}
          <View style={styles.areaAdicionar}>
            <Pressable
              style={styles.botaoAdicionar}
              onPress={abrirBolha}
              accessibilityRole="button"
              accessibilityLabel="Nova tarefa"
            >
              <View style={styles.anel}>
                <Text style={styles.mais}>+</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={[styles.rodape, { backgroundColor: tema.barra }]}>
          <View style={[styles.onda, { backgroundColor: tema.barra }]} />

          {/* Prancheta: volta para a inicial. Já na inicial, fica desativada. */}
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
          {/* asChild faz o Link usar o nosso Pressable como botão.
              Com asChild o estilo não pode ser lista, por isso o flatten. */}
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

      {bolhaNaTela ? (
        <BolhaNovaTarefa
          aparecer={aparecerBolha}
          categorias={categorias}
          data={dataNova}
          aoAdicionar={function (titulo, categoriaId) {
            adicionarTarefa(titulo, categoriaId, dataNova);
            fecharBolha();
          }}
          aoFechar={fecharBolha}
          escalaX={escalaX}
          escalaY={escalaY}
        />
      ) : null}

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
  // Sol ou lua: o raio de 50% deixa a caixa oval. A posição vem do tema.
  astro: {
    position: 'absolute',
    width: 161,
    height: 108,
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  // Véu por cima do fundo. Só o tema da noite usa.
  veuTema: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  // O palco ocupa todo o espaço acima da barra de baixo.
  palco: {
    flex: 1,
  },
  // Faixa da largura da tela só para centralizar o botão +.
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
  // As cores do rodapé e da onda vêm do tema. Aqui ficam as do dia.
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
