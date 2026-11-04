import { Text, View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { OpcaoEscolha } from '../componentes/LinhasConfig';
import { estilosConfig } from './estilosConfig';

// Página Data e Hora: duas preferências que ficam guardadas no App.
// Ainda nenhuma tela usa essas escolhas (a agenda não existe ainda).
export default function PaginaDataHora({
  primeiroDiaSemana,
  aoEscolherPrimeiroDia,
  formatoHora,
  aoEscolherFormatoHora,
  aoVoltar,
}) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Data e Hora" aoVoltar={aoVoltar} />

      <Text style={estilosConfig.tituloSecao}>Primeiro dia da semana</Text>
      <GrupoVidro cor="azul" style={[estilosConfig.grupo, estilosConfig.grupoPagina]}>
        <OpcaoEscolha
          titulo="Domingo"
          selecionado={primeiroDiaSemana === 'domingo'}
          aoEscolher={function () {
            aoEscolherPrimeiroDia('domingo');
          }}
        />
        <OpcaoEscolha
          titulo="Segunda-feira"
          selecionado={primeiroDiaSemana === 'segunda'}
          aoEscolher={function () {
            aoEscolherPrimeiroDia('segunda');
          }}
        />
      </GrupoVidro>

      <Text style={estilosConfig.tituloSecao}>Formato de horário</Text>
      <GrupoVidro cor="azul" style={[estilosConfig.grupo, estilosConfig.grupoPagina]}>
        <OpcaoEscolha
          titulo="24 horas (15:30)"
          selecionado={formatoHora === '24h'}
          aoEscolher={function () {
            aoEscolherFormatoHora('24h');
          }}
        />
        <OpcaoEscolha
          titulo="12 horas (3:30 PM)"
          selecionado={formatoHora === '12h'}
          aoEscolher={function () {
            aoEscolherFormatoHora('12h');
          }}
        />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        Nenhuma tela usa essas escolhas ainda. A agenda será a primeira a usá-las.
      </Text>
      <Text style={estilosConfig.notaPagina}>
        A escolha fica salva neste aparelho e continua valendo quando o app fecha.
      </Text>
    </View>
  );
}
