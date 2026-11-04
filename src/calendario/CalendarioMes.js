import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { COR_ICONE_AZUL } from '../constantes/figma';
import { ptBR } from '../utilidades/localeCalendarConfig';

// A biblioteca vem em inglês. Aqui colocamos os meses e dias em português.
LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

// Caixa do mês. A react-native-calendars faz a grade e troca os meses; a gente
// só muda a aparência para ficar igual ao Figma.
// Props (aula 01): corTexto, diaSelecionado ('AAAA-MM-DD'), aoEscolherDia(data)
// e diasComTarefa (datas que ganham um pontinho).
// O dia escolhido fica no Context, porque a lista e o botão + também usam.
export default function CalendarioMes({ corTexto, diaSelecionado, aoEscolherDia, diasComTarefa }) {
  // Formato que a biblioteca entende: { '2026-10-28': { marked: true } }.
  /** @type {Object<string, { marked: boolean }>} */
  const marcados = {};
  diasComTarefa.forEach(function (data) {
    marcados[data] = { marked: true };
  });

  return (
    <Calendar
      style={[styles.caixa, { borderColor: corTexto }]}
      // Abre no mês do dia escolhido.
      initialDate={diaSelecionado}
      markedDates={marcados}
      // Troca as setas padrão pelas do Figma.
      renderArrow={function (direcao) {
        return (
          <Ionicons
            name={direcao === 'left' ? 'arrow-back' : 'arrow-forward'}
            size={24}
            color={corTexto}
          />
        );
      }}
      // Cores do título do mês e dos dias da semana. Fundo transparente para
      // o degradê aparecer.
      theme={{
        calendarBackground: 'transparent',
        monthTextColor: corTexto,
        textMonthFontSize: 14,
        textSectionTitleColor: corTexto,
        textDayHeaderFontSize: 12,
        arrowStyle: { padding: 0 },
        weekVerticalMargin: 1,
      }}
      // A biblioteca chama isso para cada dia e desenha o que a gente devolver.
      // state 'disabled' = dia de outro mês. marking = o que veio em markedDates.
      dayComponent={function ({ date, state, marking }) {
        const foraDoMes = state === 'disabled';
        const selecionado = date.dateString === diaSelecionado;
        const temTarefa = !foraDoMes && marking && marking.marked;
        return (
          <TouchableOpacity
            style={[styles.dia, selecionado && styles.diaSelecionado]}
            onPress={function () {
              aoEscolherDia(date.dateString);
            }}
            disabled={foraDoMes}
            accessibilityRole="button"
            accessibilityState={{ selected: selecionado }}
          >
            <Text
              style={[
                styles.numero,
                { color: corTexto },
                // Dias de outro mês ficam apagados.
                foraDoMes && styles.foraDoMes,
                state === 'today' && styles.hoje,
                selecionado && styles.numeroSelecionado,
              ]}
            >
              {date.day}
            </Text>
            {/* Pontinho de tarefa (branco no dia azul, para aparecer). */}
            {temTarefa ? (
              <View
                style={[styles.ponto, { backgroundColor: selecionado ? '#FFFFFF' : COR_ICONE_AZUL }]}
              />
            ) : null}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  caixa: {
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom: 5,
    boxShadow: '0px 4px 2px rgba(0, 0, 0, 0.25)',
  },
  dia: {
    width: 28,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  diaSelecionado: {
    backgroundColor: COR_ICONE_AZUL,
  },
  numero: {
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
  },
  foraDoMes: {
    opacity: 0.3,
  },
  // Hoje fica azul, a mesma cor dos ícones.
  hoje: {
    color: COR_ICONE_AZUL,
    fontWeight: 'bold',
  },
  // A cor fica no Text porque no React Native só o Text aceita `color`.
  numeroSelecionado: {
    color: '#FFFFFF',
  },
  // Absoluto para o ponto não empurrar o número para cima.
  ponto: {
    position: 'absolute',
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
