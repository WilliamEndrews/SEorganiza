import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { LinhaInfo } from '../componentes/LinhasConfig';
import { COR_ICONE_AZUL } from '../constantes/figma';
import { estilosConfig } from './estilosConfig';

// Página Acessibilidade: não tem ajustes próprios. Só explica, com franqueza,
// o que a tela de Configurações já faz. Os ajustes de verdade (tamanho de letra,
// leitor de tela) ficam nas configurações do sistema do aparelho.
export default function PaginaAcessibilidade({ aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Acessibilidade" aoVoltar={aoVoltar} />

      <GrupoVidro cor="azul" style={estilosConfig.grupo}>
        <LinhaInfo
          icone={<MaterialCommunityIcons name="format-size" size={24} color={COR_ICONE_AZUL} />}
          titulo="Tamanho do texto"
          texto="Acompanha o tamanho de letra definido no sistema do aparelho."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="gesture-tap" size={24} color={COR_ICONE_AZUL} />}
          titulo="Áreas de toque"
          texto="Botões e opções de Configurações têm pelo menos 44 de altura."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="shape" size={24} color={COR_ICONE_AZUL} />}
          titulo="Além da cor"
          texto="O que está escolhido ou ligado também muda de forma e de texto, não só de cor."
        />
        <LinhaInfo
          icone={<MaterialCommunityIcons name="account-voice" size={24} color={COR_ICONE_AZUL} />}
          titulo="Leitor de tela"
          texto="Os botões e as opções de Configurações têm nome para o leitor de tela."
        />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        Esta página só informa: não há ajustes aqui. Para mudar o tamanho da letra ou ligar o
        leitor de tela, use as configurações do aparelho.
      </Text>
    </View>
  );
}
