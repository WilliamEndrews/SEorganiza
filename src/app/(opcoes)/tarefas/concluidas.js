import PaginaTarefas from '../../../tarefas/PaginaTarefas';
import { TAREFAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/tarefas/concluidas".
export default function RotaTarefasConcluidas() {
  const { voltarAoMenu } = useOpcoes();
  const concluidas = TAREFAS.filter(function (tarefa) {
    return tarefa.concluida && !tarefa.excluida;
  });
  return (
    <PaginaTarefas
      titulo="Tarefas Concluídas"
      tarefas={concluidas}
      mensagemVazia="Nenhuma tarefa concluída ainda."
      aoVoltar={voltarAoMenu}
    />
  );
}
