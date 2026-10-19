import { router } from 'expo-router';
import PaginaSobre from '../../../configuracoes/PaginaSobre';

// Rota "/configuracoes/sobre".
export default function RotaSobre() {
  return (
    <PaginaSobre
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
