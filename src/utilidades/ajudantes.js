// Funções pequenas do perfil, usadas por mais de uma tela.
// Sem nome digitado, aparece o texto padrão do desenho do Figma.
export function nomeParaExibir(nomeUsuario) {
  return nomeUsuario.trim() || 'Nome de usuário';
}

// Primeira letra do nome, em maiúscula. Sem nome, devolve vazio (o círculo fica liso).
export function inicialDoNome(nomeUsuario) {
  return nomeUsuario.trim().charAt(0).toUpperCase();
}

// Conta as tarefas a partir da lista real. Usada em Dados e em Perfil.
export function contarTarefas(tarefas) {
  const total = tarefas.length;
  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida;
  }).length;
  return { total: total, concluidas: concluidas, pendentes: total - concluidas };
}

// Troca uma cor '#RRGGBB' por 'rgba(r, g, b, alfa)'.
export function hexComAlfa(hex, alfa) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alfa + ')';
}
