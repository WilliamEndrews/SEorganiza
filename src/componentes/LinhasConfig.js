import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { estilosConfig } from '../configuracoes/estilosConfig';

// As linhas que vão dentro dos retângulos de vidro (GrupoVidro) de Configurações.
// Ficam juntas porque são pequenas e usam os mesmos estilos de linha.

function destinoPendente() {
  // As páginas de cada item ainda não existem. O toque só mostra o feedback.
}

// Uma linha de Configurações: ícone + título + seta.
// A linha inteira é um Pressable, então tocar em qualquer parte dela funciona.
// O ícone chega pronto pela prop `icone`, porque cada linha usa um desenho diferente.
// `aoPressionar` diz o que acontece no toque. Sem ela, a linha ainda não leva a lugar nenhum.
export function BotaoConfig({ icone, titulo, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar || destinoPendente}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={aoPressionar ? undefined : 'Ainda não disponível'}
      style={function (estado) {
        return [estilosConfig.linhaConfig, estado.pressed ? estilosConfig.linhaPressionada : null];
      }}
    >
      {icone}
      <Text style={estilosConfig.textoConfig}>{titulo}</Text>
      <Ionicons name="chevron-forward" size={16} color="#000000" />
    </Pressable>
  );
}

// Uma opção para escolher: nome + marca de seleção, e um desenho se for passado.
// Serve para as páginas Temas e Data e Hora. Só uma opção do grupo fica marcada.
// A seleção aparece de três jeitos, para não depender só da cor:
// círculo com visto (em vez de círculo vazio), texto em negrito e,
// quando há desenho, um contorno nele.
export function OpcaoEscolha({ titulo, desenho, selecionado, aoEscolher }) {
  return (
    <Pressable
      onPress={aoEscolher}
      accessibilityRole="radio"
      aria-checked={selecionado}
      accessibilityLabel={titulo}
      style={function (estado) {
        return [
          desenho ? styles.linhaTema : estilosConfig.linhaConfig,
          estado.pressed ? estilosConfig.linhaPressionada : null,
        ];
      }}
    >
      {desenho ? (
        <View style={[styles.areaDesenhoTema, selecionado ? styles.desenhoSelecionado : null]}>
          {desenho}
        </View>
      ) : null}
      <Text
        style={[
          estilosConfig.textoConfig,
          desenho ? null : estilosConfig.textoSemDesenho,
          selecionado ? styles.textoSelecionado : null,
        ]}
      >
        {titulo}
      </Text>
      <Ionicons
        name={selecionado ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color="#000000"
      />
    </Pressable>
  );
}

// Uma linha com chave de liga e desliga. A linha inteira é um botão do tipo "switch".
// A chave é desenhada à mão (trilho + bolinha) para ficar igual em todas as plataformas.
// Ligado ou desligado aparece pela posição da bolinha e pelo texto, não só pela cor.
export function LinhaChave({ titulo, ligado, aoAlternar }) {
  return (
    <Pressable
      onPress={aoAlternar}
      accessibilityRole="switch"
      aria-checked={ligado}
      accessibilityLabel={titulo}
      style={function (estado) {
        return [estilosConfig.linhaConfig, estado.pressed ? estilosConfig.linhaPressionada : null];
      }}
    >
      <Text style={[estilosConfig.textoConfig, estilosConfig.textoSemDesenho]}>{titulo}</Text>
      <Text style={styles.textoEstadoChave}>{ligado ? 'Ligado' : 'Desligado'}</Text>
      <View style={[styles.trilhoChave, ligado ? styles.trilhoLigado : null]}>
        <View style={[styles.bolinhaChave, ligado ? styles.bolinhaLigada : null]} />
      </View>
    </Pressable>
  );
}

// Uma linha só de leitura: nome do dado à esquerda e o número à direita.
// Não é botão (não leva a lugar nenhum). O leitor de tela lê "Total de tarefas: 0".
export function LinhaDado({ titulo, valor }) {
  return (
    <View accessible accessibilityLabel={titulo + ': ' + valor} style={estilosConfig.linhaConfig}>
      <Text style={[estilosConfig.textoConfig, estilosConfig.textoSemDesenho]}>{titulo}</Text>
      <Text style={styles.valorDado}>{valor}</Text>
    </View>
  );
}

// Uma linha só de leitura da página Acessibilidade: ícone, título e explicação.
// Não é botão. O leitor de tela lê o título e o texto juntos.
export function LinhaInfo({ icone, titulo, texto }) {
  return (
    <View accessible accessibilityLabel={titulo + '. ' + texto} style={styles.linhaInfo}>
      {icone}
      <View style={styles.textosInfo}>
        <Text style={styles.tituloInfo}>{titulo}</Text>
        <Text style={styles.textoInfo}>{texto}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Opção com desenho (página Temas). Medidas minhas.
  linhaTema: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingLeft: 13,
    paddingRight: 17,
  },
  areaDesenhoTema: {
    width: 64,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  desenhoSelecionado: {
    borderColor: '#000000',
  },
  textoSelecionado: {
    fontWeight: '700',
  },
  // Chave de liga e desliga da página Notificações. Medidas minhas (parecidas com
  // as de um interruptor comum), pois o Figma não desenha essa página.
  textoEstadoChave: {
    marginRight: 10,
    color: '#000000',
    fontSize: 14,
  },
  trilhoChave: {
    width: 51,
    height: 31,
    paddingHorizontal: 2,
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  trilhoLigado: {
    backgroundColor: '#34C759',
  },
  bolinhaChave: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  bolinhaLigada: {
    alignSelf: 'flex-end',
  },
  // Número à direita de cada linha das páginas Dados, Perfil e Sobre.
  valorDado: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
  },
  // Linha da página Acessibilidade. Medidas minhas.
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingLeft: 13,
    paddingRight: 17,
  },
  textosInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tituloInfo: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  textoInfo: {
    marginTop: 2,
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
});
