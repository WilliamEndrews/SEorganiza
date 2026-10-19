import { router } from 'expo-router';
import PaginaAcessibilidade from '../../../configuracoes/PaginaAcessibilidade';

// Rota "/configuracoes/acessibilidade".
export default function RotaAcessibilidade() {
  return (
    <PaginaAcessibilidade
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
