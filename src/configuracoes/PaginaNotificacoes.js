import { Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaChave } from '../componentes/LinhasConfig';
import { estilosConfig } from './estilosConfig';

// Página Notificações: SOMENTE DEMONSTRATIVA.
// As chaves mudam na tela, mas o app não envia, agenda nem pede permissão de aviso.
export default function PaginaNotificacoes({ avisosDemo, aoAlternarAviso, aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Notificações" aoVoltar={aoVoltar} />

      <GrupoVidro cor="azul" style={estilosConfig.grupo}>
        <LinhaChave
          titulo="Lembretes"
          ligado={avisosDemo.lembretes}
          aoAlternar={function () {
            aoAlternarAviso('lembretes');
          }}
        />
        <LinhaChave
          titulo="Resumo do dia"
          ligado={avisosDemo.resumoDoDia}
          aoAlternar={function () {
            aoAlternarAviso('resumoDoDia');
          }}
        />
        <LinhaChave
          titulo="Tarefas atrasadas"
          ligado={avisosDemo.atrasadas}
          aoAlternar={function () {
            aoAlternarAviso('atrasadas');
          }}
        />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        Apenas demonstração: nenhuma notificação é enviada, agendada ou pedida ao sistema.
      </Text>
      <Text style={estilosConfig.notaPagina}>
        As chaves ficam salvas neste aparelho e continuam iguais quando o app fecha.
      </Text>
    </View>
  );
}
