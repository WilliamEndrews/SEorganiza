import { useLocalSearchParams } from 'expo-router';
import PaginaCategoria from '../../../categorias/PaginaCategoria';
import { CATEGORIAS_FIXAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota dinâmica "/categoria/[id]". O id vem do endereço (tipo /categoria/trabalho)
// pelo useLocalSearchParams, e com ele buscamos a categoria no Context.
export default function RotaCategoria() {
  const { id } = useLocalSearchParams();
  const { buscarCategoriaPorId, excluirCategoria, voltarAoMenu, tarefasAtivas } = useOpcoes();
  const categoria = buscarCategoriaPorId(id);
  const ehFixa = CATEGORIAS_FIXAS.some(function (fixa) {
    return fixa.id === id;
  });
  const tarefasDaCategoria = tarefasAtivas.filter(function (tarefa) {
    return tarefa.categoriaId === id;
  });

  return (
    <PaginaCategoria
      categoria={categoria}
      tarefas={tarefasDaCategoria}
      podeExcluir={!ehFixa}
      aoExcluir={function () {
        // Só exclui depois que o vidro sai da tela, senão aparece
        // "não encontrada" no meio da animação.
        voltarAoMenu(function () {
          excluirCategoria(id);
        });
      }}
      aoVoltar={voltarAoMenu}
    />
  );
}
