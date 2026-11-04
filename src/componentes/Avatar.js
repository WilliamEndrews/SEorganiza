import { StyleSheet, Text, View } from 'react-native';

import { inicialDoNome } from '../utilidades/ajudantes';

// Círculo do perfil. Ainda não tem foto: mostra a inicial do nome, ou fica liso.
// É só enfeite: o leitor de tela lê o nome na linha ao lado.
export default function Avatar({ nomeUsuario, tamanho, cor, corTexto }) {
  return (
    <View
      accessible={false}
      style={[
        styles.avatar,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor },
      ]}
    >
      <Text style={{ color: corTexto, fontSize: tamanho * 0.45, fontWeight: '700' }}>
        {inicialDoNome(nomeUsuario)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
