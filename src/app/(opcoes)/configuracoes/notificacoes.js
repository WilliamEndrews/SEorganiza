import { router } from 'expo-router';
import PaginaNotificacoes from '../../../configuracoes/PaginaNotificacoes';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/notificacoes".
export default function RotaNotificacoes() {
  const { avisosDemo, alternarAviso } = useOpcoes();
  return (
    <PaginaNotificacoes
      avisosDemo={avisosDemo}
      aoAlternarAviso={alternarAviso}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
