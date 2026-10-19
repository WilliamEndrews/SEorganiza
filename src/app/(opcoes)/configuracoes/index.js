import ListaConfiguracoes from '../../../configuracoes/ListaConfiguracoes';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes": a lista com o perfil e os três grupos.
export default function RotaConfiguracoes() {
  const { nomeUsuario, voltarAoMenu } = useOpcoes();
  return <ListaConfiguracoes nomeUsuario={nomeUsuario} aoVoltar={voltarAoMenu} />;
}
