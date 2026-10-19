import { router } from 'expo-router';
import PaginaDataHora from '../../../configuracoes/PaginaDataHora';
import { useOpcoes } from '../../../contexto/OpcoesContext';

// Rota "/configuracoes/data-hora".
export default function RotaDataHora() {
  const { primeiroDiaSemana, escolherPrimeiroDia, formatoHora, escolherFormatoHora } =
    useOpcoes();
  return (
    <PaginaDataHora
      primeiroDiaSemana={primeiroDiaSemana}
      aoEscolherPrimeiroDia={escolherPrimeiroDia}
      formatoHora={formatoHora}
      aoEscolherFormatoHora={escolherFormatoHora}
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
