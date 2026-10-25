import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COR_ICONE_AZUL } from "../constantes/figma";
import {
  DIAS_DA_SEMANA,
  DIA_DESTACADO,
  SEMANAS,
  TITULO_MES,
} from "../constantes/calendario";

import { Calendar } from "react-native-calendars";

/* SÓ VISUAL:Caixa do mês
 */

/* - Aqui cada linha é uma View com flexDirection: 'row' (itens lado a lado) e
 columnGap: 5 (os 5 px entre as colunas).
 Cada célula tem flex: 1, então as 7 dividem a largura por igual.
  A altura das linhas também usa flex: o cabeçalho tem flex: 2 e as outras linhas flex: 1, igual às "partes" do Figma.
*/

export default function CalendarioMes({ corTexto }) {
  return (
    <View style={[styles.caixa, { borderColor: corTexto }]}>
      {/* Linha 1: seta esquerda (coluna 1), título (colunas 2 e 3), seta direita
          (coluna 4) e um espaço vazio que ocupa as colunas 5, 6 e 7. */}
      <View style={styles.cabecalho}>
        <View style={[styles.coluna, styles.setaEsquerda]}>
          <Ionicons name="arrow-back" size={24} color={corTexto} />
        </View>
        <Text style={[styles.texto, styles.tituloMes, { color: corTexto }]}>{TITULO_MES}</Text>
        <View style={[styles.coluna, styles.setaDireita]}>
          <Ionicons name="arrow-forward" size={24} color={corTexto} />
        </View>
        <View style={styles.resto} />
      </View>

      {/* Linha 2: Dom, Seg, Ter... O map transforma cada texto da lista num <Text>.
          A key ajuda o React a saber qual item é qual; o nome do dia não se repete. */}
      <View style={styles.linha}>
        {DIAS_DA_SEMANA.map(function (dia) {
          return (
            <Text key={dia} style={[styles.texto, styles.coluna, { color: corTexto }]}>
              {dia}
            </Text>
          );
        })}
      </View>

      {/* Linhas 3 a 8: as 6 semanas. São dois map, um dentro do outro:
          o de fora cria uma linha por semana e o de dentro cria um número por dia. */}
      {SEMANAS.map(function (semana, indice) {
        return (
          <View key={indice} style={styles.linha}>
            {semana.map(function (dia) {
              // Só o dia 1 de SETEMBRO fica azul (o 1 de outubro também é 1,
              
              const destacado = !dia.foraDoMes && dia.numero === DIA_DESTACADO;
              return (
                // Dentro de uma mesma semana nenhum número se repete, então ele
                // serve de key.
              
                <Text
                  key={dia.numero}
                  style={[
                    styles.texto,
                    styles.coluna,
                    { color: corTexto },
                    dia.foraDoMes && styles.foraDoMes,
                    destacado && styles.destacado,
                  ]}
                >
                  {dia.numero}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // A caixa do mes

  caixa: {
    height: 192,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",

    boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.25)",
  },

  cabecalho: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  linha: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },

  coluna: {
    flex: 1,
  },

  setaEsquerda: {
    alignItems: "flex-end",
  },
  setaDireita: {
    alignItems: "flex-start",
  },

  tituloMes: {
    flex: 2,
    fontSize: 14,
  },
  // Colunas 5, 6 e 7 do cabeçalho, vazias.
  resto: {
    flex: 3,
  },

  texto: {
    fontSize: 12,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
  },

  foraDoMes: {
    opacity: 0.3,
  },
  // O dia destacado do Figma: azul #0088FF (a mesma cor dos ícones) e 13 px.
  destacado: {
    color: COR_ICONE_AZUL,
    fontSize: 13,
  },
});
