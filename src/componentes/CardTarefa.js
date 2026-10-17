import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Card de uma tarefa na tela inicial. O título chega por props e as cores vêm do
// tema (dia ou noite).
export default function CardTarefa({ titulo, tema }) {
  return (
    <LinearGradient
      colors={tema.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.card,
        tema.bordaCard ? { borderWidth: 1, borderColor: tema.bordaCard } : null,
      ]}
    >
      <View style={[styles.circulo, { borderColor: tema.circulo }]} />
      <Text style={[styles.nomeTarefa, { color: tema.textoCard }]}>{titulo}</Text>
      <Ionicons name="flag-outline" size={22} color={tema.bandeira} />
    </LinearGradient>
  );
}

// As cores de circulo e nomeTarefa são trocadas pelo tema em tempo de execução.
// Os valores aqui são os do dia.
const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  circulo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#7A9AAA',
  },
  nomeTarefa: {
    flex: 1,
    marginLeft: 12,
    fontSize: 22,
    color: '#000000',
  },
});
