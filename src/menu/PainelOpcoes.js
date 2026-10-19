import { useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORIAS_FIXAS, LIMITE_CATEGORIAS_NOVAS } from '../constantes/dados';
import { inicialDoNome, nomeParaExibir } from '../utilidades/ajudantes';
import BolhaNovaCategoria from './BolhaNovaCategoria';

export default function PainelOpcoes({
  escalaX,
  escalaY,
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

  // Medidas do Figma para as três primeiras linhas. Cada categoria extra empurra
  // o resto do menu para baixo, no mesmo passo de 37.
  const PASSO_CATEGORIA = 37;
  const TOPO_PRIMEIRA = 166;
  const FOLGA_NOVA = 58;
  // Sem a linha "Nova Categoria" (limite atingido), o divisor sobe para perto
  // da última categoria.
  const FOLGA_SEM_NOVA = 28;
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
  const topoDivisor2 =
    (podeAdicionar ? topoNova : topoCategoria(categorias.length - 1) + FOLGA_SEM_NOVA) +
    FOLGA_DIVISOR;
  const topoConfig = topoDivisor2 + FOLGA_CONFIG;
  const topoConcluidas = topoConfig + FOLGA_CONCLUIDAS;
  const topoExcluidas = topoConcluidas + FOLGA_EXCLUIDAS;

  const [bolhaNaTela, setBolhaNaTela] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [avisoBolha, setAvisoBolha] = useState('');
  // A função dentro do useState faz o Animated.Value ser criado uma vez só.
  const [aparecerBolha] = useState(function () {
    return new Animated.Value(0);
  });

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
      return categoria.nome.toLowerCase() === limpo.toLowerCase();
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

      {/* Cada categoria abre a rota /categoria/[id]. A área de toque começa 6 acima
          do texto e tem 34 de altura, para não encostar na categoria vizinha. */}
      {categorias.map(function (categoria, indice) {
        const topo = topoCategoria(indice);
        return (
          <Link
            key={categoria.id}
            href={{ pathname: '/categoria/[id]', params: { id: categoria.id } }}
            asChild
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={categoria.nome}
              style={StyleSheet.flatten([
                styles.linhaLink,
                { top: y(topo - 6), width: x(270), height: y(34) },
              ])}
            >
              <Text style={[styles.traco, { left: x(21), top: y(6), fontSize: y(18) }]}>—</Text>
              <Text
                numberOfLines={1}
                style={[styles.textoItem, { left: x(55), top: y(6), width: x(210), fontSize: y(16) }]}
              >
                {categoria.nome}
              </Text>
            </Pressable>
          </Link>
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

      {/* O Link com asChild não aceita uma lista de estilos no filho; o flatten junta
          a lista num objeto só. */}
      <Link href="/configuracoes" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={StyleSheet.flatten([
            styles.linhaMenu,
            { left: x(8), top: y(topoConfig), width: x(270), height: y(48) },
          ])}
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
      </Link>
      {/* As duas linhas de tarefas: a área de toque começa 10 acima do ícone e tem 46. */}
      <Link href="/tarefas/concluidas" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tarefas Concluídas"
          style={StyleSheet.flatten([
            styles.linhaLink,
            { top: y(topoConcluidas - 10), width: x(270), height: y(46) },
          ])}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={x(26)}
            color="#1C1C1C"
            style={{ position: 'absolute', left: x(19), top: y(10) }}
          />
          <Text style={[styles.textoItem, { left: x(57), top: y(10), fontSize: y(18) }]}>
            Tarefas Concluídas
          </Text>
        </Pressable>
      </Link>
      <Link href="/tarefas/excluidas" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tarefas Excluídas"
          style={StyleSheet.flatten([
            styles.linhaLink,
            { top: y(topoExcluidas - 10), width: x(270), height: y(46) },
          ])}
        >
          <Ionicons
            name="trash-outline"
            size={x(24)}
            color="#1C1C1C"
            style={{ position: 'absolute', left: x(17), top: y(10) }}
          />
          <Text style={[styles.textoItem, { left: x(55), top: y(10), fontSize: y(18) }]}>
            Tarefas Excluídas
          </Text>
        </Pressable>
      </Link>

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

const styles = StyleSheet.create({
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
  linhaMenu: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
  },
  // Linha que leva a uma rota. Os filhos continuam com posição absoluta, agora
  // medida a partir do topo da linha.
  linhaLink: {
    position: 'absolute',
    left: 0,
  },
});
