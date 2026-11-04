import { StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import FormularioConta from '../../conta/FormularioConta';
import { FONTE_DESTAQUE_CONTA, FONTE_LINK_CONTA } from '../../constantes/figma';
import { useConta } from '../../contexto/ContaContext';

// Tela "/login" (Figma: "iPhone 14 Plus - 9"). Depois de entrar, o layout
// raiz troca para a tela principal sozinho.
export default function TelaLogin() {
  const { entrar } = useConta();

  return (
    <FormularioConta rotuloEmail="Email:" rotuloSenha="Senha:" textoBotao="entrar" aoEnviar={entrar}>
      <Link href="/cadastro" style={styles.link}>
        não tem conta?
        <Text style={styles.destaque}> cadastre-se</Text>
      </Link>
    </FormularioConta>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#000000',
    fontFamily: FONTE_LINK_CONTA,
    fontSize: 15,
    lineHeight: 20,
  },
  destaque: {
    fontFamily: FONTE_DESTAQUE_CONTA,
  },
});
