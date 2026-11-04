import { FlatList, StyleSheet, Text, View } from 'react-native';
import CardTarefa from './CardTarefa';

// Lista de cards de tarefa (tela inicial e Calendário). FlatList da aula 02.
// keyExtractor diz que o id identifica cada card. ListEmptyComponent aparece
// quando não tem nenhuma tarefa.
// Props: tarefas, tema, mensagemVazia, aoConcluir(id) e aoEditar(id).
export default function ListaCards({ tarefas, tema, mensagemVazia, aoConcluir, aoEditar }) {
  return (
    <FlatList
      data={tarefas}
      keyExtractor={function (tarefa) {
        return tarefa.id;
      }}
      renderItem={function ({ item }) {
        return (
          <CardTarefa
            tarefa={item}
            tema={tema}
            aoConcluir={function () {
              aoConcluir(item.id);
            }}
            aoEditar={function () {
              aoEditar(item.id);
            }}
          />
        );
      }}
      ItemSeparatorComponent={Separador}
      ListEmptyComponent={
        <Text style={[styles.vazio, { color: tema.titulo }]}>{mensagemVazia}</Text>
      }
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    />
  );
}

function Separador() {
  return <View style={styles.separador} />;
}

const styles = StyleSheet.create({
  // paddingTop: espaço do Figma entre o título e o primeiro card.
  // paddingBottom: deixa o último card subir acima do botão +.
  conteudo: {
    paddingTop: 24,
    paddingBottom: 140,
  },
  separador: {
    height: 12,
  },
  vazio: {
    fontSize: 18,
    lineHeight: 24,
  },
});
