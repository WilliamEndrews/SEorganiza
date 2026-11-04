import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { estilosConfig } from '../configuracoes/estilosConfig';

// Cabeçalho das páginas de opções: seta + título são um botão só que volta
// para a tela anterior. O espaço vazio à direita deixa o título no centro.
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
  // Medidas nossas (o Figma não tem as páginas internas).
  // Altura 44 para ficar fácil de tocar.
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
