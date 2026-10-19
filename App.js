/*import { useRef, useState } from 'react';
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
import { BlurTargetView, BlurView } from 'expo-blur';
import {
  CONFIG_ALTURA,
  CONFIG_LARGURA,
  CONFIG_X,
  CONFIG_Y,
  PAINEL_ALTURA,
  PAINEL_LARGURA,
  PAINEL_X,
  PAINEL_Y,
  TELA_ALTURA,
  TELA_LARGURA,
  vidro,
} from './src/constantes/figma';
import { TEMAS, descobrirPeriodo } from './src/constantes/temas';
import { CATEGORIAS_FIXAS, TAREFAS } from './src/constantes/dados';
import PainelConfiguracoes from './src/configuracoes/PainelConfiguracoes';
import PainelOpcoes from './src/menu/PainelOpcoes';
import CardTarefa from './src/componentes/CardTarefa';

// Tempo, em milissegundos, que o menu e Configurações levam para entrar ou sair.
const DURACAO_PAINEL = 280;

// Desliza um painel até `destino` (0 = aberto, 1 = fora da tela).
// useNativeDriver fica false porque os painéis animam `left`, e o driver nativo
// não anima essa propriedade.
// `aoTerminar` é opcional e só roda se a animação chegar ao fim (não roda se
// outra animação a interromper no meio).
function animarPainel(valor, destino, aoTerminar) {
  Animated.timing(valor, {
    toValue: destino,
    duration: DURACAO_PAINEL,
    useNativeDriver: false,
  }).start(function (resultado) {
    if (resultado.finished && aoTerminar) aoTerminar();
  });
}

export default function App() {
  const [aberto, setAberto] = useState(false);
  const [configAberta, setConfigAberta] = useState(false);
  // Qual página de Configurações aparece dentro do painel de vidro:
  // null é a lista com os três grupos; 'temas', 'dataHora', 'notificacoes',
  // 'dados', 'acessibilidade', 'perfil', 'feedback' e 'sobre' são as páginas.
  // O painel é o mesmo. Só o conteúdo dele troca.
  const [paginaConfig, setPaginaConfig] = useState(null);
  // Preferências da página Data e Hora. Vivem só na memória, então voltam ao
  // valor inicial quando o app fecha. Nenhuma tela as usa ainda.
  // primeiroDiaSemana: 'domingo' ou 'segunda'. formatoHora: '24h' ou '12h'.
  const [primeiroDiaSemana, setPrimeiroDiaSemana] = useState('domingo');
  const [formatoHora, setFormatoHora] = useState('24h');
  // Nome do perfil local. Não existe login, e-mail nem senha: é só um nome que o
  // usuário digita. Vive só na memória e volta a ficar vazio quando o app fecha.
  // Vazio significa "ainda sem nome": a tela mostra o texto padrão do Figma.
  const [nomeUsuario, setNomeUsuario] = useState('');
  // Chaves da página Notificações. É só demonstração: ligar ou desligar aqui não
  // envia, agenda nem pede permissão de nenhum aviso. Vive só na memória.
  const [avisosDemo, setAvisosDemo] = useState({
    lembretes: true,
    resumoDoDia: false,
    atrasadas: true,
  });
  // Como o visual é escolhido: 'automatico' (segue o relógio), 'dia' ou 'noite'.
  // A página Temas chama setModoTema quando o usuário escolhe uma opção.
  // Isto vive só na memória: ao fechar o app, volta para 'automatico'.
  const [modoTema, setModoTema] = useState('automatico');
  // Categorias criadas pelo usuário (além das três fixas). No máximo três.
  const [categoriasNovas, setCategoriasNovas] = useState([]);
  const categorias = CATEGORIAS_FIXAS.concat(categoriasNovas);
  const deslize = useRef(new Animated.Value(1)).current;
  const deslizeConfig = useRef(new Animated.Value(1)).current;
  const alvoDesfoque = useRef(null);
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

  function abrirMenu() {
    setAberto(true);
    animarPainel(deslize, 0);
  }

  function fecharMenu() {
    animarPainel(deslize, 1, function () {
      setAberto(false);
    });
  }

  function alternarMenu() {
    if (configAberta) return;
    if (aberto) fecharMenu();
    else abrirMenu();
  }

  function abrirConfiguracoes() {
    setAberto(false);
    deslize.setValue(1);
    setPaginaConfig(null);
    setConfigAberta(true);
    deslizeConfig.setValue(1);
    animarPainel(deslizeConfig, 0);
  }

  // Primeiro Configurações sai da tela. Só quando essa animação termina é que o
  // menu volta a abrir.
  function voltarAoMenu() {
    animarPainel(deslizeConfig, 1, function () {
      setConfigAberta(false);
      setPaginaConfig(null);
      abrirMenu();
    });
  }

  const deslocamento = deslize.interpolate({
    inputRange: [0, 1],
    outputRange: [esquerdaPainel, tela.width],
  });
  const larguraConfig = CONFIG_LARGURA * escalaX;
  const alturaConfig = CONFIG_ALTURA * escalaY;
  const esquerdaConfig = CONFIG_X * escalaX;
  const topoConfig = CONFIG_Y * escalaY;
  const deslocamentoConfig = deslizeConfig.interpolate({
    inputRange: [0, 1],
    outputRange: [esquerdaConfig, tela.width],
  });

  return (
    <LinearGradient colors={tema.fundo} locations={tema.posicoes} style={styles.tela}>
      <BlurTargetView ref={alvoDesfoque} style={styles.alvo}>
      {tema.veu ? (
        <View style={[styles.veuTema, { backgroundColor: tema.veu }]} />
      ) : null}
      {/* Sol de dia, lua de noite. Fica atrás do título e do card. *//*/}/*
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
          aoAbrirConfig={abrirConfiguracoes}
          nomeUsuario={nomeUsuario}
          categorias={categorias}
          aoAdicionarCategoria={function (nome) {
            setCategoriasNovas(categoriasNovas.concat([nome]));
          }}
        />
      </Animated.View>

      {configAberta ? (
        <Pressable
          style={styles.faixaFechar}
          onPress={voltarAoMenu}
          accessibilityRole="button"
          accessibilityLabel="Fechar Configurações"
        />
      ) : null}

      <Animated.View
        style={[
          styles.painel,
          {
            width: larguraConfig,
            height: alturaConfig,
            left: deslocamentoConfig,
            top: topoConfig,
            borderRadius: 28 * escalaX,
            pointerEvents: configAberta ? 'auto' : 'none',
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
          <PainelConfiguracoes
            paginaConfig={paginaConfig}
            aoAbrirPagina={setPaginaConfig}
            aoVoltarParaLista={function () {
              setPaginaConfig(null);
            }}
            aoVoltar={voltarAoMenu}
            modoTema={modoTema}
            aoEscolherTema={setModoTema}
            primeiroDiaSemana={primeiroDiaSemana}
            aoEscolherPrimeiroDia={setPrimeiroDiaSemana}
            formatoHora={formatoHora}
            aoEscolherFormatoHora={setFormatoHora}
            avisosDemo={avisosDemo}
            aoAlternarAviso={function (chave) {
              // Copia o objeto e troca só a chave tocada (não mudamos o estado antigo).
              setAvisosDemo({ ...avisosDemo, [chave]: !avisosDemo[chave] });
            }}
            tarefas={TAREFAS}
            categorias={categorias}
            nomeUsuario={nomeUsuario}
            aoMudarNome={setNomeUsuario}
          />
        </BlurView>
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
    ...StyleSheet.absoluteFillObject,
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});*/
