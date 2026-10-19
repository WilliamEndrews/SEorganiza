import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaDado } from '../componentes/LinhasConfig';
import { contarTarefas } from '../utilidades/ajudantes';
import { estilosConfig } from './estilosConfig';

// Página Dados: contadores simples, calculados das listas reais de tarefas e categorias.
// Nada é inventado: as tarefas ainda estão vazias; as categorias vêm do menu.
// Embaixo fica o botão que apaga tudo o que o app salvou no aparelho.
export default function PaginaDados({ tarefas, categorias, aoApagarDados, aoVoltar }) {
  const { total, concluidas, pendentes } = contarTarefas(tarefas);
  // O primeiro toque em "Apagar dados salvos" só pede confirmação.
  const [confirmando, setConfirmando] = useState(false);
  const [apagado, setApagado] = useState(false);

  async function confirmarApagar() {
    await aoApagarDados();
    setConfirmando(false);
    setApagado(true);
  }

  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Dados" aoVoltar={aoVoltar} />

      <GrupoVidro cor="azul" style={estilosConfig.grupo}>
        <LinhaDado titulo="Total de tarefas" valor={total} />
        <LinhaDado titulo="Concluídas" valor={concluidas} />
        <LinhaDado titulo="Pendentes" valor={pendentes} />
        <LinhaDado titulo="Categorias" valor={categorias.length} />
      </GrupoVidro>

      {total === 0 ? (
        <Text style={estilosConfig.notaPagina}>
          Nenhuma tarefa cadastrada ainda. O app ainda não tem tela para criar tarefas, por isso
          as tarefas mostram 0.
        </Text>
      ) : null}
      <Text style={estilosConfig.notaPagina}>
        As categorias vêm do menu: três fixas e até três que você criar. As novas ficam salvas
        neste aparelho.
      </Text>

      {confirmando ? (
        <View style={styles.areaApagar}>
          <Text style={styles.avisoApagar}>
            Isso apaga o nome, o tema, as preferências e as categorias que você criou. Tem
            certeza?
          </Text>
          <View style={styles.linhaBotoes}>
            <Pressable
              onPress={function () {
                setConfirmando(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              style={function (estado) {
                return [
                  styles.botao,
                  styles.botaoNaLinha,
                  styles.botaoCancelar,
                  estado.pressed ? styles.botaoPressionado : null,
                ];
              }}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={confirmarApagar}
              accessibilityRole="button"
              accessibilityLabel="Sim, apagar"
              style={function (estado) {
                return [
                  styles.botao,
                  styles.botaoNaLinha,
                  styles.botaoApagar,
                  estado.pressed ? styles.botaoPressionado : null,
                ];
              }}
            >
              <Text style={styles.textoBotao}>Sim, apagar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={function () {
            setApagado(false);
            setConfirmando(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Apagar dados salvos"
          style={function (estado) {
            return [
              styles.botao,
              styles.botaoApagar,
              styles.areaApagar,
              estado.pressed ? styles.botaoPressionado : null,
            ];
          }}
        >
          <Text style={styles.textoBotao}>Apagar dados salvos</Text>
        </Pressable>
      )}

      {apagado ? (
        <Text accessibilityLiveRegion="polite" style={styles.avisoApagar}>
          Pronto. Os dados salvos foram apagados e tudo voltou ao padrão.
        </Text>
      ) : null}
    </View>
  );
}

// Medidas minhas, pois o Figma não desenha essa página. Os botões seguem os do Feedback.
const styles = StyleSheet.create({
  areaApagar: {
    marginTop: 18,
  },
  avisoApagar: {
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  // Os dois botões da confirmação dividem a linha ao meio.
  botaoNaLinha: {
    flex: 1,
  },
  botao: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  botaoCancelar: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  botaoApagar: {
    backgroundColor: '#D93025',
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
