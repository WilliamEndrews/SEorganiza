/*dadoos que seram usados nocalemdario*/

// Cabeçalho das 7 colunas, de domingo a sábado
export const DIAS_DA_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


export const TITULO_MES = 'Setembro de 2026';

// O dia pintado de azul no Figma 
export const DIA_DESTACADO = 1;


// Aula 01 (fundamentos): o operador ... (spread) junta três listas numa só.
// - [30, 31].map(...) transforma cada número num objeto.
// - Array.from({ length: 30 }, ...) cria uma lista de 30 itens; a função recebe
//   o índice i (0, 1, 2...) e por isso o número do dia é i + 1.
const DIAS = [
  ...[30, 31].map(function (numero) {
    return { numero: numero, foraDoMes: true };
  }),
  ...Array.from({ length: 30 }, function (_, i) {
    return { numero: i + 1, foraDoMes: false };
  }),
  ...Array.from({ length: 10 }, function (_, i) {
    return { numero: i + 1, foraDoMes: true };
  }),
];

/* Corta a lista de 42 dias em pedaços de 7: cada pedaço é uma linha (semana).
 slice(i, i + 7) copia do índice i até antes de i + 7, sem alterar DIAS.
 Resultado: [[30, 31, 1, 2, 3, 4, 5], [6, ..., 12], ..., [4, ..., 10]].*/
export const SEMANAS = [];
for (let i = 0; i < DIAS.length; i += 7) {
  SEMANAS.push(DIAS.slice(i, i + 7));
}
