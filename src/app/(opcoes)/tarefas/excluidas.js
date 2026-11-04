import PaginaTarefas from '../../../tarefas/PaginaTarefas';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/tarefas/excluidas": a lixeira. Dá para Restaurar a tarefa
// ou Apagar de vez.
export default function RotaTarefasExcluidas() {
  const { tarefas, voltarAoMenu, restaurarTarefa, apagarTarefa } = useOpcoes();
  const excluidas = tarefas.filter(function (tarefa) {
    return tarefa.excluida;
  });
  return (
    <PaginaTarefas
      titulo="Tarefas Excluídas"
      tarefas={excluidas}
      mensagemVazia="Nenhuma tarefa excluída. Para excluir, segure a tarefa na tela inicial."
      acoes={[
        { icone: 'arrow-undo-outline', rotulo: 'Restaurar', aoTocar: restaurarTarefa },
        { icone: 'trash-outline', rotulo: 'Apagar de vez', aoTocar: apagarTarefa },
      ]}
      aoVoltar={voltarAoMenu}
    />
  );
}
