// Dados reais do app. Ainda não existe tela para criar tarefas, então TAREFAS
// fica vazia. Quando a criação de tarefas existir, cada tarefa será assim:
// { id, titulo, concluida, excluida, categoriaId }.
// As categorias começam com três fixas; o usuário pode criar até mais três pelo
// menu. Cada categoria tem um id (usado no endereço /categoria/[id]) e um nome.
// As novas ficam salvas no aparelho com AsyncStorage (veja
// src/contexto/OpcoesContext.js).
export const TAREFAS = [];
export const CATEGORIAS_FIXAS = [
  { id: 'trabalho', nome: 'Trabalho' },
  { id: 'dia-a-dia', nome: 'Dia a Dia' },
  { id: 'eventos', nome: 'Eventos' },
];
export const LIMITE_CATEGORIAS_NOVAS = 3;
