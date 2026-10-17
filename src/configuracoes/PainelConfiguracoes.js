import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import Avatar from '../componentes/Avatar';
import GrupoVidro from '../componentes/GrupoVidro';
import { BotaoConfig } from '../componentes/LinhasConfig';
import { COR_ICONE_AZUL, COR_ICONE_LARANJA } from '../constantes/figma';
import { nomeParaExibir } from '../utilidades/ajudantes';
import { estilosConfig } from './estilosConfig';
import PaginaAcessibilidade from './PaginaAcessibilidade';
import PaginaDados from './PaginaDados';
import PaginaDataHora from './PaginaDataHora';
import PaginaFeedback from './PaginaFeedback';
import PaginaNotificacoes from './PaginaNotificacoes';
import PaginaPerfil from './PaginaPerfil';
import PaginaSobre from './PaginaSobre';
import PaginaTemas from './PaginaTemas';

// O painel inteiro de Configurações fica dentro de uma ScrollView.
// Com letra grande, a lista pode ficar maior que o painel e, assim, dá para rolar.
// Com letra normal, o conteúdo cabe e nada rola.
export default function PainelConfiguracoes(props) {
  return (
    <ScrollView
      contentContainerStyle={styles.rolagemConfig}
      showsVerticalScrollIndicator={false}
    >
      <ConteudoConfiguracoes {...props} />
    </ScrollView>
  );
}

