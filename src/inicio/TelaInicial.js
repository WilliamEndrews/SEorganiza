import { Animated, Dimensions, StyleSheet, Text } from 'react-native';
import { usePathname } from 'expo-router';
import { temaDoModo } from '../constantes/temas';
import { useOpcoes } from '../contexto/OpcoesContext';
import ListaCards from '../componentes/ListaCards';

// Página inicial (rota "/"): só o título e as tarefas.
// O fundo, o botão + e a barra de baixo ficam no _layout.js do grupo.
export default function TelaInicial() {
  const { modoTema, deslizeAba, tarefasAtivas, alternarConcluida, excluirTarefa } = useOpcoes();
  const tema = temaDoModo(modoTema);
  const tela = Dimensions.get('window');
  // Com o Calendário aberto esta página continua por baixo, só fora da tela.
  const noCalendario = usePathname() === '/calendario';

  // Usa o mesmo deslizeAba do Calendário, mas ao contrário: enquanto ele entra
  // pela direita, esta página sai pela esquerda (0 = no lugar, 1 = fora).
  const deslocamento = deslizeAba.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -tela.width],
  });

  // Com o Calendário aberto, esconde esta página do leitor de tela
  // (a primeira prop é do iOS, a segunda do Android).
  return (
    <Animated.View
      style={[styles.conteudo, { left: deslocamento }]}
      accessibilityElementsHidden={noCalendario}
      importantForAccessibility={noCalendario ? 'no-hide-descendants' : 'auto'}
    >
      <Text style={[styles.titulo, { color: tema.titulo }]}>👋 Seja bem vindo</Text>

      {/* Todas as tarefas que não estão na lixeira. */}
      <ListaCards
        tarefas={tarefasAtivas}
        tema={tema}
        mensagemVazia="Nenhuma tarefa ainda. Toque no + para criar a primeira."
        aoConcluir={alternarConcluida}
        aoExcluir={excluirTarefa}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 25,
  },
  // A cor do título vem do tema. Aqui fica a do dia.
  titulo: {
    fontSize: 32,
    color: '#558796',
  },
});
