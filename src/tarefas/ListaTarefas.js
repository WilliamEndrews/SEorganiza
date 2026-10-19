import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import GrupoVidro from '../componentes/GrupoVidro';
import { estilosConfig } from '../configuracoes/estilosConfig';

// Lista de tarefas usada pelas categorias e por Tarefas Concluídas e Excluídas.
// É uma FlatList (aula 02): ela só desenha as linhas que aparecem na tela, o que
// importa quando a lista cresce. Lista vazia mostra `mensagemVazia`.
// `rodape` é opcional e aparece embaixo da lista (por exemplo, um botão).
export default function ListaTarefas({ tarefas, mensagemVazia, rodape = null }) {
  return (
    <FlatList
      data={tarefas}
      keyExtractor={function (tarefa) {
        return tarefa.id;
      }}
      renderItem={function ({ item }) {
        return <LinhaTarefa tarefa={item} />;
      }}
      ItemSeparatorComponent={Separador}
      ListEmptyComponent={<Text style={estilosConfig.notaPagina}>{mensagemVazia}</Text>}
      ListFooterComponent={rodape}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    />
  );
}

function LinhaTarefa({ tarefa }) {
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
});
