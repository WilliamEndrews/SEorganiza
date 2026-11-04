import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Avatar from '../componentes/Avatar';
import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaDado } from '../componentes/LinhasConfig';
import { contarTarefas } from '../utilidades/ajudantes';
import { estilosConfig } from './estilosConfig';

// Página Perfil da conta logada. Os números vêm da mesma lista de tarefas da página Dados.
// `email` é só para ler (é o que identifica a conta). `aoSair` desloga.
export default function PaginaPerfil({ nomeUsuario, email, aoMudarNome, aoSair, tarefas, aoVoltar }) {
  const { concluidas, pendentes } = contarTarefas(tarefas);

  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Perfil" aoVoltar={aoVoltar} />

      <View style={styles.avatarGrandeArea}>
        <Avatar nomeUsuario={nomeUsuario} tamanho={88} cor="#AFAFAF" corTexto="#FFFFFF" />
      </View>

      <GrupoVidro cor="azul" style={[estilosConfig.grupo, estilosConfig.grupoPagina]}>
        <View style={estilosConfig.linhaConfig}>
          <Text style={styles.rotuloNome}>Nome</Text>
          <TextInput
            value={nomeUsuario}
            onChangeText={aoMudarNome}
            placeholder="Digite seu nome"
            placeholderTextColor="rgba(0, 0, 0, 0.55)"
            maxLength={30}
            autoCapitalize="words"
            autoCorrect={false}
            accessibilityLabel="Nome"
            style={styles.campoNome}
          />
        </View>
      </GrupoVidro>

      <GrupoVidro cor="azul" style={estilosConfig.grupo}>
        <LinhaDado titulo="E-mail" valor={email} />
        <LinhaDado titulo="Tarefas concluídas" valor={concluidas} />
        <LinhaDado titulo="Tarefas pendentes" valor={pendentes} />
      </GrupoVidro>

      <Pressable
        onPress={aoSair}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={function (estado) {
          return [styles.botaoSair, estado.pressed ? styles.botaoPressionado : null];
        }}
      >
        <Text style={styles.textoBotao}>Sair da conta</Text>
      </Pressable>

      <Text style={estilosConfig.notaPagina}>
        Esta conta fica salva só neste aparelho. O nome e as tarefas são desta conta. Sair
        volta para o Login, e outra conta entra com os dados dela.
      </Text>
      <Text style={estilosConfig.notaPagina}>Escolher foto ainda não está disponível.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarGrandeArea: {
    alignItems: 'center',
    marginBottom: 18,
  },
  // Linha do nome. Medidas nossas.
  rotuloNome: {
    color: '#000000',
    fontSize: 24,
  },
  // minWidth 0: sem isso, na web o campo fica largo demais e empurra o painel pro lado.
  campoNome: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    minHeight: 44,
    paddingVertical: 0,
    color: '#000000',
    fontSize: 24,
    textAlign: 'right',
  },
  // "Sair da conta" não está no Figma. Copiamos o estilo do botão de apagar da página Dados.
  botaoSair: {
    minHeight: 46,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#D93025',
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
