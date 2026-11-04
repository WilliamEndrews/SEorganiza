import { useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORIAS_FIXAS, LIMITE_CATEGORIAS_NOVAS } from '../constantes/dados';
import { inicialDoNome, nomeParaExibir } from '../utilidades/ajudantes';
import BolhaNovaCategoria from './BolhaNovaCategoria';

export default function PainelOpcoes({ escala, nomeUsuario, categorias, aoAdicionarCategoria }) {
  // Converte uma medida do Figma para a tela atual. A mesma escala vale para
  // largura e altura, então nada estica no tablet.
  function medida(valor) {
    return valor * escala;
  }

  // Medidas do Figma. Cada categoria nova empurra o resto do menu 37 para baixo.
  const PASSO_CATEGORIA = 37;
  const TOPO_PRIMEIRA = 166;
  const FOLGA_NOVA = 58;
  // Quando bate o limite, some o "Nova Categoria" e o divisor sobe.
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
  // Passando uma função pro useState, o Animated.Value é criado uma vez só.
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
            left: medida(21),
            top: medida(26),
            width: medida(50),
            height: medida(50),
            borderRadius: medida(25),
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ color: '#1C1C1C', fontSize: medida(22), fontWeight: '700' }}>
          {inicialDoNome(nomeUsuario)}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.nomeUsuario,
          { left: medida(85), top: medida(39), width: medida(190), fontSize: medida(18) },
        ]}
      >
        {nomeParaExibir(nomeUsuario)}
      </Text>

      <View style={[styles.divisor, { left: medida(5), top: medida(91), width: medida(277) }]} />

      <Ionicons
        name="folder-outline"
        size={medida(22)}
        color="#1C1C1C"
        style={{ position: 'absolute', left: medida(43), top: medida(113) }}
      />
      <Text
        style={[styles.textoItem, { left: medida(72), top: medida(110), fontSize: medida(18) }]}
      >
        Categorias
      </Text>

      {/* Cada categoria abre /categoria/[id]. A área de toque tem 34 de altura
          para não encostar na categoria vizinha. */}
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
                { top: medida(topo - 6), width: medida(270), height: medida(34) },
              ])}
            >
              <Text
                style={[styles.traco, { left: medida(21), top: medida(6), fontSize: medida(18) }]}
              >
                —
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.textoItem,
                  { left: medida(55), top: medida(6), width: medida(210), fontSize: medida(16) },
                ]}
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
            { left: medida(8), top: medida(topoNova), width: medida(260), height: medida(36) },
          ]}
        >
          <Ionicons name="add" size={medida(15)} color="#3A3A3A" />
          <Text
            style={[
              styles.textoSuave,
              { position: 'relative', fontSize: medida(14), marginLeft: medida(10) },
            ]}
          >
            Nova Categoria
          </Text>
        </Pressable>
      ) : null}

      <View
        style={[
          styles.divisor,
          { left: medida(5), top: medida(topoDivisor2), width: medida(277) },
        ]}
      />

      {/* Link com asChild não aceita lista de estilos no filho, então o flatten
          junta tudo num objeto só. */}
      <Link href="/configuracoes" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={StyleSheet.flatten([
            styles.linhaMenu,
            { left: medida(8), top: medida(topoConfig), width: medida(270), height: medida(48) },
          ])}
        >
          <Ionicons name="settings-outline" size={medida(26)} color="#1C1C1C" />
          <Text
            style={[
              styles.textoItem,
              { position: 'relative', fontSize: medida(18), marginLeft: medida(12) },
            ]}
          >
            Configurações
          </Text>
        </Pressable>
      </Link>
      {/* Linhas de tarefas com área de toque de 46 de altura. */}
      <Link href="/tarefas/concluidas" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tarefas Concluídas"
          style={StyleSheet.flatten([
            styles.linhaLink,
            { top: medida(topoConcluidas - 10), width: medida(270), height: medida(46) },
          ])}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={medida(26)}
            color="#1C1C1C"
            style={{ position: 'absolute', left: medida(19), top: medida(10) }}
          />
          <Text
            style={[styles.textoItem, { left: medida(57), top: medida(10), fontSize: medida(18) }]}
          >
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
            { top: medida(topoExcluidas - 10), width: medida(270), height: medida(46) },
          ])}
        >
          <Ionicons
            name="trash-outline"
            size={medida(24)}
            color="#1C1C1C"
            style={{ position: 'absolute', left: medida(17), top: medida(10) }}
          />
          <Text
            style={[styles.textoItem, { left: medida(55), top: medida(10), fontSize: medida(18) }]}
          >
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
          escala={escala}
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
  // Letras em negrito: a fonte fina sumia em cima do vidro.
  nomeUsuario: {
    position: 'absolute',
    color: '#1C1C1C',
    fontWeight: '700',
  },
  divisor: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  textoItem: {
    position: 'absolute',
    color: '#1C1C1C',
    fontWeight: '700',
  },
  textoSuave: {
    position: 'absolute',
    color: '#3A3A3A',
    fontWeight: '600',
  },
  traco: {
    position: 'absolute',
    color: '#1C1C1C',
    fontWeight: '700',
  },
  linhaMenu: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
  },
  // Linha que abre uma rota. A posição dos filhos conta a partir do topo dela.
  linhaLink: {
    position: 'absolute',
    left: 0,
  },
});
