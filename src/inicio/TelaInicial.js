import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
} from '../constantes/figma';
import { TEMAS, descobrirPeriodo } from '../constantes/temas';
import { useOpcoes } from '../contexto/OpcoesContext';
import { animarPainel } from '../utilidades/animarPainel';
import PainelOpcoes from '../menu/PainelOpcoes';
import CardTarefa from '../componentes/CardTarefa';

export default function TelaInicial() {
  // O tema, o nome, as categorias e o menu aberto vêm do Context, porque as
  // rotas de opções também leem e alteram esses valores.
  const {
    nomeUsuario,
    modoTema,
    categorias,
    adicionarCategoria,
    menuAberto: aberto,
    setMenuAberto: setAberto,
    alvoDesfoque,
    deslizeMenu: deslize,
  } = useOpcoes();
  const tela = Dimensions.get('window');
  // No modo automático o relógio decide. Nos outros, vale o que foi escolhido.
  // O período é calculado a cada desenho da tela. Sem um timer, ele só muda
  // quando a tela é redesenhada, por exemplo ao abrir um painel.
  const periodo = modoTema === 'automatico' ? descobrirPeriodo() : modoTema;
  const tema = TEMAS[periodo];
  const escalaX = tela.width / TELA_LARGURA;
  const escalaY = tela.height / TELA_ALTURA;
  const larguraPainel = PAINEL_LARGURA * escalaX;
  const alturaPainel = PAINEL_ALTURA * escalaY;
  const esquerdaPainel = PAINEL_X * escalaX;
  const topoPainel = PAINEL_Y * escalaY;

  // O menu abre deslizando sempre que `aberto` vira true, venha a mudança daqui
  // (botão da barra) ou do Context (voltar das opções). Quem fecha com animação
  // (fecharMenu e entrarNasOpcoes) só muda `aberto` para false no fim.
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
      {/* Sol de dia, lua de noite. Fica atrás do título e do card. */}
      <LinearGradient
        colors={tema.astro.cores}
        locations={tema.astro.posicoes}
        style={[styles.astro, { right: tema.astro.direita, top: tema.astro.topo }]}
      />
      <View style={styles.conteudo}>
        <Text style={[styles.titulo, { color: tema.titulo }]}>👋 Seja bem vindo</Text>

        <CardTarefa titulo="Nome da tarefa" tema={tema} />

        <View style={styles.espaco} />

        <View style={styles.botaoAdicionar}>
          <View style={styles.anel}>
            <Text style={styles.mais}>+</Text>
          </View>
        </View>
      </View>

      <View style={[styles.rodape, { backgroundColor: tema.barra }]}>
        <View style={[styles.onda, { backgroundColor: tema.barra }]} />

        <View style={styles.botaoBarra}>
          <Ionicons name="clipboard-outline" size={26} color="#ffffff" />
        </View>
        <View style={styles.botaoBarra}>
          <Ionicons name="calendar-outline" size={26} color="#ffffff" />
        </View>
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
  // Elipse do sol ou da lua. O raio de 50% deixa a caixa de 161×108 oval.
  // A posição (right e top) vem do tema, e a borda da tela corta o excesso.
  astro: {
    position: 'absolute',
    width: 161,
    height: 108,
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  // Camada que cobre a tela inteira, por baixo do conteúdo. Só o tema da noite usa.
  veuTema: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  conteudo: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 25,
  },
  // As cores de titulo, rodape e onda são trocadas pelo tema em tempo de execução.
  // Os valores aqui são os do dia.
  titulo: {
    fontSize: 32,
    color: '#558796',
  },
  espaco: {
    flex: 1,
  },
  botaoAdicionar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 36,
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
