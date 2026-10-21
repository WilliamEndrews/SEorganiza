import { useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import CalendarioMes from './CalendarioMes';
import CardTarefa from '../componentes/CardTarefa';
import { useOpcoes } from '../contexto/OpcoesContext';


const LOGO = require('../../assets/logo-seorganize.png');

// Página do Calendário 

// aqui sao os eleentos que mudam do calendario para a tela inicial: o logo, o calendário e as


export default function PaginaCalendario({ tema }) {
  const { deslizeAba, entrarNoCalendario, sairDoCalendario } = useOpcoes();
  const tela = Dimensions.get('window');

  // Assim que a rota /calendario aparece, a animação de entrada começa.
  // É o mesmo molde do (opcoes)/_layout.js, que chama entrarNasOpcoes ao abrir.
  
  
  useEffect(function () {
    entrarNoCalendario();
    return function () {
      sairDoCalendario();
    };

  }, []);

  /*interpolate "traduz" o valor do deslize (0 a 1) para uma posição em pixels: valor 0 -> left = largura da tela (a página inteira fora, à direita) 
  valor 1 -> left =  (a página no lugar)
   Durante a animação, os valores do meio dão as posições do meio.  */
  const deslocamento = deslizeAba.interpolate({
    inputRange: [0, 1],
    outputRange: [tela.width, 0],
  });

  // Animated.View é uma View que aceita valores animados no estilo.
  // `left` desloca a página na horizontal a partir do lugar dela.
  return (
    <Animated.View style={[styles.pagina, { left: deslocamento }]}>
      <Image source={LOGO} style={styles.logo} accessibilityLabel="SEorganize" />

      <View style={styles.calendario}>
        <CalendarioMes corTexto={tema.textoCalendario} />
      </View>

      {/* O mesmo card da tela inicial. */}
      <View style={styles.tarefas}>
        <CardTarefa titulo="Nome da tarefa" tema={tema} />
      </View>
    </Animated.View>
  );
}


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
  // Calendário: começa em y = 115. O logo termina em 28 + 51 = 79,
  
  calendario: {
    marginTop: 36,
    marginHorizontal: 22,
  },
  // Card: começa em y = 340, a 30 px da esquerda. O calendário termina em
  // 115 + 192 = 307         
  tarefas: {
    marginTop: 9,
    marginHorizontal: 30,
  },
});
