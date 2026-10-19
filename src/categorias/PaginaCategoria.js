import { Pressable, StyleSheet, Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import { estilosConfig } from '../configuracoes/estilosConfig';
import ListaTarefas from '../tarefas/ListaTarefas';

// Página de uma categoria: as tarefas dela numa FlatList.
// Se o endereço tiver um id que não existe (por exemplo /categoria/xyz),
// `categoria` chega vazia e a página avisa, como o "aluno não encontrado" da aula 03.
// Só as categorias criadas pelo usuário mostram o botão de excluir.
export default function PaginaCategoria({ categoria, tarefas, podeExcluir, aoExcluir, aoVoltar }) {
  if (!categoria) {
    return (
      <View style={estilosConfig.configMiolo}>
        <CabecalhoPagina titulo="Categoria" aoVoltar={aoVoltar} rotuloVoltar="Voltar ao menu" />
        <Text style={styles.aviso}>Categoria não encontrada.</Text>
        <Text style={estilosConfig.notaPagina}>
          Ela pode ter sido excluída, ou o endereço está errado.
        </Text>
      </View>
    );
  }

  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo={categoria.nome} aoVoltar={aoVoltar} rotuloVoltar="Voltar ao menu" />
      <ListaTarefas
        tarefas={tarefas}
        mensagemVazia="Nenhuma tarefa nesta categoria ainda. O app ainda não tem tela para criar tarefas."
        rodape={
          podeExcluir ? (
            <Pressable
              onPress={aoExcluir}
              accessibilityRole="button"
              accessibilityLabel="Excluir categoria"
              style={function (estado) {
                return [styles.botaoExcluir, estado.pressed ? styles.botaoPressionado : null];
              }}
            >
              <Text style={styles.textoBotao}>Excluir categoria</Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

// Medidas minhas, pois o Figma não desenha essa página. O botão segue o de Dados.
const styles = StyleSheet.create({
  aviso: {
    marginTop: 14,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  botaoExcluir: {
    marginTop: 18,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#D93025',
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
