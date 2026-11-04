import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import GrupoVidro from '../componentes/GrupoVidro';
import { estilosConfig } from '../configuracoes/estilosConfig';

// Lista de tarefas das categorias e de Tarefas Concluídas/Excluídas (FlatList, aula 02).
// `rodape` (opcional) aparece embaixo da lista, tipo um botão.
// `acoes` (opcional) são botões que aparecem em cada linha, assim:
//   [{ icone: 'trash-outline', rotulo: 'Apagar', aoTocar: function (id) {...} }]
export default function ListaTarefas({ tarefas, mensagemVazia, rodape = null, acoes = [] }) {
  return (
    <FlatList
      data={tarefas}
      keyExtractor={function (tarefa) {
        return tarefa.id;
      }}
      renderItem={function ({ item }) {
        return <LinhaTarefa tarefa={item} acoes={acoes} />;
      }}
      ItemSeparatorComponent={Separador}
      ListEmptyComponent={<Text style={estilosConfig.notaPagina}>{mensagemVazia}</Text>}
      ListFooterComponent={rodape}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    />
  );
}

function LinhaTarefa({ tarefa, acoes }) {
  return (
    <GrupoVidro cor="azul" style={estilosConfig.grupo}>
      <View style={estilosConfig.linhaConfig}>
        <Ionicons
          name={tarefa.concluida ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color="#000000"
        />
        <Text numberOfLines={1} style={estilosConfig.textoConfig}>
          {tarefa.titulo}
        </Text>
        {/* Um botão para cada ação. O rótulo serve de key e de texto pro leitor de tela. */}
        {acoes.map(function (acao) {
          return (
            <Pressable
              key={acao.rotulo}
              onPress={function () {
                acao.aoTocar(tarefa.id);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={acao.rotulo + ': ' + tarefa.titulo}
              style={function (estado) {
                return [styles.botaoAcao, estado.pressed ? styles.pressionado : null];
              }}
            >
              <Ionicons name={acao.icone} size={22} color="#000000" />
            </Pressable>
          );
        })}
      </View>
    </GrupoVidro>
  );
}

function Separador() {
  return <View style={styles.separador} />;
}

const styles = StyleSheet.create({
  conteudo: {
    paddingBottom: 24,
  },
  separador: {
    height: 8,
  },
  botaoAcao: {
    marginLeft: 12,
  },
  pressionado: {
    opacity: 0.5,
  },
});
