import { Animated, Dimensions, StyleSheet, Text } from 'react-native';
import { usePathname } from 'expo-router';
import { temaDoModo } from '../constantes/temas';
import { useOpcoes } from '../contexto/OpcoesContext';
import CardTarefa from '../componentes/CardTarefa';

// Página inicial (rota "/"): só o título e as tarefas.
 
export default function TelaInicial() {
  const { modoTema, deslizeAba } = useOpcoes();
  const tema = temaDoModo(modoTema);             
  const tela = Dimensions.get('window');

  const noCalendario = usePathname() === '/calendario';

  /* O mesmo valor que move o Calendário, com o sentido oposto:
  //   valor 0 -> left = 0                   (a página no lugar)
  //   valor 1 -> left = -largura da tela    (a página inteira fora, à esquerda)
  // Enquanto o Calendário vem da direita, esta página sai pela esquerda, no
  // mesmo ritmo, porque as duas leem o mesmo deslizeAba.*/

  const deslocamento = deslizeAba.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -tela.width],
  });

  // Enquanto o Calendário está aberto, esconde esta página do leitor de tela:
  // accessibilityElementsHidden vale no iOS (VoiceOver) e
  // importantForAccessibility 'no-hide-descendants' vale no Android (TalkBack).
  return (
    <Animated.View
      style={[styles.conteudo, { left: deslocamento }]}
      accessibilityElementsHidden={noCalendario}
      importantForAccessibility={noCalendario ? 'no-hide-descendants' : 'auto'}
    >
      <Text style={[styles.titulo, { color: tema.titulo }]}>👋 Seja bem vindo</Text>

      <CardTarefa titulo="Nome da tarefa" tema={tema} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 25,
  },
  // A cor do título é trocada pelo tema em tempo de execução. O valor aqui é o do dia.
  titulo: {
    fontSize: 32,
    color: '#558796',
  },
});
