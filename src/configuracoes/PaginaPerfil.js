import { StyleSheet, Text, TextInput, View } from 'react-native';

import Avatar from '../componentes/Avatar';
import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaDado } from '../componentes/LinhasConfig';
import { contarTarefas } from '../utilidades/ajudantes';
import { estilosConfig } from './estilosConfig';

// Página Perfil: perfil LOCAL. Sem login, e-mail ou senha, e sem conta.
// O usuário só digita um nome. O círculo mostra a inicial dele (ainda não há foto).
// Os contadores vêm da mesma lista real de tarefas da página Dados.
export default function PaginaPerfil({ nomeUsuario, aoMudarNome, tarefas, aoVoltar }) {
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
        <LinhaDado titulo="Tarefas concluídas" valor={concluidas} />
        <LinhaDado titulo="Tarefas pendentes" valor={pendentes} />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        Perfil local: não há login, e-mail nem senha. O nome fica salvo só neste aparelho e
        continua aqui quando o app fecha. Para apagá-lo, use Dados.
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
  // Linha do nome. Medidas minhas.
  rotuloNome: {
    color: '#000000',
    fontSize: 24,
  },
  // minWidth 0: sem isso, na web o campo tem uma largura mínima própria, estoura a linha
  // e empurra o painel para o lado quando recebe foco.
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
});
