import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { vidro } from '../constantes/figma';
import { formatarData } from '../utilidades/ajudantes';

// Bolha da tarefa. Segue o mesmo estilo da BolhaNovaCategoria.
// Serve para duas coisas (o mesmo componente, reaproveitado):
// - sem `tarefa`: abre no botão + para criar uma tarefa nova no dia `data`;
// - com `tarefa`: abre ao segurar um card, já preenchida, para editar ou excluir.
// Props (aula 01): categorias, data, tarefa, aoSalvar(titulo, categoriaId),
// aoExcluir, aoFechar e escalaX/escalaY (medidas do Figma).
// Quando a bolha fecha, os estados somem junto, então ela sempre abre limpa.
// O "= null" deixa a prop opcional: cada modo só manda as props que usa.
export default function BolhaTarefa({
  categorias,
  data = null,
  tarefa = null,
  aoSalvar,
  aoExcluir = null,
  aoFechar,
  escalaX,
  escalaY,
}) {
  const editando = tarefa !== null;
  const [titulo, setTitulo] = useState(editando ? tarefa.titulo : '');
  // Tarefa nova começa na primeira categoria para nunca ficar sem nenhuma.
  const [categoriaId, setCategoriaId] = useState(
    editando ? tarefa.categoriaId : categorias[0].id
  );
  const [aviso, setAviso] = useState('');
  // Animação da bolha: 0 = escondida, 1 = na tela.
  const [aparecer] = useState(function () {
    return new Animated.Value(0);
  });

  // A bolha mesma anima a entrada assim que aparece na tela.
  useEffect(
    function () {
      Animated.timing(aparecer, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [aparecer]
  );

  // Anima a saída e só depois avisa o pai, que tira a bolha da tela.
  function sair() {
    Animated.timing(aparecer, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(function () {
      aoFechar();
    });
  }

  // Validação (aula 02): o trim() faz "   " contar como vazio.
  function confirmar() {
    const limpo = titulo.trim();
    if (!limpo) {
      setAviso('Digite um nome');
      return;
    }
    aoSalvar(limpo, categoriaId);
    sair();
  }

  function excluir() {
    aoExcluir();
    sair();
  }

  return (
    <View style={[styles.camada, { pointerEvents: 'box-none' }]}>
      {/* Fundo escurecido: tocar fora da bolha também fecha. */}
      <Pressable
        onPress={sair}
        accessibilityRole="button"
        accessibilityLabel={editando ? 'Fechar edição da tarefa' : 'Fechar nova tarefa'}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.escurecer, { opacity: aparecer }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.bolha,
          vidro,
          {
            left: 44 * escalaX,
            top: 160 * escalaY,
            width: 340 * escalaX,
            opacity: aparecer,
            transform: [
              {
                scale: aparecer.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
        />
        <Text style={styles.titulo}>{editando ? 'Editar tarefa' : 'Nova tarefa'}</Text>
        {/* Na edição o teclado não abre sozinho, para dar para ler a tarefa antes. */}
        <TextInput
          value={titulo}
          onChangeText={function (texto) {
            setTitulo(texto);
            setAviso('');
          }}
          placeholder="Nome da tarefa"
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          maxLength={40}
          autoFocus={!editando}
          onSubmitEditing={confirmar}
          accessibilityLabel="Nome da tarefa"
          style={styles.campo}
        />
        {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

        <Text style={styles.rotulo}>Categoria</Text>
        {/* Uma "pílula" para cada categoria. A escolhida fica azul. */}
        <View style={styles.linhaCategorias}>
          {categorias.map(function (categoria) {
            const escolhida = categoria.id === categoriaId;
            return (
              <Pressable
                key={categoria.id}
                onPress={function () {
                  setCategoriaId(categoria.id);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: escolhida }}
                style={[styles.pilula, escolhida && styles.pilulaEscolhida]}
              >
                <Text style={[styles.textoPilula, escolhida && styles.textoClaro]}>
                  {categoria.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.nota}>
          Para o dia {formatarData(editando ? tarefa.data : data)}
        </Text>

        <View style={styles.linhaBotoes}>
          <Pressable
            onPress={sair}
            accessibilityRole="button"
            style={[styles.botao, styles.botaoCancelar]}
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={confirmar}
            accessibilityRole="button"
            style={[styles.botao, styles.botaoAdicionar]}
          >
            <Text style={[styles.textoBotao, styles.textoClaro]}>
              {editando ? 'Salvar' : 'Adicionar'}
            </Text>
          </Pressable>
        </View>

        {/* Só na edição: manda a tarefa para Tarefas Excluídas. */}
        {editando ? (
          <Pressable
            onPress={excluir}
            accessibilityRole="button"
            accessibilityHint="A tarefa vai para Tarefas Excluídas"
            style={styles.botaoExcluir}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.textoBotao, styles.textoClaro]}>Excluir tarefa</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

// Mesmas medidas da BolhaNovaCategoria (essa tela não existe no Figma).
const styles = StyleSheet.create({
  camada: {
    ...StyleSheet.absoluteFill,
    zIndex: 4,
  },
  escurecer: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  bolha: {
    position: 'absolute',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  titulo: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  campo: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    color: '#1C1C1C',
    fontSize: 16,
  },
  aviso: {
    marginTop: 8,
    color: '#8B1E1E',
    fontSize: 13,
  },
  rotulo: {
    marginTop: 12,
    marginBottom: 6,
    color: '#1C1C1C',
    fontSize: 13,
    fontWeight: '700',
  },
  // flexWrap: as pílulas que não cabem na linha descem para a próxima.
  linhaCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pilula: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  pilulaEscolhida: {
    backgroundColor: '#0088FF',
  },
  textoPilula: {
    color: '#1C1C1C',
    fontSize: 13,
  },
  nota: {
    marginTop: 10,
    color: '#5C5C5C',
    fontSize: 13,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  botao: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  botaoCancelar: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  botaoAdicionar: {
    backgroundColor: '#0088FF',
  },
  // Vermelho do mesmo tom dos avisos. Fica numa linha só, embaixo dos outros.
  botaoExcluir: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#B3261E',
  },
  textoBotao: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
  },
  textoClaro: {
    color: '#FFFFFF',
  },
});
