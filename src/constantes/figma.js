// Medidas, cores e efeitos tirados do Figma.

// Tela do iPhone 14 Plus no Figma e o painel da tela 7.
export const TELA_LARGURA = 428;
export const TELA_ALTURA = 926;
export const PAINEL_X = 128;
export const PAINEL_Y = 46;
export const PAINEL_LARGURA = 288;
export const PAINEL_ALTURA = 780;

// Painel de Configurações: tamanho e posição.
export const CONFIG_LARGURA = 403;
export const CONFIG_ALTURA = 881;
export const CONFIG_X = 12;
export const CONFIG_Y = 28;

// Degradê azul na diagonal: escuro no canto de cima à esquerda, claro para
// baixo e para a direita. start/end vão de 0 (começo) a 1 (fim).
export const DEGRADE_AZUL = ['#5C6674', '#9AB3D3'];
export const DEGRADE_AZUL_INICIO = { x: 0, y: 0 };
export const DEGRADE_AZUL_FIM = { x: 0.93, y: 0.4 };

// Degradê laranja: mesma ideia do azul, só que menos inclinado.
export const DEGRADE_LARANJA = ['#B2621D', '#D9C5A0'];
export const DEGRADE_LARANJA_INICIO = { x: 0, y: 0 };
export const DEGRADE_LARANJA_FIM = { x: 0.8, y: 0.22 };

// 1 = degradê opaco, 0 = invisível. Menor fica mais transparente, mas o texto
// preto fica mais difícil de ler.
export const OPACIDADE_VIDRO = 0.5;

export const COR_ICONE_AZUL = '#0088FF';
export const COR_ICONE_LARANJA = '#FFAA00';

// Fundo do Login e do Cadastro: degradê de cima para baixo sobre o cinza base.
// O @type avisa a checagem de tipos que as listas têm 2 itens ou mais.
/** @type {{ base: string, cores: [string, string, ...string[]], posicoes: [number, number, ...number[]] }} */
export const FUNDO_CONTA = {
  base: '#F2F2F7',
  cores: [
    'rgba(183, 226, 239, 0.8)',
    'rgba(132, 220, 218, 0.8)',
    'rgba(174, 238, 233, 0.8)',
    'rgba(168, 238, 173, 0.8)',
    'rgba(113, 239, 78, 0.8)',
  ],
  posicoes: [0, 0.115, 0.192, 0.346, 0.986],
};
export const COR_CAMPO_CONTA = '#D9D9D9';
export const COR_BOTAO_CONTA = '#5E64BF';
// Os mesmos nomes usados no useFonts do layout raiz.
export const FONTE_TITULO_CONTA = 'Jaro';
export const FONTE_LINK_CONTA = 'JetBrainsMono';
export const FONTE_DESTAQUE_CONTA = 'JuliusSansOne';

// Efeito de vidro (versão aproximada do Figma).
export const vidro = {
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(15px) saturate(160%)',
  WebkitBackdropFilter: 'blur(15px) saturate(160%)',
  boxShadow:
    '0 20px 40px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 1px 0 8px rgba(255, 70, 70, 0.22), inset -1px 0 8px rgba(70, 120, 255, 0.28)',
};
