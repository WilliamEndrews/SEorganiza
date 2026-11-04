import { router } from 'expo-router';
import PaginaDados from '../../../configuracoes/PaginaDados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/dados". Conta só as tarefas fora da lixeira (tarefasAtivas).
export default function RotaDados() {
  const { tarefasAtivas, categorias, apagarDadosSalvos } = useOpcoes();
  return (
    <PaginaDados
      tarefas={tarefasAtivas}
      categorias={categorias}
      aoApagarDados={apagarDadosSalvos}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
