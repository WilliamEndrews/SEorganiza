// Dados reais do app. Ainda não existe tela para criar tarefas, então TAREFAS
// fica vazia. As categorias começam com três nomes fixos; o usuário pode criar
// até mais três pelo menu. Isso vive só na memória: ao fechar o app, as novas
// somem e voltam as três iniciais. Quando a criação de tarefas existir, cada
// tarefa será assim: { titulo, concluida }.
export const TAREFAS = [];
export const CATEGORIAS_FIXAS = ['Trabalho', 'Dia a Dia', 'Eventos'];
export const LIMITE_CATEGORIAS_NOVAS = 3;
