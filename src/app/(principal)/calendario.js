import PaginaCalendario from '../../calendario/PaginaCalendario';
import { temaDoModo } from '../../constantes/temas';
import { useOpcoes } from '../../contexto/OpcoesContext';

// Rota "/calendario" (aula 03). O nome do arquivo já vira o endereço.
// Ela só pega o tema do Context e mostra a página, que fica fora de src/app/.
export default function RotaCalendario() {
  const { modoTema } = useOpcoes();
  return <PaginaCalendario tema={temaDoModo(modoTema)} />;
}
