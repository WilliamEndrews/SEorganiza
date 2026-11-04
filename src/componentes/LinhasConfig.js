import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { estilosConfig } from '../configuracoes/estilosConfig';

// Linhas que vão dentro dos retângulos de vidro (GrupoVidro) de Configurações.
// Ficam juntas aqui porque são pequenas e usam os mesmos estilos.

function destinoPendente() {
  // A página ainda não existe, então o toque só mostra o efeito de apertar.
}

// Linha de Configurações: ícone + título + seta. A linha toda é um Pressable.
// `icone` chega pronto porque cada linha tem um desenho diferente.
// `aoPressionar` é o que acontece no toque. Sem ela, a linha ainda não leva a nada.
export function BotaoConfig({ icone, titulo, aoPressionar = null }) {
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

// Opção para escolher (páginas Temas e Data e Hora). Só uma do grupo fica marcada.
// A marcada não depende só da cor: tem o visto, o texto em negrito e,
// se tiver desenho, um contorno nele.
export function OpcaoEscolha({ titulo, desenho = null, selecionado, aoEscolher }) {
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

// Linha com chave de liga e desliga. A chave é feita à mão (trilho + bolinha)
// para ficar igual no celular e na web. O texto "Ligado"/"Desligado" ajuda quem não vê a cor.
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

// Linha só de leitura: nome à esquerda, valor à direita. Não é botão.
// O leitor de tela lê tudo junto, tipo "Total de tarefas: 0".
export function LinhaDado({ titulo, valor }) {
  return (
    <View accessible accessibilityLabel={titulo + ': ' + valor} style={estilosConfig.linhaConfig}>
      <Text style={[estilosConfig.textoConfig, estilosConfig.textoSemDesenho]}>{titulo}</Text>
      <Text style={styles.valorDado}>{valor}</Text>
    </View>
  );
}

// Linha só de leitura da página Acessibilidade: ícone, título e explicação.
// O leitor de tela lê o título e o texto juntos.
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
  // Opção com desenho (página Temas). Medidas nossas.
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
  // Chave da página Notificações. Medidas nossas, o Figma não tem essa página.
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
  // Valor à direita nas páginas Dados, Perfil e Sobre.
  // flexShrink deixa o texto encolher, senão o e-mail estoura a linha.
  valorDado: {
    flexShrink: 1,
    marginLeft: 12,
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
  },
  // Linha da página Acessibilidade. Medidas nossas.
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
