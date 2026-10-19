import { router } from 'expo-router';
import PaginaFeedback from '../../../configuracoes/PaginaFeedback';

// Rota "/configuracoes/feedback".
export default function RotaFeedback() {
  return (
    <PaginaFeedback
      aoVoltar={function () {
        router.back();
      }}
    />
  );
}
