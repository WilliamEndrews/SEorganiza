import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { estilosConfig } from './estilosConfig';

// Página Feedback: um campo de texto e dois botões, Enviar e Cancelar.
// O ENVIO NÃO ESTÁ CONECTADO: não existe servidor nem e-mail por trás.
// Por isso, ao tocar em Enviar, o app só avisa isso com franqueza e mantém o texto.
// O rascunho vive aqui dentro (useState local): se sair da página, ele se perde.
export default function PaginaFeedback({ aoVoltar }) {
  const [texto, setTexto] = useState('');
  const [avisoVisivel, setAvisoVisivel] = useState(false);
  const semTexto = texto.trim().length === 0;

  function mudarTexto(novoTexto) {
    setTexto(novoTexto);
    // Se o usuário voltou a escrever, o aviso anterior já não vale.
    setAvisoVisivel(false);
  }

  function aoEnviar() {
    // Nada é enviado. Só mostramos o aviso.
    setAvisoVisivel(true);
  }

  function aoCancelar() {
    // Cancelar apaga o rascunho e volta para a lista.
    setTexto('');
    setAvisoVisivel(false);
    aoVoltar();
  }

  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Feedback" aoVoltar={aoVoltar} />

      <GrupoVidro cor="laranja" style={[estilosConfig.grupo, estilosConfig.grupoPagina]}>
        <TextInput
          value={texto}
          onChangeText={mudarTexto}
          placeholder="Escreva aqui sua sugestão ou problema"
          placeholderTextColor="rgba(0, 0, 0, 0.75)"
          multiline
          maxLength={500}
          accessibilityLabel="Mensagem de feedback"
          style={styles.campoFeedback}
        />
        <Text style={styles.contadorFeedback}>{texto.length}/500</Text>
      </GrupoVidro>

      <View style={styles.linhaBotoes}>
        <Pressable
          onPress={aoCancelar}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          style={function (estado) {
            return [
              styles.botaoFeedback,
              styles.botaoCancelar,
              estado.pressed ? styles.botaoPressionado : null,
            ];
          }}
        >
          <Text style={styles.textoBotaoFeedback}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={aoEnviar}
          disabled={semTexto}
          accessibilityRole="button"
          accessibilityLabel="Enviar"
          accessibilityState={{ disabled: semTexto }}
          style={function (estado) {
            return [
              styles.botaoFeedback,
              styles.botaoEnviar,
              semTexto ? styles.botaoDesativado : null,
              estado.pressed ? styles.botaoPressionado : null,
            ];
          }}
        >
          <Text style={styles.textoBotaoFeedback}>Enviar</Text>
        </Pressable>
      </View>

      {avisoVisivel ? (
        <Text accessibilityLiveRegion="polite" style={styles.avisoFeedback}>
          O envio ainda não está conectado. Nada foi enviado. Seu texto continua aqui.
        </Text>
      ) : null}
      <Text style={estilosConfig.notaPagina}>
        Enviar fica desativado enquanto o campo está vazio. Se você sair desta página, o texto
        digitado se perde.
      </Text>
    </View>
  );
}

// Medidas minhas, pois o Figma não desenha essa página.
const styles = StyleSheet.create({
  campoFeedback: {
    minHeight: 140,
    minWidth: 0,
    paddingHorizontal: 13,
    paddingTop: 12,
    color: '#000000',
    fontSize: 18,
    textAlignVertical: 'top',
  },
  contadorFeedback: {
    alignSelf: 'flex-end',
    paddingRight: 13,
    paddingBottom: 8,
    color: '#000000',
    fontSize: 14,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoFeedback: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  botaoCancelar: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  botaoEnviar: {
    backgroundColor: '#0088FF',
  },
  // Desativado muda de cor E o leitor de tela fala "desativado" (accessibilityState).
  botaoDesativado: {
    opacity: 0.4,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotaoFeedback: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  avisoFeedback: {
    marginTop: 14,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
});
