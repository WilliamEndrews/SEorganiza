import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BlurTargetView, BlurView } from 'expo-blur';

import appJson from './app.json';

// tela 
const TELA_LARGURA = 428;
const TELA_ALTURA = 926;
const PAINEL_X = 128;
const PAINEL_Y = 46;
const PAINEL_LARGURA = 288;
const PAINEL_ALTURA = 780;


const CONFIG_LARGURA = 403;
const CONFIG_ALTURA = 881;
 
const CONFIG_X = 12;
const CONFIG_Y = 28;


const DEGRADE_AZUL = ['#5C6674', '#9AB3D3'];
const DEGRADE_AZUL_INICIO = { x: 0, y: 0 };
const DEGRADE_AZUL_FIM = { x: 0.93, y: 0.4 };


const DEGRADE_LARANJA = ['#B2621D', '#D9C5A0'];
const DEGRADE_LARANJA_INICIO = { x: 0, y: 0 };
const DEGRADE_LARANJA_FIM = { x: 0.8, y: 0.22 };


const COR_ICONE_AZUL = '#0088FF';
const COR_ICONE_LARANJA = '#FFAA00';


const TEMAS = {
  dia: {
    fundo: ['#0C9BE2', '#52B7BC', '#A0E2E6'],
    posicoes: [0, 0.15, 0.7],
    veu: null,
    
    astro: {
      cores: ['#FFE500', '#FEA900', '#F8DA63', '#EBE972', '#F2E4AC', '#F9EBB1', '#7AC7D0'],
      posicoes: [0, 0.11, 0.31, 0.43, 0.49, 0.64, 0.77],
      direita: TELA_LARGURA - (318 + 161),
      topo: -24,
    },
    titulo: '#558796',
    card: ['#58E4EC', '#E4FDFB'],
    bordaCard: null,
    textoCard: '#000000',
    circulo: '#7A9AAA',
    bandeira: '#5C6B73',
    barra: '#F4F7F8',
    barraDeStatus: 'dark',
  },
  noite: {
    
    fundo: ['#010012', '#040538', '#030B59', '#101D92', '#5A69EF'],
    posicoes: [0, 0.12, 0.19, 0.35, 0.99],
    
    veu: 'rgba(255, 255, 255, 0.2)',
    
    astro: {
      cores: ['#000000', '#1A1F26', '#3B3B3B', '#2E3577', '#4E4A7A', '#C9EFED', '#D0DCE2'],
      posicoes: [0, 0.11, 0.31, 0.43, 0.49, 0.64, 0.77],
      direita: TELA_LARGURA - (313 + 161),
      topo: -29,
    },
    titulo: '#0C9BE2',
  
    card: ['rgba(121, 220, 225, 0.6)', 'rgba(188, 230, 233, 0.6)'],
    bordaCard: 'rgba(255, 255, 255, 0.8)',
    textoCard: '#FFFFFF',
    circulo: '#2E7276',
    bandeira: '#C6D1E0',
    barra: '#F2F2F7',
    barraDeStatus: 'light',
  },
};


const HORA_NASCER_DO_SOL = 6;
const HORA_POR_DO_SOL = 18;


function descobrirPeriodo() {
  const hora = new Date().getHours();
  if (hora >= HORA_NASCER_DO_SOL && hora < HORA_POR_DO_SOL) return 'dia';
  return 'noite';
}


const vidro = {
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(15px) saturate(160%)',
  WebkitBackdropFilter: 'blur(15px) saturate(160%)',
  boxShadow:
    '0 20px 40px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 1px 0 8px rgba(255, 70, 70, 0.22), inset -1px 0 8px rgba(70, 120, 255, 0.28)',
};

const TAREFAS = [];
const CATEGORIAS_FIXAS = ['Trabalho', 'Dia a Dia', 'Eventos'];
const LIMITE_CATEGORIAS_NOVAS = 3;

