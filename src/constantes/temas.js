import { TELA_LARGURA } from './figma';

// Os dois visuais da tela inicial, o de dia e o de noite.
// Cada tema é só um conjunto de cores. A tela escolhe um deles e usa os valores.
// Dia: cores que já usávamos. Noite: degradê informado pelo Figma, mais as
// cores medidas na captura da tela "iPhone 14 Plus - 4".
export const TEMAS = {
  dia: {
    fundo: ['#0C9BE2', '#52B7BC', '#A0E2E6'],
    posicoes: [0, 0.15, 0.7],
    veu: null,
    // Sol: elipse de 161×108 no canto superior direito, cortada pela borda da tela.
    // Posição do Figma (Ellipse 2): x 318 e y -24. Pontos do degradê informados
    // por você: 0%, 11%, 31%, 43%, 49%, 64% e 77%, de cima para baixo.
    astro: {
      cores: ['#FFE500', '#FEA900', '#F8DA63', '#EBE972', '#F2E4AC', '#F9EBB1', '#7AC7D0'],
      posicoes: [0, 0.11, 0.31, 0.43, 0.49, 0.64, 0.77],
      direita: TELA_LARGURA - (318 + 161),
      topo: -24,
    },
    titulo: '#558796',
    card: ['#58E4EC', '#E4FDFB'],
    bordaCard: null,
    textoCard: '#000000',
    circulo: '#7A9AAA',
    bandeira: '#5C6B73',
    barra: '#F4F7F8',
    barraDeStatus: 'dark',
  },
  noite: {
    // Pontos do degradê do Figma: 0%, 12%, 19%, 35% e 99%.
    fundo: ['#010012', '#040538', '#030B59', '#101D92', '#5A69EF'],
    posicoes: [0, 0.12, 0.19, 0.35, 0.99],
    // Na captura, a tela da noite aparece cerca de 20% mais clara do que esses
    // pontos puros (a soma bate com uma camada branca a 20% por cima). Não
    // consegui ver qual camada do Figma faz isso, então reproduzo o resultado.
    veu: 'rgba(255, 255, 255, 0.2)',
    // Lua: mesma elipse, na posição do Figma (Ellipse 3): x 313 e y -29.
    // Fica por cima do véu: na captura, as cores da lua batem com os pontos puros.
    astro: {
      cores: ['#000000', '#1A1F26', '#3B3B3B', '#2E3577', '#4E4A7A', '#C9EFED', '#D0DCE2'],
      posicoes: [0, 0.11, 0.31, 0.43, 0.49, 0.64, 0.77],
      direita: TELA_LARGURA - (313 + 161),
      topo: -29,
    },
    titulo: '#0C9BE2',
    // O card da noite é o mesmo degradê do dia, só que translúcido (cerca de 60%).
    card: ['rgba(121, 220, 225, 0.6)', 'rgba(188, 230, 233, 0.6)'],
    bordaCard: 'rgba(255, 255, 255, 0.8)',
    textoCard: '#FFFFFF',
    circulo: '#2E7276',
    bandeira: '#C6D1E0',
    barra: '#F2F2F7',
    barraDeStatus: 'light',
  },
};

// Horário que separa o dia da noite. Combinação nossa, não vem do Figma:
// das 6h até antes das 18h é dia, o resto é noite.
export const HORA_NASCER_DO_SOL = 6;
export const HORA_POR_DO_SOL = 18;

// Olha o relógio do aparelho e responde 'dia' ou 'noite'.
export function descobrirPeriodo() {
  const hora = new Date().getHours();
  if (hora >= HORA_NASCER_DO_SOL && hora < HORA_POR_DO_SOL) return 'dia';
  return 'noite';
}
