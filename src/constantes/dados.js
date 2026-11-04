// Dados fixos do app. As tarefas ficam no OpcoesContext e são salvas com
// AsyncStorage (aula 05). São três categorias fixas, e dá para criar mais
// três pelo menu. O id vai no endereço /categoria/[id].
export const CATEGORIAS_FIXAS = [
  { id: 'trabalho', nome: 'Trabalho' },
  { id: 'dia-a-dia', nome: 'Dia a Dia' },
  { id: 'eventos', nome: 'Eventos' },
];
export const LIMITE_CATEGORIAS_NOVAS = 3;
