import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { estilosConfig } from '../configuracoes/estilosConfig';

// Cabeçalho das páginas de opções: a seta e o título formam um botão só, que
// volta para a tela anterior (a lista de Configurações ou o menu). O espaço vazio
// à direita, do tamanho da seta, mantém o título centralizado.
export default function CabecalhoPagina({
  titulo,
  aoVoltar,
  rotuloVoltar = 'Voltar para Configurações',
}) {
  return (
    <Pressable
      onPress={aoVoltar}
      accessibilityRole="button"
      accessibilityLabel={rotuloVoltar}
      style={styles.cabecalhoPagina}
    >
      <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      <Text style={estilosConfig.tituloConfig}>{titulo}</Text>
      <View style={styles.espacoDaSeta} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Medidas minhas, pois o Figma não desenha as páginas internas.
  // O cabeçalho tem 44 de altura para a área de toque ficar confortável.
  cabecalhoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    marginTop: -10,
    marginBottom: 6,
  },
  espacoDaSeta: {
    width: 22,
  },
});
