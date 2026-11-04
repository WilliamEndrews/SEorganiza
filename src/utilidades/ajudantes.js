// Funções pequenas usadas por mais de uma tela.
// Sem nome digitado, aparece o texto padrão do Figma.
export function nomeParaExibir(nomeUsuario) {
  return nomeUsuario.trim() || 'Nome de usuário';
}

// Primeira letra do nome, em maiúscula. Sem nome, devolve vazio (o círculo fica liso).
export function inicialDoNome(nomeUsuario) {
  return nomeUsuario.trim().charAt(0).toUpperCase();
}

// Devolve { total, concluidas, pendentes }. Usada em Dados e em Perfil.
export function contarTarefas(tarefas) {
  const total = tarefas.length;
  const concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida;
  }).length;
  return { total: total, concluidas: concluidas, pendentes: total - concluidas };
}

// Data de hoje no formato 'AAAA-MM-DD', o mesmo que o calendário usa.
// padStart(2, '0') completa com zero à esquerda: 9 vira '09'.
// getMonth() começa em 0 (janeiro), por isso o + 1.
export function dataDeHoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return agora.getFullYear() + '-' + mes + '-' + dia;
}

// '2026-10-28' vira '28/10/2026', o jeito brasileiro de mostrar a data.
export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return dia + '/' + mes + '/' + ano;
}

// Troca uma cor '#RRGGBB' por 'rgba(r, g, b, alfa)'.
export function hexComAlfa(hex, alfa) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alfa + ')';
}
