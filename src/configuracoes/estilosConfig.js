import { StyleSheet } from 'react-native';

// Estilos usados por mais de uma parte do painel de Configurações:
// a lista, as páginas internas e as linhas de src/componentes/LinhasConfig.js.
export const estilosConfig = StyleSheet.create({
  // As medidas abaixo vêm das posições do Figma (tela de 403 px de largura).
  // O painel mede 403 e os grupos têm 336, então sobram 33 px de cada lado.
  configMiolo: {
    flex: 1,
    paddingTop: 47,
    paddingHorizontal: 33,
  },
  tituloConfig: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  // O raio 13 foi medido na captura do Figma, não lido nas propriedades.
  grupo: {
    borderRadius: 13,
    overflow: 'hidden',
  },
  // Espaço embaixo de um bloco quando vem outro bloco ou título depois dele
  // (Data e Hora, Perfil, Feedback e Sobre).
  grupoPagina: {
    marginBottom: 18,
  },
  linhaConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingLeft: 13,
    paddingRight: 17,
  },
  linhaPressionada: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  textoConfig: {
    flex: 1,
    marginLeft: 12,
    color: '#000000',
    fontSize: 24,
  },
  // Opção sem desenho: o texto encosta no começo da linha.
  textoSemDesenho: {
    marginLeft: 0,
  },
  // Título de cada bloco da página Data e Hora.
  tituloSecao: {
    marginBottom: 8,
    paddingHorizontal: 4,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  // Texto explicativo embaixo dos blocos, usado em todas as páginas internas.
  notaPagina: {
    marginTop: 14,
    paddingHorizontal: 4,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});
