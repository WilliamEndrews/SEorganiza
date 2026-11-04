import PaginaTarefas from '../../../tarefas/PaginaTarefas';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/tarefas/concluidas". "Desfazer" usa a mesma função do círculo do card,
// então a tarefa volta a ficar pendente e sai desta lista.
export default function RotaTarefasConcluidas() {
  const { tarefasAtivas, voltarAoMenu, alternarConcluida } = useOpcoes();
  const concluidas = tarefasAtivas.filter(function (tarefa) {
    return tarefa.concluida;
  });
  return (
    <PaginaTarefas
      titulo="Tarefas Concluídas"
      tarefas={concluidas}
      mensagemVazia="Nenhuma tarefa concluída ainda."
      acoes={[{ icone: 'arrow-undo-outline', rotulo: 'Desfazer', aoTocar: alternarConcluida }]}
      aoVoltar={voltarAoMenu}
    />
  );
}
