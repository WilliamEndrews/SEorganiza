import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIAS_FIXAS } from '../constantes/dados';
import { animarPainel } from '../utilidades/animarPainel';

// Context da área de opções, no molde do AlunosContext da aula 03.
// Guarda o que mais de uma tela precisa ler ou alterar: as preferências de
// Configurações, as categorias e se o menu está aberto.
const OpcoesContext = createContext(null);

// Uma chave do AsyncStorage para cada dado salvo (aula 05).
const CHAVES = {
  nome: '@seorganize/nome',
  tema: '@seorganize/tema',
  primeiroDia: '@seorganize/primeiroDia',
  formatoHora: '@seorganize/formatoHora',
  avisos: '@seorganize/avisos',
  categorias: '@seorganize/categorias',
};

// Valores de quando nada foi salvo. "Apagar dados salvos" volta para eles.
const INICIAL = {
  nome: '',
  tema: 'automatico',
  primeiroDia: 'domingo',
  formatoHora: '24h',
  avisos: { lembretes: true, resumoDoDia: false, atrasadas: true },
  categorias: [],
};

// O AsyncStorage só guarda texto. Por isso o valor vira JSON antes de salvar.
async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não foi possível salvar ' + chave, erro);
  }
}

// Lê uma chave e desfaz o JSON. Devolve null se ela nunca foi salva.
async function carregar(chave) {
  const texto = await AsyncStorage.getItem(chave);
  return texto === null ? null : JSON.parse(texto);
}

