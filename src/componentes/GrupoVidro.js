import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  DEGRADE_AZUL,
  DEGRADE_AZUL_FIM,
  DEGRADE_AZUL_INICIO,
  DEGRADE_LARANJA,
  DEGRADE_LARANJA_FIM,
  DEGRADE_LARANJA_INICIO,
  OPACIDADE_VIDRO,
} from '../constantes/figma';
import { hexComAlfa } from '../utilidades/ajudantes';

// Retângulo com efeito de vidro, usado em todas as páginas de Configurações.
// Em cima do degradê (azul ou laranja) vão camadas que imitam o vidro do Figma:
// um brilho em cima à esquerda, uma sombra embaixo à direita e uma borda de luz.
// Refração e desfoque do Figma não existem no React Native, então ficaram de fora.
// As camadas vêm antes dos filhos (ficam atrás) e com pointerEvents 'none' (não pegam o toque).
export default function GrupoVidro({ cor, style, children }) {
  const azul = cor === 'azul';
  // As cores ganham transparência para o painel escuro aparecer atrás.
  // Para ajustar, mude só OPACIDADE_VIDRO em src/constantes/figma.js.
  const degrade = azul ? DEGRADE_AZUL : DEGRADE_LARANJA;
  return (
    <LinearGradient
      colors={[hexComAlfa(degrade[0], OPACIDADE_VIDRO), hexComAlfa(degrade[1], OPACIDADE_VIDRO)]}
      start={azul ? DEGRADE_AZUL_INICIO : DEGRADE_LARANJA_INICIO}
      end={azul ? DEGRADE_AZUL_FIM : DEGRADE_LARANJA_FIM}
      style={style}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.camadaVidro, { pointerEvents: 'none' }]}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.12)']}
        start={{ x: 0.4, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={[styles.camadaVidro, { pointerEvents: 'none' }]}
      />
      <View style={[styles.bordaVidro, { pointerEvents: 'none' }]} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  camadaVidro: {
    ...StyleSheet.absoluteFill,
  },
  // Borda de luz: mais clara em cima e à esquerda, de onde vem a luz.
  bordaVidro: {
    ...StyleSheet.absoluteFill,
    borderRadius: 13,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
});
