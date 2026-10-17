// Medidas, cores e efeitos lidos no protótipo do Figma.

// iPhone 14 Plus do Figma. O painel da tela 7 fica nestas coordenadas.
export const TELA_LARGURA = 428;
export const TELA_ALTURA = 926;
export const PAINEL_X = 128;
export const PAINEL_Y = 46;
export const PAINEL_LARGURA = 288;
export const PAINEL_ALTURA = 780;

// Painel de Configurações (nó 114:68). A caixa exportada mede 403×881.
export const CONFIG_LARGURA = 403;
export const CONFIG_ALTURA = 881;
// Posição lida no Figma (Group 12): 12 px da esquerda e 28 px do topo.
export const CONFIG_X = 12;
export const CONFIG_Y = 28;

// Comentário 9 do Figma: os dois retângulos azuis usam o mesmo degradê,
// de #5C6674 até #9AB3D3.
// Direção medida em pixels na imagem do Figma: o escuro fica no canto
// superior esquerdo e o claro vai para a direita e para baixo (diagonal).
// Isso corrige a primeira versão, que tinha o degradê na vertical.
// Os números de start/end são frações do retângulo (0 = começo, 1 = fim).
export const DEGRADE_AZUL = ['#5C6674', '#9AB3D3'];
export const DEGRADE_AZUL_INICIO = { x: 0, y: 0 };
export const DEGRADE_AZUL_FIM = { x: 0.93, y: 0.4 };

// Comentário 10: o retângulo laranja vai de #B2621D até #D9C5A0.
// Também medido na imagem: laranja forte no canto superior esquerdo e
// bege claro para a direita, com uma inclinação menor que a do azul.
export const DEGRADE_LARANJA = ['#B2621D', '#D9C5A0'];
export const DEGRADE_LARANJA_INICIO = { x: 0, y: 0 };
export const DEGRADE_LARANJA_FIM = { x: 0.8, y: 0.22 };

// Quanto o degradê dos grupos "cobre" o painel: 1 é opaco, 0 é invisível.
// Quanto menor, mais translúcido (mais do painel escuro aparece por trás),
// mas o texto preto fica mais difícil de ler. Veja o comentário em GrupoVidro.
export const OPACIDADE_VIDRO = 0.5;

// Cores dos ícones lidas na imagem do Figma.
export const COR_ICONE_AZUL = '#0088FF';
export const COR_ICONE_LARANJA = '#FFAA00';

// Vidro do Figma: luz -45° a 80%, refração 80, profundidade 20,
// dispersão 50, gelo 15 e distorção splay.
export const vidro = {
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(15px) saturate(160%)',
  WebkitBackdropFilter: 'blur(15px) saturate(160%)',
  boxShadow:
    '0 20px 40px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 1px 0 8px rgba(255, 70, 70, 0.22), inset -1px 0 8px rgba(70, 120, 255, 0.28)',
};