export default function App() {
  const [aberto, setAberto] = useState(false);
  const [configAberta, setConfigAberta] = useState(false);

  const [paginaConfig, setPaginaConfig] = useState(null);

  const [primeiroDiaSemana, setPrimeiroDiaSemana] = useState('domingo');
  const [formatoHora, setFormatoHora] = useState('24h');

  const [nomeUsuario, setNomeUsuario] = useState('');
 
  const [avisosDemo, setAvisosDemo] = useState({
    lembretes: true,
    resumoDoDia: false,
    atrasadas: true,
  });
 
 
  const [modoTema, setModoTema] = useState('automatico');

  const [categoriasNovas, setCategoriasNovas] = useState([]);
  const categorias = CATEGORIAS_FIXAS.concat(categoriasNovas);
  const deslize = useRef(new Animated.Value(1)).current;
  const deslizeConfig = useRef(new Animated.Value(1)).current;
  const alvoDesfoque = useRef(null);
  const tela = Dimensions.get('window');

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
    Animated.timing(deslize, {
      toValue: 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }

  function fecharMenu() {
    Animated.timing(deslize, {
      toValue: 1,
      duration: 280,
      useNativeDriver: false,
    }).start(function (resultado) {
      if (resultado.finished) setAberto(false);
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
    Animated.timing(deslizeConfig, {
      toValue: 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }

  function voltarAoMenu() {
    Animated.timing(deslizeConfig, {
      toValue: 1,
      duration: 280,
      useNativeDriver: false,
    }).start(function (resultado) {
      if (!resultado.finished) return;
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

      <LinearGradient
        colors={tema.astro.cores}
        locations={tema.astro.posicoes}
        style={[styles.astro, { right: tema.astro.direita, top: tema.astro.topo }]}
      />
      <View style={styles.conteudo}>
        <Text style={[styles.titulo, { color: tema.titulo }]}>👋 Seja bem vindo</Text>

        <LinearGradient
          colors={tema.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.card,
            tema.bordaCard ? { borderWidth: 1, borderColor: tema.bordaCard } : null,
          ]}
        >
          <View style={[styles.circulo, { borderColor: tema.circulo }]} />
          <Text style={[styles.nomeTarefa, { color: tema.textoCard }]}>Nome da tarefa</Text>
          <Ionicons name="flag-outline" size={22} color={tema.bandeira} />
        </LinearGradient>

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
        <Pressable style={styles.botaoBarra} onPress={alternarMenu}>
          <Ionicons name="menu" size={28} color="#ffffff" />
        </Pressable>
      </View>
      </BlurTargetView>

      {aberto ? (
        <Pressable style={styles.faixaFechar} onPress={fecharMenu} />
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
        <Pressable style={styles.faixaFechar} onPress={voltarAoMenu} />
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


function nomeParaExibir(nomeUsuario) {
  return nomeUsuario.trim() || 'Nome de usuário';
}


function inicialDoNome(nomeUsuario) {
  return nomeUsuario.trim().charAt(0).toUpperCase();
}


function contarTarefas(tarefas) {
  const total = tarefas.length;
  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida;
  }).length;
  return { total: total, concluidas: concluidas, pendentes: total - concluidas };
}


function Avatar({ nomeUsuario, tamanho, cor, corTexto }) {
  return (
    <View
      accessible={false}
      style={[
        styles.avatar,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor },
      ]}
    >
      <Text style={{ color: corTexto, fontSize: tamanho * 0.45, fontWeight: '700' }}>
        {inicialDoNome(nomeUsuario)}
      </Text>
    </View>
  );
}

function BolhaNovaCategoria({
  aparecer,
  nome,
  aoMudarNome,
  aviso,
  aoAdicionar,
  aoCancelar,
  escalaX,
  escalaY,
  faltam,
}) {
  function x(valor) {
    return valor * escalaX;
  }
  function y(valor) {
    return valor * escalaY;
  }

  return (
    <View style={styles.camadaBolha} pointerEvents="box-none">
      <Pressable
        onPress={aoCancelar}
        accessibilityRole="button"
        accessibilityLabel="Fechar nova categoria"
        style={styles.fundoBolha}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.28)',
              opacity: aparecer,
            },
          ]}
        />
      </Pressable>
      <Animated.View
        style={[
          styles.bolhaVidro,
          vidro,
          {
            left: x(18),
            top: y(188),
            width: x(252),
            opacity: aparecer,
            transform: [
              {
                scale: aparecer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.72, 1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[styles.brilho, { pointerEvents: 'none' }]}
        />
        <Text style={[styles.tituloBolha, { fontSize: y(16) }]}>Nova categoria</Text>
        <TextInput
          value={nome}
          onChangeText={aoMudarNome}
          placeholder="Nome da categoria"
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          maxLength={20}
          autoFocus
          accessibilityLabel="Nome da categoria"
          style={[styles.campoBolha, { fontSize: y(16), minHeight: y(44) }]}
        />
        {aviso ? <Text style={styles.avisoBolha}>{aviso}</Text> : null}
        <Text style={styles.notaBolha}>
          {faltam === 1
            ? 'Cabe mais 1 categoria nova.'
            : 'Cabem mais ' + faltam + ' categorias novas.'}
        </Text>
        <View style={styles.linhaBotoesBolha}>
          <Pressable
            onPress={aoCancelar}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            style={function (estado) {
              return [
                styles.botaoBolha,
                styles.botaoBolhaCancelar,
                estado.pressed ? styles.botaoPressionado : null,
              ];
            }}
          >
            <Text style={styles.textoBotaoBolhaEscuro}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={aoAdicionar}
            accessibilityRole="button"
            accessibilityLabel="Adicionar"
            style={function (estado) {
              return [
                styles.botaoBolha,
                styles.botaoBolhaAdicionar,
                estado.pressed ? styles.botaoPressionado : null,
              ];
            }}
          >
            <Text style={styles.textoBotaoBolhaClaro}>Adicionar</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function PainelOpcoes({
  escalaX,
  escalaY,
  aoAbrirConfig,
  nomeUsuario,
  categorias,
  aoAdicionarCategoria,
}) {
  function x(valor) {
    return valor * escalaX;
  }
  function y(valor) {
    return valor * escalaY;
  }


  const PASSO_CATEGORIA = 37;
  const TOPO_PRIMEIRA = 166;
  const FOLGA_NOVA = 58;
  const FOLGA_DIVISOR = 40;
  const FOLGA_CONFIG = 12;
  const FOLGA_CONCLUIDAS = 77;
  const FOLGA_EXCLUIDAS = 65;

  function topoCategoria(indice) {
    return TOPO_PRIMEIRA + indice * PASSO_CATEGORIA;
  }

  const novasJaCriadas = categorias.length - CATEGORIAS_FIXAS.length;
  const podeAdicionar = novasJaCriadas < LIMITE_CATEGORIAS_NOVAS;
  const topoNova = topoCategoria(categorias.length - 1) + FOLGA_NOVA;
  const topoDivisor2 = (podeAdicionar ? topoNova : topoCategoria(categorias.length - 1) + 28) + FOLGA_DIVISOR;
  const topoConfig = topoDivisor2 + FOLGA_CONFIG;
  const topoConcluidas = topoConfig + FOLGA_CONCLUIDAS;
  const topoExcluidas = topoConcluidas + FOLGA_EXCLUIDAS;

  const [bolhaNaTela, setBolhaNaTela] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [avisoBolha, setAvisoBolha] = useState('');
  const aparecerBolha = useRef(new Animated.Value(0)).current;

  function abrirBolha() {
    if (!podeAdicionar) return;
    setNomeNovo('');
    setAvisoBolha('');
    setBolhaNaTela(true);
    aparecerBolha.setValue(0);
    Animated.timing(aparecerBolha, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  function fecharBolha() {
    Animated.timing(aparecerBolha, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(function () {
      setBolhaNaTela(false);
      setNomeNovo('');
      setAvisoBolha('');
    });
  }

  function confirmarCategoria() {
    const limpo = nomeNovo.trim();
    if (!limpo) {
      setAvisoBolha('Digite um nome');
      return;
    }
    const jaExiste = categorias.some(function (categoria) {
      return categoria.toLowerCase() === limpo.toLowerCase();
    });
    if (jaExiste) {
      setAvisoBolha('Essa categoria já existe');
      return;
    }
    if (!podeAdicionar) {
      setAvisoBolha('Limite de 3 categorias novas');
      return;
    }
    aoAdicionarCategoria(limpo);
    fecharBolha();
  }

  return (
    <View style={styles.miolo}>
      <View
        style={[
          styles.foto,
          {
            left: x(21),
            top: y(26),
            width: x(50),
            height: x(50),
            borderRadius: x(25),
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ color: '#1C1C1C', fontSize: x(22), fontWeight: '700' }}>
          {inicialDoNome(nomeUsuario)}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.nomeUsuario,
          { left: x(85), top: y(39), width: x(190), fontSize: y(18) },
        ]}
      >
        {nomeParaExibir(nomeUsuario)}
      </Text>

      <View style={[styles.divisor, { left: x(5), top: y(91), width: x(277) }]} />

      <Ionicons
        name="folder-outline"
        size={x(22)}
        color="#1C1C1C"
        style={{ position: 'absolute', left: x(43), top: y(113) }}
      />
      <Text style={[styles.textoItem, { left: x(72), top: y(110), fontSize: y(18) }]}>
        Categorias
      </Text>

      {categorias.map(function (categoria, indice) {
        const topo = topoCategoria(indice);
        return (
          <View key={categoria}>
            <Text style={[styles.traco, { left: x(21), top: y(topo), fontSize: y(18) }]}>—</Text>
            <Text
              numberOfLines={1}
              style={[styles.textoItem, { left: x(55), top: y(topo), width: x(210), fontSize: y(16) }]}
            >
              {categoria}
            </Text>
          </View>
        );
      })}

      {podeAdicionar ? (
        <Pressable
          onPress={abrirBolha}
          accessibilityRole="button"
          accessibilityLabel="Nova Categoria"
          style={[
            styles.linhaMenu,
            { left: x(8), top: y(topoNova), width: x(260), height: y(36) },
          ]}
        >
          <Ionicons name="add" size={x(15)} color="#5C5C5C" />
          <Text
            style={[
              styles.textoSuave,
              { position: 'relative', fontSize: y(14), marginLeft: x(10) },
            ]}
          >
            Nova Categoria
          </Text>
        </Pressable>
      ) : null}

      <View style={[styles.divisor, { left: x(5), top: y(topoDivisor2), width: x(277) }]} />

      <Pressable
        onPress={aoAbrirConfig}
        style={[
          styles.linhaMenu,
          { left: x(8), top: y(topoConfig), width: x(270), height: y(48) },
        ]}
      >
        <Ionicons name="settings-outline" size={x(26)} color="#1C1C1C" />
        <Text
          style={[
            styles.textoItem,
            { position: 'relative', fontSize: y(18), marginLeft: x(12) },
          ]}
        >
          Configurações
        </Text>
      </Pressable>
      <Ionicons
        name="checkmark-circle-outline"
        size={x(26)}
        color="#1C1C1C"
        style={{ position: 'absolute', left: x(19), top: y(topoConcluidas) }}
      />
      <Text style={[styles.textoItem, { left: x(57), top: y(topoConcluidas), fontSize: y(18) }]}>
        Tarefas Concluídas
      </Text>
      <Ionicons
        name="trash-outline"
        size={x(24)}
        color="#1C1C1C"
        style={{ position: 'absolute', left: x(17), top: y(topoExcluidas) }}
      />
      <Text style={[styles.textoItem, { left: x(55), top: y(topoExcluidas), fontSize: y(18) }]}>
        Tarefas Excluídas
      </Text>

      {bolhaNaTela ? (
        <BolhaNovaCategoria
          aparecer={aparecerBolha}
          nome={nomeNovo}
          aoMudarNome={function (texto) {
            setNomeNovo(texto);
            setAvisoBolha('');
          }}
          aviso={avisoBolha}
          aoAdicionar={confirmarCategoria}
          aoCancelar={fecharBolha}
          escalaX={escalaX}
          escalaY={escalaY}
          faltam={LIMITE_CATEGORIAS_NOVAS - novasJaCriadas}
        />
      ) : null}
    </View>
  );
}

const OPACIDADE_VIDRO = 0.5;


function hexComAlfa(hex, alfa) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alfa + ')';
}


function GrupoVidro({ cor, style, children }) {
  const azul = cor === 'azul';

  const coresBase = (azul ? DEGRADE_AZUL : DEGRADE_LARANJA).map(function (hex) {
    return hexComAlfa(hex, OPACIDADE_VIDRO);
  });
  return (
    <LinearGradient
      colors={coresBase}
      start={azul ? DEGRADE_AZUL_INICIO : DEGRADE_LARANJA_INICIO}
      end={azul ? DEGRADE_AZUL_FIM : DEGRADE_LARANJA_FIM}
      style={style}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.camadaVidro, { pointerEvents: 'none' }]}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.12)']}
        start={{ x: 0.4, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={[styles.camadaVidro, { pointerEvents: 'none' }]}
      />
      <View style={[styles.bordaVidro, { pointerEvents: 'none' }]} />
      {children}
    </LinearGradient>
  );
}

function destinoPendente() {
  return undefined;
}

function BotaoConfig({ icone, titulo, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar || destinoPendente}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={aoPressionar ? undefined : 'Ainda não disponível'}
      style={function (estado) {
        return [styles.linhaConfig, estado.pressed ? styles.linhaPressionada : null];
      }}
    >
      {icone}
      <Text style={styles.textoConfig}>{titulo}</Text>
      <Ionicons name="chevron-forward" size={16} color="#000000" />
    </Pressable>
  );
}

function MiniAstro({ astro }) {
  return (
    <LinearGradient
      colors={astro.cores}
      locations={astro.posicoes}
      style={styles.miniAstro}
    />
  );
}


function OpcaoEscolha({ titulo, desenho, selecionado, aoEscolher }) {
  return (
    <Pressable
      onPress={aoEscolher}
      accessibilityRole="radio"
      aria-checked={selecionado}
      accessibilityLabel={titulo}
      style={function (estado) {
        return [
          desenho ? styles.linhaTema : styles.linhaConfig,
          estado.pressed ? styles.linhaPressionada : null,
        ];
      }}
    >
      {desenho ? (
        <View style={[styles.areaDesenhoTema, selecionado ? styles.desenhoSelecionado : null]}>
          {desenho}
        </View>
      ) : null}
      <Text
        style={[
          styles.textoConfig,
          desenho ? null : styles.textoSemDesenho,
          selecionado ? styles.textoSelecionado : null,
        ]}
      >
        {titulo}
      </Text>
      <Ionicons
        name={selecionado ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color="#000000"
      />
    </Pressable>
  );
}


function PaginaTemas({ modoTema, aoEscolher, aoVoltar }) {
  return (
    <View style={styles.configMiolo}>
      {/* Linha de voltar: a seta e o título formam um botão só. */}
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Temas</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="azul" style={styles.grupo}>
        <OpcaoEscolha
          titulo="Automático"
          desenho={
            <View style={styles.parDeAstros}>
              <MiniAstro astro={TEMAS.dia.astro} />
              <View style={styles.astroSobreposto}>
                <MiniAstro astro={TEMAS.noite.astro} />
              </View>
            </View>
          }
          selecionado={modoTema === 'automatico'}
          aoEscolher={function () {
            aoEscolher('automatico');
          }}
        />
        <OpcaoEscolha
          titulo="Dia"
          desenho={<MiniAstro astro={TEMAS.dia.astro} />}
          selecionado={modoTema === 'dia'}
          aoEscolher={function () {
            aoEscolher('dia');
          }}
        />
        <OpcaoEscolha
          titulo="Noite"
          desenho={<MiniAstro astro={TEMAS.noite.astro} />}
          selecionado={modoTema === 'noite'}
          aoEscolher={function () {
            aoEscolher('noite');
          }}
        />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        Automático segue o relógio do aparelho: dia das {HORA_NASCER_DO_SOL}h às{' '}
        {HORA_POR_DO_SOL}h e noite no resto.
      </Text>
      <Text style={styles.notaTemas}>
        A escolha vale só enquanto o app está aberto. Ao fechar, ele volta para Automático.
      </Text>
    </View>
  );
}


function PaginaDataHora({
  primeiroDiaSemana,
  aoEscolherPrimeiroDia,
  formatoHora,
  aoEscolherFormatoHora,
  aoVoltar,
}) {
  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Data e Hora</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <Text style={styles.tituloSecao}>Primeiro dia da semana</Text>
      <GrupoVidro cor="azul" style={[styles.grupo, styles.grupoPagina]}>
        <OpcaoEscolha
          titulo="Domingo"
          selecionado={primeiroDiaSemana === 'domingo'}
          aoEscolher={function () {
            aoEscolherPrimeiroDia('domingo');
          }}
        />
        <OpcaoEscolha
          titulo="Segunda-feira"
          selecionado={primeiroDiaSemana === 'segunda'}
          aoEscolher={function () {
            aoEscolherPrimeiroDia('segunda');
          }}
        />
      </GrupoVidro>

      <Text style={styles.tituloSecao}>Formato de horário</Text>
      <GrupoVidro cor="azul" style={[styles.grupo, styles.grupoPagina]}>
        <OpcaoEscolha
          titulo="24 horas (15:30)"
          selecionado={formatoHora === '24h'}
          aoEscolher={function () {
            aoEscolherFormatoHora('24h');
          }}
        />
        <OpcaoEscolha
          titulo="12 horas (3:30 PM)"
          selecionado={formatoHora === '12h'}
          aoEscolher={function () {
            aoEscolherFormatoHora('12h');
          }}
        />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        Nenhuma tela usa essas escolhas ainda. A agenda será a primeira a usá-las.
      </Text>
      <Text style={styles.notaTemas}>
        A escolha vale só enquanto o app está aberto. Ao fechar, volta para Domingo e 24 horas.
      </Text>
    </View>
  );
}


function LinhaChave({ titulo, ligado, aoAlternar }) {
  return (
    <Pressable
      onPress={aoAlternar}
      accessibilityRole="switch"
      aria-checked={ligado}
      accessibilityLabel={titulo}
      style={function (estado) {
        return [styles.linhaConfig, estado.pressed ? styles.linhaPressionada : null];
      }}
    >
      <Text style={[styles.textoConfig, styles.textoSemDesenho]}>{titulo}</Text>
      <Text style={styles.textoEstadoChave}>{ligado ? 'Ligado' : 'Desligado'}</Text>
      <View style={[styles.trilhoChave, ligado ? styles.trilhoLigado : null]}>
        <View style={[styles.bolinhaChave, ligado ? styles.bolinhaLigada : null]} />
      </View>
    </Pressable>
  );
}


function PaginaNotificacoes({ avisosDemo, aoAlternarAviso, aoVoltar }) {
  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Notificações</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="azul" style={styles.grupo}>
        <LinhaChave
          titulo="Lembretes"
          ligado={avisosDemo.lembretes}
          aoAlternar={function () {
            aoAlternarAviso('lembretes');
          }}
        />
        <LinhaChave
          titulo="Resumo do dia"
          ligado={avisosDemo.resumoDoDia}
          aoAlternar={function () {
            aoAlternarAviso('resumoDoDia');
          }}
        />
        <LinhaChave
          titulo="Tarefas atrasadas"
          ligado={avisosDemo.atrasadas}
          aoAlternar={function () {
            aoAlternarAviso('atrasadas');
          }}
        />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        Apenas demonstração: nenhuma notificação é enviada, agendada ou pedida ao sistema.
      </Text>
      <Text style={styles.notaTemas}>
        As chaves valem só enquanto o app está aberto. Ao fechar, voltam ao estado inicial.
      </Text>
    </View>
  );
}


function LinhaDado({ titulo, valor }) {
  return (
    <View accessible accessibilityLabel={titulo + ': ' + valor} style={styles.linhaConfig}>
      <Text style={[styles.textoConfig, styles.textoSemDesenho]}>{titulo}</Text>
      <Text style={styles.valorDado}>{valor}</Text>
    </View>
  );
}


function PaginaDados({ tarefas, categorias, aoVoltar }) {
  const { total, concluidas, pendentes } = contarTarefas(tarefas);

  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Dados</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="azul" style={styles.grupo}>
        <LinhaDado titulo="Total de tarefas" valor={total} />
        <LinhaDado titulo="Concluídas" valor={concluidas} />
        <LinhaDado titulo="Pendentes" valor={pendentes} />
        <LinhaDado titulo="Categorias" valor={categorias.length} />
      </GrupoVidro>

      {total === 0 ? (
        <Text style={styles.notaTemas}>
          Nenhuma tarefa cadastrada ainda. O app ainda não tem tela para criar tarefas, por isso
          as tarefas mostram 0.
        </Text>
      ) : null}
      <Text style={styles.notaTemas}>
        As categorias vêm do menu: três fixas e até três que você criar. As novas valem só
        enquanto o app está aberto.
      </Text>
    </View>
  );
}

function LinhaInfo({ icone, titulo, texto }) {
  return (
    <View accessible accessibilityLabel={titulo + '. ' + texto} style={styles.linhaInfo}>
      {icone}
      <View style={styles.textosInfo}>
        <Text style={styles.tituloInfo}>{titulo}</Text>
        <Text style={styles.textoInfo}>{texto}</Text>
      </View>
    </View>
  );
}

function PaginaAcessibilidade({ aoVoltar }) {
  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Acessibilidade</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="azul" style={styles.grupo}>
        <LinhaInfo
          icone={<MaterialCommunityIcons name="format-size" size={24} color={COR_ICONE_AZUL} />}
          titulo="Tamanho do texto"
          texto="Acompanha o tamanho de letra definido no sistema do aparelho."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="gesture-tap" size={24} color={COR_ICONE_AZUL} />}
          titulo="Áreas de toque"
          texto="Botões e opções de Configurações têm pelo menos 44 de altura."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="shape" size={24} color={COR_ICONE_AZUL} />}
          titulo="Além da cor"
          texto="O que está escolhido ou ligado também muda de forma e de texto, não só de cor."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="account-voice" size={24} color={COR_ICONE_AZUL} />}
          titulo="Leitor de tela"
          texto="Os botões e as opções de Configurações têm nome para o leitor de tela."
        />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        Esta página só informa: não há ajustes aqui. Para mudar o tamanho da letra ou ligar o
        leitor de tela, use as configurações do aparelho.
      </Text>
    </View>
  );
}

function PaginaPerfil({ nomeUsuario, aoMudarNome, tarefas, aoVoltar }) {
  const { concluidas, pendentes } = contarTarefas(tarefas);

  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Perfil</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <View style={styles.avatarGrandeArea}>
        <Avatar nomeUsuario={nomeUsuario} tamanho={88} cor="#AFAFAF" corTexto="#FFFFFF" />
      </View>

      <GrupoVidro cor="azul" style={[styles.grupo, styles.grupoPagina]}>
        <View style={styles.linhaConfig}>
          <Text style={styles.rotuloNome}>Nome</Text>
          <TextInput
            value={nomeUsuario}
            onChangeText={aoMudarNome}
            placeholder="Digite seu nome"
            placeholderTextColor="rgba(0, 0, 0, 0.55)"
            maxLength={30}
            autoCapitalize="words"
            autoCorrect={false}
            accessibilityLabel="Nome"
            style={styles.campoNome}
          />
        </View>
      </GrupoVidro>

      <GrupoVidro cor="azul" style={styles.grupo}>
        <LinhaDado titulo="Tarefas concluídas" valor={concluidas} />
        <LinhaDado titulo="Tarefas pendentes" valor={pendentes} />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        Perfil local: não há login, e-mail nem senha. O nome fica só neste aparelho, enquanto o
        app estiver aberto. Ao fechar, ele se apaga.
      </Text>
      <Text style={styles.notaTemas}>Escolher foto ainda não está disponível.</Text>
    </View>
  );
}

function PaginaFeedback({ aoVoltar }) {
  const [texto, setTexto] = useState('');
  const [avisoVisivel, setAvisoVisivel] = useState(false);
  const semTexto = texto.trim().length === 0;

  function mudarTexto(novoTexto) {
    setTexto(novoTexto);

    setAvisoVisivel(false);
  }

  function aoEnviar() {
  
    setAvisoVisivel(true);
  }

  function aoCancelar() {

    setTexto('');
    setAvisoVisivel(false);
    aoVoltar();
  }

  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Feedback</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="laranja" style={[styles.grupo, styles.grupoPagina]}>
        <TextInput
          value={texto}
          onChangeText={mudarTexto}
          placeholder="Escreva aqui sua sugestão ou problema"
          placeholderTextColor="rgba(0, 0, 0, 0.75)"
          multiline
          maxLength={500}
          accessibilityLabel="Mensagem de feedback"
          style={styles.campoFeedback}
        />
        <Text style={styles.contadorFeedback}>{texto.length}/500</Text>
      </GrupoVidro>

      <View style={styles.linhaBotoes}>
        <Pressable
          onPress={aoCancelar}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          style={function (estado) {
            return [
              styles.botaoFeedback,
              styles.botaoCancelar,
              estado.pressed ? styles.botaoPressionado : null,
            ];
          }}
        >
          <Text style={styles.textoBotaoFeedback}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={aoEnviar}
          disabled={semTexto}
          accessibilityRole="button"
          accessibilityLabel="Enviar"
          accessibilityState={{ disabled: semTexto }}
          style={function (estado) {
            return [
              styles.botaoFeedback,
              styles.botaoEnviar,
              semTexto ? styles.botaoDesativado : null,
              estado.pressed ? styles.botaoPressionado : null,
            ];
          }}
        >
          <Text style={styles.textoBotaoFeedback}>Enviar</Text>
        </Pressable>
      </View>

      {avisoVisivel ? (
        <Text accessibilityLiveRegion="polite" style={styles.avisoFeedback}>
          O envio ainda não está conectado. Nada foi enviado. Seu texto continua aqui.
        </Text>
      ) : null}
      <Text style={styles.notaTemas}>
        Enviar fica desativado enquanto o campo está vazio. Se você sair desta página, o texto
        digitado se perde.
      </Text>
    </View>
  );
}


