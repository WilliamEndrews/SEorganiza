import { TELA_LARGURA } from './figma';

// Os dois visuais da tela inicial: dia e noite.
// Cada tema é só um monte de cores. A tela escolhe um e usa os valores.
export const TEMAS = {
  dia: {
    fundo: ['#0C9BE2', '#52B7BC', '#A0E2E6'],
    posicoes: [0, 0.15, 0.7],
    veu: null,
    // Sol: elipse de 161 de largura no canto de cima à direita, um pouco
    // cortada pela borda da tela.
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
    // Números, borda e setas do calendário.
    textoCalendario: '#000000',
    barra: '#F4F7F8',
    barraDeStatus: 'dark',
  },
  noite: {
    fundo: ['#010012', '#040538', '#030B59', '#101D92', '#5A69EF'],
    posicoes: [0, 0.12, 0.19, 0.35, 0.99],
    // Camada branca fraquinha por cima do fundo, para a noite ficar um pouco
    // mais clara, como no Figma.
    veu: 'rgba(255, 255, 255, 0.2)',
    // Lua: mesma elipse do sol. Fica por cima do véu.
    astro: {
      cores: ['#000000', '#1A1F26', '#3B3B3B', '#2E3577', '#4E4A7A', '#C9EFED', '#D0DCE2'],
      posicoes: [0, 0.11, 0.31, 0.43, 0.49, 0.64, 0.77],
      direita: TELA_LARGURA - (313 + 161),
      topo: -29,
    },
    titulo: '#0C9BE2',
    // Mesmo card do dia, só que meio transparente.
    card: ['rgba(121, 220, 225, 0.6)', 'rgba(188, 230, 233, 0.6)'],
    bordaCard: 'rgba(255, 255, 255, 0.8)',
    textoCard: '#FFFFFF',
    circulo: '#2E7276',
    bandeira: '#C6D1E0',
    // Branco por enquanto, para dar para ler no fundo escuro (o Figma ainda
    // não tem o calendário da noite).
    textoCalendario: '#FFFFFF',
    barra: '#F2F2F7',
    barraDeStatus: 'light',
  },
};

// Das 6h até antes das 18h é dia, o resto é noite.
export const HORA_NASCER_DO_SOL = 6;
export const HORA_POR_DO_SOL = 18;

// Olha o relógio do celular e responde 'dia' ou 'noite'.
export function descobrirPeriodo() {
  const hora = new Date().getHours();
  if (hora >= HORA_NASCER_DO_SOL && hora < HORA_POR_DO_SOL) return 'dia';
  return 'noite';
}

// Recebe o modo de Configurações > Temas ('automatico', 'dia' ou 'noite') e
// devolve as cores. No automático quem decide é o relógio, mas só quando a
// tela é desenhada de novo (não tem timer).
export function temaDoModo(modoTema) {
  const periodo = modoTema === 'automatico' ? descobrirPeriodo() : modoTema;
  return TEMAS[periodo];
}
