import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  COR_BOTAO_CONTA,
  COR_CAMPO_CONTA,
  FONTE_TITULO_CONTA,
  FUNDO_CONTA,
} from '../constantes/figma';

// O mesmo logo do Calendário.
const LOGO = require('../../assets/logo-seorganize.png');

// Formulário do Login e do Cadastro. As duas telas são quase iguais, então virou
// um componente só com props (aula 01).
// aoEnviar(email, senha) devolve um texto de erro, ou null se deu certo.
// children é o que vai entre os campos e o botão (o link do Login).
export default function FormularioConta({
  rotuloEmail,
  rotuloSenha,
  textoBotao,
  senhaMinima = 0,
  aoEnviar,
  children = null,
}) {
  // Campos controlados (aula 02): o texto fica guardado no estado.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Vazio = sem aviso na tela.
  const [aviso, setAviso] = useState('');

  // Validação antes de enviar (aula 02).
  async function enviar() {
    if (email.trim() === '' || senha === '') {
      setAviso('Preencha o e-mail e a senha');
      return;
    }
    if (!email.includes('@')) {
      setAviso('Digite um e-mail válido');
      return;
    }
    if (senha.length < senhaMinima) {
      setAviso('A senha precisa de ' + senhaMinima + ' caracteres');
      return;
    }
    // Se der certo, o layout raiz troca de tela sozinho. Aqui só tratamos o erro.
    const erro = await aoEnviar(email, senha);
    if (erro) setAviso(erro);
  }

  return (
    <View style={styles.tela}>
      <LinearGradient
        colors={FUNDO_CONTA.cores}
        locations={FUNDO_CONTA.posicoes}
        style={StyleSheet.absoluteFill}
      />
      {/* ScrollView para dar para rolar até o botão com o teclado aberto.
          "handled" faz o toque no botão funcionar sem fechar o teclado antes. */}
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.coluna}>
          <Image source={LOGO} style={styles.logo} accessibilityLabel="SEorganize" />

          <Text style={[styles.rotulo, styles.primeiroRotulo]}>{rotuloEmail}</Text>
          <TextInput
            value={email}
            onChangeText={function (texto) {
              setEmail(texto);
              setAviso('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            accessibilityLabel={rotuloEmail}
            style={styles.campo}
          />

          <Text style={[styles.rotulo, styles.segundoRotulo]}>{rotuloSenha}</Text>
          <TextInput
            value={senha}
            onChangeText={function (texto) {
              setSenha(texto);
              setAviso('');
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={rotuloSenha}
            style={styles.campo}
          />

          {/* O aviso só aparece quando tem erro. */}
          {aviso !== '' ? (
            <Text accessibilityLiveRegion="polite" style={styles.aviso}>
              {aviso}
            </Text>
          ) : null}

          <View style={styles.areaLink}>{children}</View>

          <Pressable
            onPress={enviar}
            accessibilityRole="button"
            accessibilityLabel={textoBotao}
            style={function (estado) {
              return [styles.botao, estado.pressed ? styles.botaoPressionado : null];
            }}
          >
            <Text style={styles.textoBotao}>{textoBotao}</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

// Medidas tiradas do Figma (tela de 428×926).
const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: FUNDO_CONTA.base,
  },
  // Centraliza a coluna na altura da tela. No Figma ela fica 28 px acima do
  // meio, por isso o paddingBottom maior (56) sobe a coluna esses 28 px.
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 56,
  },
  coluna: {
    width: 280,
  },
  logo: {
    width: 92,
    height: 92,
    alignSelf: 'center',
  },
  rotulo: {
    marginLeft: 8,
    color: '#000000',
    fontFamily: FONTE_TITULO_CONTA,
    fontSize: 32,
    lineHeight: 40,
  },
  primeiroRotulo: {
    marginTop: 43,
    marginBottom: 13,
  },
  segundoRotulo: {
    marginTop: 25,
    marginBottom: 15,
  },
  campo: {
    height: 52,
    paddingHorizontal: 12,
    backgroundColor: COR_CAMPO_CONTA,
    color: '#000000',
    fontSize: 18,
  },
  // O Figma não tem o aviso, então o estilo é nosso.
  aviso: {
    marginTop: 10,
    color: '#B00020',
    fontSize: 15,
    fontWeight: '700',
  },
  areaLink: {
    marginTop: 21,
    minHeight: 20,
  },
  botao: {
    alignSelf: 'center',
    width: 163,
    height: 36,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COR_BOTAO_CONTA,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  // lineHeight igual à altura do botão (36) para o texto ficar centralizado.
  textoBotao: {
    color: '#000000',
    fontFamily: FONTE_TITULO_CONTA,
    fontSize: 32,
    lineHeight: 36,
  },
});