function PaginaSobre({ aoVoltar }) {
  return (
    <View style={styles.configMiolo}>
      <Pressable
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Configurações"
        style={styles.cabecalhoPagina}
      >
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        <Text style={styles.tituloConfig}>Sobre</Text>
        <View style={styles.espacoDaSeta} />
      </Pressable>

      <GrupoVidro cor="laranja" style={[styles.grupo, styles.grupoPagina]}>
        <LinhaDado titulo="Nome" valor={appJson.expo.name} />
        <LinhaDado titulo="Versão" valor={appJson.expo.version} />
      </GrupoVidro>

      <Text style={styles.notaTemas}>
        SEorganize é um aplicativo para organizar tarefas. Ele ainda está em desenvolvimento:
        várias partes, como criar tarefas, ainda não existem.
      </Text>
      <Text style={styles.notaTemas}>Nome e versão vêm da configuração do app (app.json).</Text>
    </View>
  );
}


function PainelConfiguracoes(props) {
  return (
    <ScrollView
      contentContainerStyle={styles.rolagemConfig}
      showsVerticalScrollIndicator={false}
    >
      <ConteudoConfiguracoes {...props} />
    </ScrollView>
  );
}


function ConteudoConfiguracoes({
  paginaConfig,
  aoAbrirPagina,
  aoVoltarParaLista,
  aoVoltar,
  modoTema,
  aoEscolherTema,
  primeiroDiaSemana,
  aoEscolherPrimeiroDia,
  formatoHora,
  aoEscolherFormatoHora,
  avisosDemo,
  aoAlternarAviso,
  tarefas,
  categorias,
  nomeUsuario,
  aoMudarNome,
}) {
  if (paginaConfig === 'feedback') {
    return <PaginaFeedback aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'sobre') {
    return <PaginaSobre aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'perfil') {
    return (
      <PaginaPerfil
        nomeUsuario={nomeUsuario}
        aoMudarNome={aoMudarNome}
        tarefas={tarefas}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  if (paginaConfig === 'temas') {
    return (
      <PaginaTemas modoTema={modoTema} aoEscolher={aoEscolherTema} aoVoltar={aoVoltarParaLista} />
    );
  }

  if (paginaConfig === 'dataHora') {
    return (
      <PaginaDataHora
        primeiroDiaSemana={primeiroDiaSemana}
        aoEscolherPrimeiroDia={aoEscolherPrimeiroDia}
        formatoHora={formatoHora}
        aoEscolherFormatoHora={aoEscolherFormatoHora}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  if (paginaConfig === 'acessibilidade') {
    return <PaginaAcessibilidade aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'dados') {
    return <PaginaDados tarefas={tarefas} categorias={categorias} aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'notificacoes') {
    return (
      <PaginaNotificacoes
        avisosDemo={avisosDemo}
        aoAlternarAviso={aoAlternarAviso}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  return (
    <View style={styles.configMiolo}>
    
      <Pressable
        onPress={aoVoltar}
        hitSlop={{ top: 4 }}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao menu"
      >
        <Text style={styles.tituloConfig}>Configurações</Text>
      </Pressable>

    
      <Pressable
        onPress={function () {
          aoAbrirPagina('perfil');
        }}
        accessibilityRole="button"
        accessibilityLabel={'Perfil: ' + nomeParaExibir(nomeUsuario)}
        style={styles.linhaUsuario}
      >
        <Avatar nomeUsuario={nomeUsuario} tamanho={50} cor="#AFAFAF" corTexto="#FFFFFF" />
        <Text numberOfLines={1} style={styles.nomeConfig}>
          {nomeParaExibir(nomeUsuario)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </Pressable>

      {/* Grupo 1: só Temas. */}
      <GrupoVidro cor="azul" style={[styles.grupo, styles.grupoTemas]}>
        <BotaoConfig
          icone={<MaterialCommunityIcons name="format-paint" size={24} color={COR_ICONE_AZUL} />}
          titulo="Temas"
          aoPressionar={function () {
            aoAbrirPagina('temas');
          }}
        />
      </GrupoVidro>

      
      <GrupoVidro cor="azul" style={[styles.grupo, styles.grupoPreferencias]}>
        <BotaoConfig
          icone={<MaterialCommunityIcons name="clock" size={24} color={COR_ICONE_AZUL} />}
          titulo="Data e Hora"
          aoPressionar={function () {
            aoAbrirPagina('dataHora');
          }}
        />
        <BotaoConfig
          icone={<MaterialCommunityIcons name="bell" size={24} color={COR_ICONE_AZUL} />}
          titulo="Notificações"
          aoPressionar={function () {
            aoAbrirPagina('notificacoes');
          }}
        />
        <BotaoConfig
          icone={<MaterialCommunityIcons name="database" size={24} color={COR_ICONE_AZUL} />}
          titulo="Dados"
          aoPressionar={function () {
            aoAbrirPagina('dados');
          }}
        />
        <BotaoConfig
          icone={<MaterialIcons name="accessibility" size={24} color={COR_ICONE_AZUL} />}
          titulo="Acessibilidade"
          aoPressionar={function () {
            aoAbrirPagina('acessibilidade');
          }}
        />
      </GrupoVidro>

      {/* Grupo 3: Feedback, Siga-nos e Sobre, com o degradê laranja. */}
      <GrupoVidro cor="laranja" style={[styles.grupo, styles.grupoContato]}>
        <BotaoConfig
          icone={<MaterialIcons name="feedback" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Feedback"
          aoPressionar={function () {
            aoAbrirPagina('feedback');
          }}
        />
        <BotaoConfig
          icone={<MaterialIcons name="contacts" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Siga-nos"
        />
        <BotaoConfig
          icone={<MaterialIcons name="description" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Sobre"
          aoPressionar={function () {
            aoAbrirPagina('sobre');
          }}
        />
      </GrupoVidro>
    </View>
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

  astro: {
    position: 'absolute',
    width: 161,
    height: 108,
    borderRadius: '50%',
    pointerEvents: 'none',
  },

  veuTema: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  linhaMenu: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
  },
  conteudo: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 25,
  },
 
  titulo: {
    fontSize: 32,
    color: '#558796',
  },
  card: {
    marginTop: 24,
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  circulo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#7A9AAA',
  },
  nomeTarefa: {
    flex: 1,
    marginLeft: 12,
    fontSize: 22,
    color: '#000000',
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
 
  veuConfig: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  
  configMiolo: {
    flex: 1,
    paddingTop: 47,
    paddingHorizontal: 33,
  },
  tituloConfig: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  linhaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    marginBottom: 35,
    paddingLeft: 19,
    paddingRight: 18,
  },
  
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGrandeArea: {
    alignItems: 'center',
    marginBottom: 18,
  },
  
  campoFeedback: {
    minHeight: 140,
    minWidth: 0,
    paddingHorizontal: 13,
    paddingTop: 12,
    color: '#000000',
    fontSize: 18,
    textAlignVertical: 'top',
  },
  contadorFeedback: {
    alignSelf: 'flex-end',
    paddingRight: 13,
    paddingBottom: 8,
    color: '#000000',
    fontSize: 14,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoFeedback: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  botaoCancelar: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  botaoEnviar: {
    backgroundColor: '#0088FF',
  },
 
  botaoDesativado: {
    opacity: 0.4,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotaoFeedback: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  avisoFeedback: {
    marginTop: 14,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
 
  rotuloNome: {
    color: '#000000',
    fontSize: 24,
  },

  campoNome: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    minHeight: 44,
    paddingVertical: 0,
    color: '#000000',
    fontSize: 24,
    textAlign: 'right',
  },
  nomeConfig: {
    flex: 1,
    marginLeft: 13,
    color: '#FFFFFF',
    fontSize: 20,
  },
  
  grupo: {
    borderRadius: 13,
    overflow: 'hidden',
  },
 
  camadaVidro: {
    ...StyleSheet.absoluteFillObject,
  },
 
  bordaVidro: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
 
  grupoTemas: {
    minHeight: 46,
    marginBottom: 15,
  },
  grupoPreferencias: {
    minHeight: 184,
    paddingTop: 3,
    marginBottom: 6,
  },
  grupoContato: {
    minHeight: 147,
    paddingTop: 9,
  },
  linhaConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingLeft: 13,
    paddingRight: 17,
  },
  linhaPressionada: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  textoConfig: {
    flex: 1,
    marginLeft: 12,
    color: '#000000',
    fontSize: 24,
  },

  cabecalhoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    marginTop: -10,
    marginBottom: 6,
  },
  espacoDaSeta: {
    width: 22,
  },
  linhaTema: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingLeft: 13,
    paddingRight: 17,
  },
  areaDesenhoTema: {
    width: 64,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  desenhoSelecionado: {
    borderColor: '#000000',
  },
  textoSelecionado: {
    fontWeight: '700',
  },

  grupoPagina: {
    marginBottom: 18,
  },

  textoSemDesenho: {
    marginLeft: 0,
  },
 
  tituloSecao: {
    marginBottom: 8,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  miniAstro: {
    width: 40,
    height: 27,
    borderRadius: '50%',
  },
  parDeAstros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  astroSobreposto: {
    marginLeft: -22,
  },
  
  rolagemConfig: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingLeft: 13,
    paddingRight: 17,
  },
  textosInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tituloInfo: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  textoInfo: {
    marginTop: 2,
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  
  valorDado: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
  },
  textoEstadoChave: {
    marginRight: 10,
    color: '#000000',
    fontSize: 14,
  },
  trilhoChave: {
    width: 51,
    height: 31,
    paddingHorizontal: 2,
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  trilhoLigado: {
    backgroundColor: '#34C759',
  },
  bolinhaChave: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  bolinhaLigada: {
    alignSelf: 'flex-end',
  },
  notaTemas: {
    marginTop: 14,
    paddingHorizontal: 4,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  miolo: {
    flex: 1,
  },
  foto: {
    position: 'absolute',
    backgroundColor: '#D9D9D9',
  },
  nomeUsuario: {
    position: 'absolute',
    color: '#1C1C1C',
  },
  divisor: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  textoItem: {
    position: 'absolute',
    color: '#1C1C1C',
  },
  textoSuave: {
    position: 'absolute',
    color: '#5C5C5C',
  },
  traco: {
    position: 'absolute',
    color: '#1C1C1C',
  },

  camadaBolha: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  fundoBolha: {
    ...StyleSheet.absoluteFillObject,
  },
  bolhaVidro: {
    position: 'absolute',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  tituloBolha: {
    color: '#1C1C1C',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  campoBolha: {
    minWidth: 0,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    color: '#1C1C1C',
  },
  avisoBolha: {
    marginTop: 8,
    color: '#8B1E1E',
    fontSize: 13,
  },
  notaBolha: {
    marginTop: 8,
    color: '#5C5C5C',
    fontSize: 13,
  },
  linhaBotoesBolha: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  botaoBolha: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  botaoBolhaCancelar: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  botaoBolhaAdicionar: {
    backgroundColor: '#0088FF',
  },
  textoBotaoBolhaEscuro: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
  },
  textoBotaoBolhaClaro: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
