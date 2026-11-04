import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import GrupoVidro from '../componentes/GrupoVidro';
import { OpcaoEscolha } from '../componentes/LinhasConfig';
import { HORA_NASCER_DO_SOL, HORA_POR_DO_SOL, TEMAS } from '../constantes/temas';
import { estilosConfig } from './estilosConfig';

// Sol ou lua pequenininho, com as mesmas cores do canto da tela inicial.
// Recebe o `astro` de um tema (as cores do degradê).
function MiniAstro({ astro }) {
  return (
    <LinearGradient
      colors={astro.cores}
      locations={astro.posicoes}
      style={styles.miniAstro}
    />
  );
}

// Página Temas: seguir o relógio ou fixar dia ou noite.
// aoEscolher muda o `modoTema` no App, e a tela inicial atrás do vidro já muda na hora.
export default function PaginaTemas({ modoTema, aoEscolher, aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo="Temas" aoVoltar={aoVoltar} />

      <GrupoVidro cor="azul" style={estilosConfig.grupo}>
        <OpcaoEscolha
          titulo="Automático"
          desenho={
            <View style={styles.parDeAstros}>
              <MiniAstro astro={TEMAS.dia.astro} />
              <View style={styles.astroSobreposto}>
                <MiniAstro astro={TEMAS.noite.astro} />
              </View>
            </View>
          }
          selecionado={modoTema === 'automatico'}
          aoEscolher={function () {
            aoEscolher('automatico');
          }}
        />
        <OpcaoEscolha
          titulo="Dia"
          desenho={<MiniAstro astro={TEMAS.dia.astro} />}
          selecionado={modoTema === 'dia'}
          aoEscolher={function () {
            aoEscolher('dia');
          }}
        />
        <OpcaoEscolha
          titulo="Noite"
          desenho={<MiniAstro astro={TEMAS.noite.astro} />}
          selecionado={modoTema === 'noite'}
          aoEscolher={function () {
            aoEscolher('noite');
          }}
        />
      </GrupoVidro>

      <Text style={estilosConfig.notaPagina}>
        Automático segue o relógio do aparelho: dia das {HORA_NASCER_DO_SOL}h às{' '}
        {HORA_POR_DO_SOL}h e noite no resto.
      </Text>
      <Text style={estilosConfig.notaPagina}>
        A escolha fica salva neste aparelho e continua valendo quando o app fecha.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Medidas nossas (o Figma não tem essa página).
  miniAstro: {
    width: 40,
    height: 27,
    borderRadius: '50%',
  },
  parDeAstros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  astroSobreposto: {
    marginLeft: -22,
  },
});
