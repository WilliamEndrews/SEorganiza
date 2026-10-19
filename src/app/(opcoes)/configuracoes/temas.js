import { router } from 'expo-router';
import PaginaTemas from '../../../configuracoes/PaginaTemas';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/temas".
export default function RotaTemas() {
  const { modoTema, escolherTema } = useOpcoes();
  return (
    <PaginaTemas
      modoTema={modoTema}
      aoEscolher={escolherTema}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
