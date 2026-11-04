import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { vidro } from '../constantes/figma';
import { formatarData } from '../utilidades/ajudantes';

// Bolha que abre no botão +. Segue o mesmo estilo da BolhaNovaCategoria.
// Props (aula 01): aparecer (animação 0 a 1), categorias, data ('AAAA-MM-DD'),
// aoAdicionar(titulo, categoriaId), aoFechar e escalaX/escalaY (medidas do Figma).
// Quando a bolha fecha, os estados somem junto, então ela sempre abre limpa.
export default function BolhaNovaTarefa({
  aparecer,
  categorias,
  data,
  aoAdicionar,
  aoFechar,
  escalaX,
  escalaY,
}) {
  const [titulo, setTitulo] = useState('');
  // Começa na primeira categoria para nunca ficar sem nenhuma.
  const [categoriaId, setCategoriaId] = useState(categorias[0].id);
  const [aviso, setAviso] = useState('');

  // Validação (aula 02): o trim() faz "   " contar como vazio.
  function confirmar() {
    const limpo = titulo.trim();
    if (!limpo) {
      setAviso('Digite um nome');
      return;
    }
    aoAdicionar(limpo, categoriaId);
  }

  return (
    <View style={[styles.camada, { pointerEvents: 'box-none' }]}>
      {/* Fundo escurecido: tocar fora da bolha também fecha. */}
      <Pressable
        onPress={aoFechar}
        accessibilityRole="button"
        accessibilityLabel="Fechar nova tarefa"
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
        <Text style={styles.titulo}>Nova tarefa</Text>
        <TextInput
          value={titulo}
          onChangeText={function (texto) {
            setTitulo(texto);
            setAviso('');
          }}
          placeholder="Nome da tarefa"
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          maxLength={40}
          autoFocus
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

        <Text style={styles.nota}>Para o dia {formatarData(data)}</Text>

        <View style={styles.linhaBotoes}>
          <Pressable
            onPress={aoFechar}
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
            <Text style={[styles.textoBotao, styles.textoClaro]}>Adicionar</Text>
          </Pressable>
        </View>
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
  textoBotao: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
  },
  textoClaro: {
    color: '#FFFFFF',
  },
});
