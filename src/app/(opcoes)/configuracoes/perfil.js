import { router } from 'expo-router';
import PaginaPerfil from '../../../configuracoes/PaginaPerfil';
import { TAREFAS } from '../../../constantes/dados';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/perfil".
export default function RotaPerfil() {
  const { nomeUsuario, mudarNome } = useOpcoes();
  return (
    <PaginaPerfil
      nomeUsuario={nomeUsuario}
      aoMudarNome={mudarNome}
      tarefas={TAREFAS}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