// Conteúdo do painel de Configurações. Mostra a lista ou uma página interna,
// conforme `paginaConfig`.
function ConteudoConfiguracoes({
  paginaConfig,
  aoAbrirPagina,
  aoVoltarParaLista,
  aoVoltar,
  modoTema,
  aoEscolherTema,
  primeiroDiaSemana,
  aoEscolherPrimeiroDia,
  formatoHora,
  aoEscolherFormatoHora,
  avisosDemo,
  aoAlternarAviso,
  tarefas,
  categorias,
  nomeUsuario,
  aoMudarNome,
}) {
  if (paginaConfig === 'feedback') {
    return <PaginaFeedback aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'sobre') {
    return <PaginaSobre aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'perfil') {
    return (
      <PaginaPerfil
        nomeUsuario={nomeUsuario}
        aoMudarNome={aoMudarNome}
        tarefas={tarefas}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  if (paginaConfig === 'temas') {
    return (
      <PaginaTemas modoTema={modoTema} aoEscolher={aoEscolherTema} aoVoltar={aoVoltarParaLista} />
    );
  }

  if (paginaConfig === 'dataHora') {
    return (
      <PaginaDataHora
        primeiroDiaSemana={primeiroDiaSemana}
        aoEscolherPrimeiroDia={aoEscolherPrimeiroDia}
        formatoHora={formatoHora}
        aoEscolherFormatoHora={aoEscolherFormatoHora}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  if (paginaConfig === 'acessibilidade') {
    return <PaginaAcessibilidade aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'dados') {
    return <PaginaDados tarefas={tarefas} categorias={categorias} aoVoltar={aoVoltarParaLista} />;
  }

  if (paginaConfig === 'notificacoes') {
    return (
      <PaginaNotificacoes
        avisosDemo={avisosDemo}
        aoAlternarAviso={aoAlternarAviso}
        aoVoltar={aoVoltarParaLista}
      />
    );
  }

  return (
    <View style={estilosConfig.configMiolo}>
      {/* O título é o jeito de voltar ao menu. A caixa mede 40 (24 do texto + 16 de
          margem). O hitSlop soma 4 em cima e chega a 44, sem invadir a linha do perfil. */}
      <Pressable
        onPress={aoVoltar}
        hitSlop={{ top: 4 }}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao menu"
      >
        <Text style={estilosConfig.tituloConfig}>Configurações</Text>
      </Pressable>

      {/* No Figma, a área do perfil também tem uma seta. Agora ela abre a página Perfil. */}
      <Pressable
        onPress={function () {
          aoAbrirPagina('perfil');
        }}
        accessibilityRole="button"
        accessibilityLabel={'Perfil: ' + nomeParaExibir(nomeUsuario)}
        style={styles.linhaUsuario}
      >
        <Avatar nomeUsuario={nomeUsuario} tamanho={50} cor="#AFAFAF" corTexto="#FFFFFF" />
        <Text numberOfLines={1} style={styles.nomeConfig}>
          {nomeParaExibir(nomeUsuario)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </Pressable>

      {/* Grupo 1: só Temas. */}
      <GrupoVidro cor="azul" style={[estilosConfig.grupo, styles.grupoTemas]}>
        <BotaoConfig
          icone={<MaterialCommunityIcons name="format-paint" size={24} color={COR_ICONE_AZUL} />}
          titulo="Temas"
          aoPressionar={function () {
            aoAbrirPagina('temas');
          }}
        />
      </GrupoVidro>

      {/* Grupo 2: quatro preferências, com o mesmo degradê azul do grupo 1. */}
      <GrupoVidro cor="azul" style={[estilosConfig.grupo, styles.grupoPreferencias]}>
        <BotaoConfig
          icone={<MaterialCommunityIcons name="clock" size={24} color={COR_ICONE_AZUL} />}
          titulo="Data e Hora"
          aoPressionar={function () {
            aoAbrirPagina('dataHora');
          }}
        />
        <BotaoConfig
          icone={<MaterialCommunityIcons name="bell" size={24} color={COR_ICONE_AZUL} />}
          titulo="Notificações"
          aoPressionar={function () {
            aoAbrirPagina('notificacoes');
          }}
        />
        <BotaoConfig
          icone={<MaterialCommunityIcons name="database" size={24} color={COR_ICONE_AZUL} />}
          titulo="Dados"
          aoPressionar={function () {
            aoAbrirPagina('dados');
          }}
        />
        <BotaoConfig
          icone={<MaterialIcons name="accessibility" size={24} color={COR_ICONE_AZUL} />}
          titulo="Acessibilidade"
          aoPressionar={function () {
            aoAbrirPagina('acessibilidade');
          }}
        />
      </GrupoVidro>

      {/* Grupo 3: Feedback, Siga-nos e Sobre, com o degradê laranja. */}
      <GrupoVidro cor="laranja" style={[estilosConfig.grupo, styles.grupoContato]}>
        <BotaoConfig
          icone={<MaterialIcons name="feedback" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Feedback"
          aoPressionar={function () {
            aoAbrirPagina('feedback');
          }}
        />
        <BotaoConfig
          icone={<MaterialIcons name="contacts" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Siga-nos"
        />
        <BotaoConfig
          icone={<MaterialIcons name="description" size={24} color={COR_ICONE_LARANJA} />}
          titulo="Sobre"
          aoPressionar={function () {
            aoAbrirPagina('sobre');
          }}
        />
      </GrupoVidro>
    </View>
  );
}

const styles = StyleSheet.create({
  // Rolagem do painel: flexGrow faz o conteúdo ocupar o painel todo quando cabe.
  // O respiro embaixo evita que o último item encoste na borda ao rolar.
  rolagemConfig: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  linhaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    marginBottom: 35,
    paddingLeft: 19,
    paddingRight: 18,
  },
  nomeConfig: {
    flex: 1,
    marginLeft: 13,
    color: '#FFFFFF',
    fontSize: 20,
  },
  // Alturas dos três retângulos no Figma: 46, 184 e 147.
  // São alturas MÍNIMAS (minHeight): com o texto do sistema maior, a linha cresce
  // e o retângulo acompanha, em vez de cortar o texto.
  // No grupo do meio, 4 linhas de 46 + 3 de respiro dão 187, e não 184 como no Figma
  // (antes, esses 3 px eram cortados). Por isso a margem de baixo caiu de 9 para 6:
  // o grupo seguinte fica no mesmo lugar.
  grupoTemas: {
    minHeight: 46,
    marginBottom: 15,
  },
  grupoPreferencias: {
    minHeight: 184,
    paddingTop: 3,
    marginBottom: 6,
  },
  grupoContato: {
    minHeight: 147,
    paddingTop: 9,
  },
});
