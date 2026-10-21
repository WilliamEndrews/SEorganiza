import PaginaCalendario from '../../calendario/PaginaCalendario';
import { temaDoModo } from '../../constantes/temas';
import { useOpcoes } from '../../contexto/OpcoesContext';

// Rota "/calendario" Expo Router).
// Só por existir com este nome dentro de src/app/(principal)/, o arquivo já vira

// lê o tema do Context e entrega a página pronta, que mora fora de src/app/.
export default function RotaCalendario() {
  const { modoTema } = useOpcoes();
  return <PaginaCalendario tema={temaDoModo(modoTema)} />;
}
