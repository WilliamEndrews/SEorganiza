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

// Retângulo de grupo com efeito de vidro, usado em TODAS as páginas de Configurações.
// A base é o mesmo degradê de antes (azul ou laranja), então a tonalidade não muda.
// Sobre ele vão camadas que imitam o vidro do Figma. Valores do Figma:
//   Luz -45° a 80%, Refração 80, Profundidade 20, Dispersão 50, Gelo 4, Splay 0.
// O que foi aproximado:
//   - Luz -45° (vinda do canto de cima à esquerda): brilho suave no canto de cima à esquerda
//     e uma borda mais clara em cima e à esquerda, mais escura embaixo e à direita.
//   - Profundidade 20: sombra leve no canto de baixo à direita.
// O que NÃO dá para fazer aqui: Refração e Dispersão (distorcer e separar as cores do que
// está atrás) não existem no React Native. Gelo 4 é um desfoque mínimo do fundo, e como
// a base é um degradê opaco, não há fundo para desfocar. Splay 0 não muda nada.
// As camadas vêm ANTES dos filhos, então ficam atrás dos textos e dos ícones.
// O pointerEvents 'none' deixa o toque passar por elas até as linhas.
export default function GrupoVidro({ cor, style, children }) {
  const azul = cor === 'azul';
  // Translúcido: as duas cores do degradê ganham transparência, e o painel escuro
  // aparece por trás. Para ajustar, mude só OPACIDADE_VIDRO (em src/constantes/figma.js).
  const coresBase = (azul ? DEGRADE_AZUL : DEGRADE_LARANJA).map(function (hex) {
    return hexComAlfa(hex, OPACIDADE_VIDRO);
  });
  return (
    <LinearGradient
      colors={coresBase}
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
    ...StyleSheet.absoluteFillObject,
  },
  // Borda de luz: clara em cima e à esquerda (de onde vem a luz), escura embaixo e à direita.
  bordaVidro: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
});
