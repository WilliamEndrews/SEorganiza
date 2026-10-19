import PaginaTarefas from '../../../tarefas/PaginaTarefas';
import { TAREFAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/tarefas/excluidas".
export default function RotaTarefasExcluidas() {
  const { voltarAoMenu } = useOpcoes();
  const excluidas = TAREFAS.filter(function (tarefa) {
    return tarefa.excluida;
  });
  return (
    <PaginaTarefas
      titulo="Tarefas Excluídas"
      tarefas={excluidas}
      mensagemVazia="Nenhuma tarefa excluída."
      aoVoltar={voltarAoMenu}
    />
  );
}
