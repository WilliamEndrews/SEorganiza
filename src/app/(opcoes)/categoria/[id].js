import { useLocalSearchParams } from 'expo-router';
import PaginaCategoria from '../../../categorias/PaginaCategoria';
import { CATEGORIAS_FIXAS, TAREFAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota dinâmica "/categoria/[id]": o id vem do endereço, por exemplo
// /categoria/trabalho. A página busca a categoria no Context com esse id.
export default function RotaCategoria() {
  const { id } = useLocalSearchParams();
  const { buscarCategoriaPorId, excluirCategoria, voltarAoMenu } = useOpcoes();
  const categoria = buscarCategoriaPorId(id);
  const ehFixa = CATEGORIAS_FIXAS.some(function (fixa) {
    return fixa.id === id;
  });
  const tarefasDaCategoria = TAREFAS.filter(function (tarefa) {
    return tarefa.categoriaId === id && !tarefa.excluida;
  });

  return (
    <PaginaCategoria
      categoria={categoria}
      tarefas={tarefasDaCategoria}
      podeExcluir={!ehFixa}
      aoExcluir={function () {
        // Exclui só depois que o vidro sai da tela, para a página não trocar
        // para "não encontrada" no meio da animação.
        voltarAoMenu(function () {
          excluirCategoria(id);
        });
      }}
      aoVoltar={voltarAoMenu}
    />
  );
}
