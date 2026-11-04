import AsyncStorage from '@react-native-async-storage/async-storage';

// Ajudantes do AsyncStorage (aula 05), usados pelos dois Contexts:
// o ContaContext (contas e sessão) e o OpcoesContext (dados de cada usuário).

// O AsyncStorage só guarda texto. Por isso o valor vira JSON antes de salvar.
export async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não foi possível salvar ' + chave, erro);
  }
}

// Lê uma chave e desfaz o JSON. Devolve null se ela nunca foi salva.
export async function carregar(chave) {
  const texto = await AsyncStorage.getItem(chave);
  return texto === null ? null : JSON.parse(texto);
}

// Os dados de cada usuário. Cada um vira uma chave própria.
export const CAMPOS_DO_USUARIO = [
  'nome',
  'tema',
  'primeiroDia',
  'formatoHora',
  'avisos',
  'categorias',
  'tarefas',
];

// A chave de um dado de um usuário. O e-mail no meio separa as pessoas:
//   chaveDoUsuario('ana@email.com', 'tarefas') -> '@seorganize/ana@email.com/tarefas'
// Assim as tarefas da Ana nunca se misturam com as de outra conta.
export function chaveDoUsuario(email, campo) {
  return '@seorganize/' + email + '/' + campo;
}

// Chave sem e-mail, tipo '@seorganize/tarefas'. Só o primeiro cadastro usa,
// para passar esses dados para a conta nova.
export function chaveAntiga(campo) {
  return '@seorganize/' + campo;
}
