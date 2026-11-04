import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Card de uma tarefa (tela inicial e Calendário). As cores vêm do tema (dia ou noite).
// Props (aula 01): tarefa, tema, aoConcluir (toque no círculo) e aoExcluir.
// aoExcluir roda ao SEGURAR o card: o Figma não tem botão de excluir, então
// usamos o toque longo. A tarefa vai para Tarefas Excluídas.
export default function CardTarefa({ tarefa, tema, aoConcluir, aoExcluir }) {
  return (
    <Pressable
      onLongPress={aoExcluir}
      accessibilityHint="Segure para mover a tarefa para Tarefas Excluídas"
    >
      <LinearGradient
        colors={tema.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.card,
          tema.bordaCard ? { borderWidth: 1, borderColor: tema.bordaCard } : null,
        ]}
      >
        {/* O círculo vira botão. Se a tarefa está concluída, mostra o check (?:). */}
        <Pressable
          onPress={aoConcluir}
          hitSlop={10}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: tarefa.concluida }}
          accessibilityLabel={'Concluir ' + tarefa.titulo}
        >
          <Ionicons
            name={tarefa.concluida ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={tema.circulo}
          />
        </Pressable>
        <Text
          numberOfLines={1}
          style={[
            styles.nomeTarefa,
            { color: tema.textoCard },
            tarefa.concluida && styles.nomeConcluida,
          ]}
        >
          {tarefa.titulo}
        </Text>
        <Ionicons name="flag-outline" size={22} color={tema.bandeira} />
      </LinearGradient>
    </Pressable>
  );
}

// As cores ficam de fora daqui porque vêm do tema.
const styles = StyleSheet.create({
  card: {
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  nomeTarefa: {
    flex: 1,
    marginLeft: 10,
    fontSize: 22,
  },
  // Tarefa concluída: riscada e mais apagada.
  nomeConcluida: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
