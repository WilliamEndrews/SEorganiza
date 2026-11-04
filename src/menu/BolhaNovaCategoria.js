import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { vidro } from '../constantes/figma';

// Bolha de vidro que aparece ao tocar em "Nova Categoria" (não está no Figma).
// Usa o mesmo vidro do menu. Tocar no fundo escuro, fora da bolha, fecha ela.
export default function BolhaNovaCategoria({
  aparecer,
  nome,
  aoMudarNome,
  aviso,
  aoAdicionar,
  aoCancelar,
  escala,
  faltam,
}) {
  // Mesma escala do menu, para a bolha não esticar no tablet.
  function medida(valor) {
    return valor * escala;
  }

  return (
    <View style={[styles.camadaBolha, { pointerEvents: 'box-none' }]}>
      <Pressable
        onPress={aoCancelar}
        accessibilityRole="button"
        accessibilityLabel="Fechar nova categoria"
        style={styles.fundoBolha}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.28)',
              opacity: aparecer,
            },
          ]}
        />
      </Pressable>
      <Animated.View
        style={[
          styles.bolhaVidro,
          vidro,
          {
            left: medida(18),
            top: medida(188),
            width: medida(252),
            opacity: aparecer,
            transform: [
              {
                scale: aparecer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.72, 1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[styles.brilho, { pointerEvents: 'none' }]}
        />
        <Text style={[styles.tituloBolha, { fontSize: medida(16) }]}>Nova categoria</Text>
        <TextInput
          value={nome}
          onChangeText={aoMudarNome}
          placeholder="Nome da categoria"
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          maxLength={20}
          autoFocus
          accessibilityLabel="Nome da categoria"
          style={[styles.campoBolha, { fontSize: medida(16), minHeight: medida(44) }]}
        />
        {aviso ? <Text style={styles.avisoBolha}>{aviso}</Text> : null}
        <Text style={styles.notaBolha}>
          {faltam === 1
            ? 'Cabe mais 1 categoria nova.'
            : 'Cabem mais ' + faltam + ' categorias novas.'}
        </Text>
        <View style={styles.linhaBotoesBolha}>
          <Pressable
            onPress={aoCancelar}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            style={function (estado) {
              return [
                styles.botaoBolha,
                styles.botaoBolhaCancelar,
                estado.pressed ? styles.botaoPressionado : null,
              ];
            }}
          >
            <Text style={styles.textoBotaoBolhaEscuro}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={aoAdicionar}
            accessibilityRole="button"
            accessibilityLabel="Adicionar"
            style={function (estado) {
              return [
                styles.botaoBolha,
                styles.botaoBolhaAdicionar,
                estado.pressed ? styles.botaoPressionado : null,
              ];
            }}
          >
            <Text style={styles.textoBotaoBolhaClaro}>Adicionar</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// Medidas nossas.
const styles = StyleSheet.create({
  camadaBolha: {
    ...StyleSheet.absoluteFill,
    zIndex: 4,
  },
  fundoBolha: {
    ...StyleSheet.absoluteFill,
  },
  bolhaVidro: {
    position: 'absolute',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  brilho: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  tituloBolha: {
    color: '#1C1C1C',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  campoBolha: {
    minWidth: 0,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    color: '#1C1C1C',
  },
  avisoBolha: {
    marginTop: 8,
    color: '#8B1E1E',
    fontSize: 13,
  },
  notaBolha: {
    marginTop: 8,
    color: '#5C5C5C',
    fontSize: 13,
  },
  linhaBotoesBolha: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  botaoBolha: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  botaoBolhaCancelar: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  botaoBolhaAdicionar: {
    backgroundColor: '#0088FF',
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotaoBolhaEscuro: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
  },
  textoBotaoBolhaClaro: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
