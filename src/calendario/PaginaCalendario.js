import { useEffect } from 'react';
import { Animated, Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import CalendarioMes from './CalendarioMes';
import ListaCards from '../componentes/ListaCards';
import { useOpcoes } from '../contexto/OpcoesContext';

// require() faz a imagem ir junto no app. O logo veio do Figma.
const LOGO = require('../../assets/logo-seorganize.png');

// Página do Calendário: logo, calendário e tarefas do dia.
// O fundo, o botão + e a barra de baixo ficam no _layout.js do grupo.
// Props (aula 01): tema, as cores do tema atual (dia ou noite).
export default function PaginaCalendario({ tema }) {
  const {
    deslizeAba,
    entrarNoCalendario,
    sairDoCalendario,
    tarefasAtivas,
    alternarConcluida,
    setIdEmEdicao,
    diaSelecionado,
    setDiaSelecionado,
  } = useOpcoes();

  // Valores calculados a partir das tarefas (aula 05): as tarefas do dia
  // escolhido e as datas que ganham pontinho no calendário.
  const tarefasDoDia = tarefasAtivas.filter(function (tarefa) {
    return tarefa.data === diaSelecionado;
  });
  const diasComTarefa = tarefasAtivas.map(function (tarefa) {
    return tarefa.data;
  });
  const tela = useWindowDimensions();

  // Quando a página abre, o calendário desliza para dentro.
  // A lista vazia [] faz isso rodar uma vez só. O return roda quando a página
  // fecha e deixa tudo pronto para a próxima vez.
  useEffect(function () {
    entrarNoCalendario();
    return function () {
      sairDoCalendario();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // interpolate transforma o deslize (0 a 1) em posição:
  // 0 = página fora, à direita; 1 = página no lugar.
  const deslocamento = deslizeAba.interpolate({
    inputRange: [0, 1],
    outputRange: [tela.width, 0],
  });

  return (
    <Animated.View style={[styles.pagina, { left: deslocamento }]}>
      <Image source={LOGO} style={styles.logo} accessibilityLabel="SEorganize" />

      <View style={styles.calendario}>
        <CalendarioMes
          corTexto={tema.textoCalendario}
          diaSelecionado={diaSelecionado}
          aoEscolherDia={setDiaSelecionado}
          diasComTarefa={diasComTarefa}
        />
      </View>

      {/* A mesma lista da tela inicial, mas só com as tarefas do dia. */}
      <View style={styles.tarefas}>
        <ListaCards
          tarefas={tarefasDoDia}
          tema={tema}
          mensagemVazia="Nenhuma tarefa neste dia. Toque no + para criar uma."
          aoConcluir={alternarConcluida}
          aoEditar={setIdEmEdicao}
        />
      </View>
    </Animated.View>
  );
}

// Margens tiradas das medidas do Figma.
const styles = StyleSheet.create({
  pagina: {
    flex: 1,
  },
  logo: {
    width: 51,
    height: 51,
    marginTop: 28,
    marginLeft: 13,
  },
  calendario: {
    marginTop: 36,
    marginHorizontal: 22,
  },
  // O marginTop é pequeno porque a ListaCards já tem paddingTop por dentro.
  // flex: 1 deixa a lista usar o resto da altura e rolar.
  tarefas: {
    flex: 1,
    marginTop: 9,
    marginHorizontal: 30,
  },
});
