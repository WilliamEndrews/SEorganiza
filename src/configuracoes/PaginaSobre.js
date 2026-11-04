import { Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaDado } from '../componentes/LinhasConfig';
import { estilosConfig } from './estilosConfig';
// Nome e versão do app vêm direto do app.json.
import appJson from '../../app.json';

// Página Sobre: uma descrição curta, o nome e a versão.
export default function PaginaSobre({ aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Sobre" aoVoltar={aoVoltar} />

      <GrupoVidro cor="laranja" style={[estilosConfig.grupo, estilosConfig.grupoPagina]}>
        <LinhaDado titulo="Nome" valor={appJson.expo.name} />
        <LinhaDado titulo="Versão" valor={appJson.expo.version} />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        SEorganize é um aplicativo para organizar tarefas: crie, conclua e acompanhe pelo
        calendário. Ele ainda está em desenvolvimento: lembretes e Siga-nos ainda não existem.
      </Text>
      <Text style={estilosConfig.notaPagina}>Nome e versão vêm da configuração do app (app.json).</Text>
    </View>
  );
}
