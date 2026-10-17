import { Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaDado } from '../componentes/LinhasConfig';
import { contarTarefas } from '../utilidades/ajudantes';
import { estilosConfig } from './estilosConfig';

// Página Dados: contadores simples, calculados das listas reais de tarefas e categorias.
// Nada é inventado: as tarefas ainda estão vazias; as categorias vêm do menu.
export default function PaginaDados({ tarefas, categorias, aoVoltar }) {
  const { total, concluidas, pendentes } = contarTarefas(tarefas);

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
        As categorias vêm do menu: três fixas e até três que você criar. As novas valem só
        enquanto o app está aberto.
      </Text>
    </View>
  );
}
