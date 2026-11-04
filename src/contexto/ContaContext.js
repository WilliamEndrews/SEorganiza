import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CAMPOS_DO_USUARIO,
  carregar,
  chaveAntiga,
  chaveDoUsuario,
  salvar,
} from '../utilidades/armazenamento';

// Context das contas (aula 03): quem tem cadastro no aparelho e quem está logado.
//
// ATENÇÃO: login só de estudo (aula 05). A senha fica salva como texto puro no
// AsyncStorage, sem criptografia nem servidor. Serve para separar os dados de
// cada pessoa, não para proteger uma conta de verdade.
const ContaContext = createContext(null);

// Lista de contas: [{ email, senha }].
const CHAVE_USUARIOS = '@seorganize/usuarios';
// O e-mail de quem está logado. Se a chave não existe, ninguém está logado.
const CHAVE_SESSAO = '@seorganize/sessao';

// Tira espaços e deixa minúsculo, para "Ana@Email.com " e "ana@email.com"
// serem a mesma conta.
function limparEmail(email) {
  return email.trim().toLowerCase();
}

// Dados salvos sem conta ficam em chaves sem e-mail. No primeiro cadastro do
// aparelho, eles passam para a conta nova e a chave sem e-mail é apagada.
async function passarDadosAntigos(email) {
  for (const campo of CAMPOS_DO_USUARIO) {
    const valor = await carregar(chaveAntiga(campo));
    if (valor !== null) {
      await salvar(chaveDoUsuario(email, campo), valor);
      await AsyncStorage.removeItem(chaveAntiga(campo));
    }
  }
}

export function ContaProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  // null = ninguém logado. O layout raiz usa isso para escolher as telas.
  const [emailLogado, setEmailLogado] = useState(null);
  // Começa true: enquanto a sessão não foi lida, o layout espera, para o Login
  // não piscar na tela à toa.
  const [carregandoConta, setCarregandoConta] = useState(true);

  // Ao abrir o app, lê as contas e a sessão. A lista vazia faz rodar uma vez só.
  useEffect(function () {
    async function carregarConta() {
      try {
        const lista = await carregar(CHAVE_USUARIOS);
        if (lista !== null) setUsuarios(lista);
        const sessao = await carregar(CHAVE_SESSAO);
        if (sessao !== null) setEmailLogado(sessao);
      } catch (erro) {
        console.warn('Não foi possível carregar a conta', erro);
      }
      setCarregandoConta(false);
    }
    carregarConta();
  }, []);

  // As duas funções abaixo devolvem um texto de erro para a tela mostrar,
  // ou null quando deu tudo certo.
  async function cadastrar(email, senha) {
    const emailLimpo = limparEmail(email);
    const jaExiste = usuarios.find(function (usuario) {
      return usuario.email === emailLimpo;
    });
    if (jaExiste) return 'Este e-mail já tem cadastro';

    const primeiraConta = usuarios.length === 0;
    const novos = usuarios.concat([{ email: emailLimpo, senha: senha }]);
    setUsuarios(novos);
    await salvar(CHAVE_USUARIOS, novos);

    if (primeiraConta) await passarDadosAntigos(emailLimpo);

    // O perfil já nasce com a parte do e-mail antes do @, se ainda não tiver nome.
    const chaveNome = chaveDoUsuario(emailLimpo, 'nome');
    const nomeSalvo = await carregar(chaveNome);
    if (!nomeSalvo) await salvar(chaveNome, emailLimpo.split('@')[0]);

    // Loga por último: o OpcoesContext carrega os dados assim que emailLogado
    // muda, então eles já precisam estar salvos.
    await salvar(CHAVE_SESSAO, emailLimpo);
    setEmailLogado(emailLimpo);
    return null;
  }

  async function entrar(email, senha) {
    const emailLimpo = limparEmail(email);
    const conta = usuarios.find(function (usuario) {
      return usuario.email === emailLimpo && usuario.senha === senha;
    });
    if (!conta) return 'E-mail ou senha incorretos';

    await salvar(CHAVE_SESSAO, emailLimpo);
    setEmailLogado(emailLimpo);
    return null;
  }

  async function sair() {
    try {
      await AsyncStorage.removeItem(CHAVE_SESSAO);
    } catch (erro) {
      console.warn('Não foi possível sair da conta', erro);
    }
    setEmailLogado(null);
  }

  return (
    <ContaContext.Provider value={{ emailLogado, carregandoConta, cadastrar, entrar, sair }}>
      {children}
    </ContaContext.Provider>
  );
}

// Atalho para as telas lerem o Context, como o useOpcoes.
export function useConta() {
  const contexto = useContext(ContaContext);
  if (!contexto) {
    throw new Error('useConta precisa ser usado dentro de ContaProvider.');
  }
  return contexto;
}