export function OpcoesProvider({ children }) {
  // Nome do perfil local. Não existe login, e-mail nem senha: é só um nome que o
  // usuário digita. Vazio significa "ainda sem nome": a tela mostra o texto
  // padrão do Figma.
  const [nomeUsuario, setNomeUsuario] = useState(INICIAL.nome);
  // Como o visual é escolhido: 'automatico' (segue o relógio), 'dia' ou 'noite'.
  const [modoTema, setModoTema] = useState(INICIAL.tema);
  // Preferências da página Data e Hora. Nenhuma tela as usa ainda.
  // primeiroDiaSemana: 'domingo' ou 'segunda'. formatoHora: '24h' ou '12h'.
  const [primeiroDiaSemana, setPrimeiroDiaSemana] = useState(INICIAL.primeiroDia);
  const [formatoHora, setFormatoHora] = useState(INICIAL.formatoHora);
  // Chaves da página Notificações. É só demonstração: ligar ou desligar aqui não
  // envia, agenda nem pede permissão de nenhum aviso.
  const [avisosDemo, setAvisosDemo] = useState(INICIAL.avisos);
  // Categorias criadas pelo usuário (além das três fixas). No máximo três.
  const [categoriasNovas, setCategoriasNovas] = useState(INICIAL.categorias);
  const [menuAberto, setMenuAberto] = useState(false);
  // O desfoque do vidro de Configurações precisa de um ref para a área que fica
  // atrás dele. O menu e o vidro deslizam com estes valores (0 = aberto,
  // 1 = fora da tela). Ficam aqui porque a tela inicial e as rotas de opções
  // usam os três: uma tela anima a saída e a outra anima a entrada.
  // A função dentro do useState faz cada Animated.Value ser criado uma vez só.
  const alvoDesfoque = useRef(null);
  const [deslizeMenu] = useState(function () {
    return new Animated.Value(1);
  });
  const [deslizeConfig] = useState(function () {
    return new Animated.Value(1);
  });

  // Ao abrir o app, lê o que foi salvo da última vez. A lista vazia no fim faz
  // isto rodar uma vez só. O que nunca foi salvo continua com o valor inicial.
  useEffect(function () {
    async function carregarTudo() {
      try {
        const nome = await carregar(CHAVES.nome);
        if (nome !== null) setNomeUsuario(nome);
        const tema = await carregar(CHAVES.tema);
        if (tema !== null) setModoTema(tema);
        const primeiroDia = await carregar(CHAVES.primeiroDia);
        if (primeiroDia !== null) setPrimeiroDiaSemana(primeiroDia);
        const hora = await carregar(CHAVES.formatoHora);
        if (hora !== null) setFormatoHora(hora);
        const avisos = await carregar(CHAVES.avisos);
        if (avisos !== null) setAvisosDemo(avisos);
        const novas = await carregar(CHAVES.categorias);
        if (novas !== null) {
          // Versões anteriores salvavam só o nome de cada categoria.
          setCategoriasNovas(
            novas.map(function (categoria, indice) {
              if (typeof categoria === 'string') {
                return { id: 'antiga-' + indice, nome: categoria };
              }
              return categoria;
            })
          );
        }
      } catch (erro) {
        console.warn('Não foi possível carregar os dados salvos', erro);
      }
    }
    carregarTudo();
  }, []);

  const categorias = CATEGORIAS_FIXAS.concat(categoriasNovas);

  // Todas as funções de alterar seguem o fluxo da aula 05: criar o valor novo,
  // atualizar o estado e depois salvar.
  function mudarNome(novo) {
    setNomeUsuario(novo);
    salvar(CHAVES.nome, novo);
  }

  function escolherTema(novo) {
    setModoTema(novo);
    salvar(CHAVES.tema, novo);
  }

  function escolherPrimeiroDia(novo) {
    setPrimeiroDiaSemana(novo);
    salvar(CHAVES.primeiroDia, novo);
  }

  function escolherFormatoHora(novo) {
    setFormatoHora(novo);
    salvar(CHAVES.formatoHora, novo);
  }

  function alternarAviso(chave) {
    // Copia o objeto e troca só a chave tocada (não mudamos o estado antigo).
    const novos = { ...avisosDemo, [chave]: !avisosDemo[chave] };
    setAvisosDemo(novos);
    salvar(CHAVES.avisos, novos);
  }

  function adicionarCategoria(nome) {
    // O id usa a hora em milissegundos, como na aula 03: não se repete entre
    // duas categorias criadas pela mesma pessoa.
    const nova = { id: Date.now().toString(), nome: nome };
    const novas = categoriasNovas.concat([nova]);
    setCategoriasNovas(novas);
    salvar(CHAVES.categorias, novas);
  }

  // Só as categorias criadas pelo usuário podem ser excluídas.
  function excluirCategoria(id) {
    const novas = categoriasNovas.filter(function (categoria) {
      return categoria.id !== id;
    });
    setCategoriasNovas(novas);
    salvar(CHAVES.categorias, novas);
  }

  function buscarCategoriaPorId(id) {
    return categorias.find(function (categoria) {
      return categoria.id === id;
    });
  }

  // O caminho de ida, espelho de voltarAoMenu: se o menu está aberto, ele sai da
  // tela primeiro; só quando essa animação termina é que o vidro entra.
  function entrarNasOpcoes() {
    deslizeConfig.setValue(1);
    function entrarVidro() {
      animarPainel(deslizeConfig, 0);
    }
    if (menuAberto) {
      animarPainel(deslizeMenu, 1, function () {
        setMenuAberto(false);
        entrarVidro();
      });
    } else {
      entrarVidro();
    }
  }

  // Fecha as opções e volta para o menu. Primeiro o vidro sai da tela; só quando
  // essa animação termina é que o menu abre e as rotas de opções saem da pilha.
  // `depois` é opcional e roda no fim, com o vidro já fora da tela. A checagem de
  // tipo existe porque esta função também vai direto no onPress, que passa o evento.
  function voltarAoMenu(depois) {
    animarPainel(deslizeConfig, 1, function () {
      setMenuAberto(true);
      router.dismissTo('/');
      if (typeof depois === 'function') depois();
    });
  }

  // Tira cada chave do aparelho e volta os valores ao início.
  async function apagarDadosSalvos() {
    try {
      for (const chave of Object.values(CHAVES)) {
        await AsyncStorage.removeItem(chave);
      }
    } catch (erro) {
      console.warn('Não foi possível apagar os dados salvos', erro);
    }
    setNomeUsuario(INICIAL.nome);
    setModoTema(INICIAL.tema);
    setPrimeiroDiaSemana(INICIAL.primeiroDia);
    setFormatoHora(INICIAL.formatoHora);
    setAvisosDemo(INICIAL.avisos);
    setCategoriasNovas(INICIAL.categorias);
  }

  return (
    <OpcoesContext.Provider
      value={{
        nomeUsuario,
        mudarNome,
        modoTema,
        escolherTema,
        primeiroDiaSemana,
        escolherPrimeiroDia,
        formatoHora,
        escolherFormatoHora,
        avisosDemo,
        alternarAviso,
        categorias,
        adicionarCategoria,
        excluirCategoria,
        buscarCategoriaPorId,
        apagarDadosSalvos,
        menuAberto,
        setMenuAberto,
        entrarNasOpcoes,
        voltarAoMenu,
        alvoDesfoque,
        deslizeMenu,
        deslizeConfig,
      }}
    >
      {children}
    </OpcoesContext.Provider>
  );
}

// Atalho para as telas lerem o Context. Avisa cedo se alguma tela ficar fora do
// Provider, em vez de quebrar depois com "undefined".
export function useOpcoes() {
  const contexto = useContext(OpcoesContext);
  if (!contexto) {
    throw new Error('useOpcoes precisa ser usado dentro de OpcoesProvider.');
  }
  return contexto;
}
