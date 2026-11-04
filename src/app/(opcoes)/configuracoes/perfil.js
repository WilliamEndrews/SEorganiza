import { router } from 'expo-router';
import PaginaPerfil from '../../../configuracoes/PaginaPerfil';
import { useConta } from '../../../contexto/ContaContext';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/perfil". Conta só as tarefas fora da lixeira (tarefasAtivas).
// Ao sair da conta, o app volta para o Login.
export default function RotaPerfil() {
  const { nomeUsuario, mudarNome, tarefasAtivas } = useOpcoes();
  const { emailLogado, sair } = useConta();
  return (
    <PaginaPerfil
      nomeUsuario={nomeUsuario}
      email={emailLogado}
      aoMudarNome={mudarNome}
      aoSair={sair}
      tarefas={tarefasAtivas}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
