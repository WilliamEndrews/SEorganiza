import { router } from 'expo-router';
import PaginaDados from '../../../configuracoes/PaginaDados';
import { TAREFAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/dados".
export default function RotaDados() {
  const { categorias, apagarDadosSalvos } = useOpcoes();
  return (
    <PaginaDados
      tarefas={TAREFAS}
      categorias={categorias}
      aoApagarDados={apagarDadosSalvos}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
