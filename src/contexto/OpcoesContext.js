import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIAS_FIXAS } from '../constantes/dados';
import { animarPainel } from '../utilidades/animarPainel';
import {
  CAMPOS_DO_USUARIO,
  carregar,
  chaveDoUsuario,
  salvar,
} from '../utilidades/armazenamento';
import { dataDeHoje } from '../utilidades/ajudantes';
import { useConta } from './ContaContext';

// Context das opções, no molde do AlunosContext da aula 03.
// Guarda o que várias telas usam: preferências, categorias, tarefas e o menu.
// Cada dado é salvo com o e-mail de quem está logado (veja chaveDoUsuario).
const OpcoesContext = createContext(null);

// Valores de quando nada foi salvo. "Apagar dados salvos" volta para eles.
const INICIAL = {
  nome: '',
  tema: 'automatico',
  primeiroDia: 'domingo',
  formatoHora: '24h',
  avisos: { lembretes: true, resumoDoDia: false, atrasadas: true },
  categorias: [],
  tarefas: [],
};

export function OpcoesProvider({ children }) {
  // Quem está logado (vem do ContaContext). null = ninguém.
  const { emailLogado } = useConta();
  // Nome do perfil. Começa com a parte do e-mail antes do @.
  // Vazio = a tela mostra o texto padrão do Figma.
  const [nomeUsuario, setNomeUsuario] = useState(INICIAL.nome);
  // 'automatico' (segue o relógio), 'dia' ou 'noite'.
  const [modoTema, setModoTema] = useState(INICIAL.tema);
  // Página Data e Hora (nenhuma tela usa ainda).
  // primeiroDiaSemana: 'domingo' ou 'segunda'. formatoHora: '24h' ou '12h'.
  const [primeiroDiaSemana, setPrimeiroDiaSemana] = useState(INICIAL.primeiroDia);
  const [formatoHora, setFormatoHora] = useState(INICIAL.formatoHora);
  // Chaves da página Notificações. É só de mostra: não envia nenhum aviso.
  const [avisosDemo, setAvisosDemo] = useState(INICIAL.avisos);
  // Categorias criadas pelo usuário (além das três fixas). No máximo três.
  const [categoriasNovas, setCategoriasNovas] = useState(INICIAL.categorias);
  // Cada tarefa: { id, titulo, categoriaId, data, concluida, excluida }
  // - data: 'AAAA-MM-DD', igual ao calendário.
  // - excluida: a tarefa vai para a lixeira (Tarefas Excluídas) em vez de sumir.
  const [tarefas, setTarefas] = useState(INICIAL.tarefas);
  // Dia tocado no Calendário ('AAAA-MM-DD'). Fica aqui porque o calendário, a
  // lista de tarefas e o botão + usam. Não é salvo: ao abrir o app, volta para hoje.
  const [diaSelecionado, setDiaSelecionado] = useState(dataDeHoje);
  const [menuAberto, setMenuAberto] = useState(false);
  // Ref da área atrás do vidro de Configurações (o desfoque precisa dela).
  // O menu e o vidro deslizam com estes valores: 0 = aberto, 1 = fora da tela.
  // A função no useState cria cada Animated.Value uma vez só.
  const alvoDesfoque = useRef(null);
  const [deslizeMenu] = useState(function () {
    return new Animated.Value(1);
  });
  const [deslizeConfig] = useState(function () {
    return new Animated.Value(1);
  });
  // Deslize entre a página inicial e o Calendário (aula 02, Animated).
  // 0 = página inicial na tela, 1 = Calendário na tela.
  // As duas páginas usam o mesmo valor, então andam juntas.
  const [deslizeAba] = useState(function () {
    return new Animated.Value(0);
  });
  // Página principal aberta por baixo das opções: '/' ou '/calendario'.
  // É useRef porque nenhuma tela mostra esse valor; ele só é lido na hora de voltar.
  const rotaPrincipal = useRef('/');

  // Carrega o que a pessoa logada salvou.
  // Diferente da aula 05, a lista é [emailLogado]: roda ao abrir o app e de novo
  // toda vez que alguém entra, sai ou troca de conta.
  useEffect(
    function () {
      // Ninguém logado: não tem o que carregar.
      if (emailLogado === null) return;

      // Usa o valor salvo ou o inicial, para nada da conta anterior ficar para trás.
      function salvoOuInicial(valor, inicial) {
        return valor !== null ? valor : inicial;
      }

      async function carregarTudo() {
        try {
          const nome = await carregar(chaveDoUsuario(emailLogado, 'nome'));
          setNomeUsuario(salvoOuInicial(nome, INICIAL.nome));
          const tema = await carregar(chaveDoUsuario(emailLogado, 'tema'));
          setModoTema(salvoOuInicial(tema, INICIAL.tema));
          const primeiroDia = await carregar(chaveDoUsuario(emailLogado, 'primeiroDia'));
          setPrimeiroDiaSemana(salvoOuInicial(primeiroDia, INICIAL.primeiroDia));
          const hora = await carregar(chaveDoUsuario(emailLogado, 'formatoHora'));
          setFormatoHora(salvoOuInicial(hora, INICIAL.formatoHora));
          const avisos = await carregar(chaveDoUsuario(emailLogado, 'avisos'));
          setAvisosDemo(salvoOuInicial(avisos, INICIAL.avisos));
          const novas = await carregar(chaveDoUsuario(emailLogado, 'categorias'));
          // Categoria salva só como texto vira { id, nome }.
          setCategoriasNovas(
            salvoOuInicial(novas, INICIAL.categorias).map(function (categoria, indice) {
              if (typeof categoria === 'string') {
                return { id: 'antiga-' + indice, nome: categoria };
              }
              return categoria;
            })
          );
          const tarefasSalvas = await carregar(chaveDoUsuario(emailLogado, 'tarefas'));
          setTarefas(salvoOuInicial(tarefasSalvas, INICIAL.tarefas));
        } catch (erro) {
          console.warn('Não foi possível carregar os dados salvos', erro);
        }
      }
      carregarTudo();
    },
    [emailLogado]
  );

  // Salva um dado na chave do usuário logado. Sem ninguém logado, não salva.
  function salvarDoUsuario(campo, valor) {
    if (emailLogado === null) return;
    salvar(chaveDoUsuario(emailLogado, campo), valor);
  }

  const categorias = CATEGORIAS_FIXAS.concat(categoriasNovas);
  // Tarefas fora da lixeira. É calculado a partir de `tarefas` (aula 05), e não
  // guardado em outro estado, então nunca fica desatualizado.
  const tarefasAtivas = tarefas.filter(function (tarefa) {
    return !tarefa.excluida;
  });

  // As funções de alterar seguem a aula 05: monta o valor novo, atualiza o
  // estado e salva.
  function mudarNome(novo) {
    setNomeUsuario(novo);
    salvarDoUsuario('nome', novo);
  }

  function escolherTema(novo) {
    setModoTema(novo);
    salvarDoUsuario('tema', novo);
  }

  function escolherPrimeiroDia(novo) {
    setPrimeiroDiaSemana(novo);
    salvarDoUsuario('primeiroDia', novo);
  }

  function escolherFormatoHora(novo) {
    setFormatoHora(novo);
    salvarDoUsuario('formatoHora', novo);
  }

  function alternarAviso(chave) {
    // Copia o objeto e troca só a chave tocada, sem mexer no antigo.
    const novos = { ...avisosDemo, [chave]: !avisosDemo[chave] };
    setAvisosDemo(novos);
    salvarDoUsuario('avisos', novos);
  }

  function adicionarCategoria(nome) {
    // O id usa a hora em milissegundos, como na aula 03.
    const nova = { id: Date.now().toString(), nome: nome };
    const novas = categoriasNovas.concat([nova]);
    setCategoriasNovas(novas);
    salvarDoUsuario('categorias', novas);
  }

  // Só as categorias criadas pelo usuário podem ser excluídas.
  function excluirCategoria(id) {
    const novas = categoriasNovas.filter(function (categoria) {
      return categoria.id !== id;
    });
    setCategoriasNovas(novas);
    salvarDoUsuario('categorias', novas);
  }

  function buscarCategoriaPorId(id) {
    return categorias.find(function (categoria) {
      return categoria.id === id;
    });
  }

  // ---------------------------------------------------------------------------
  // TAREFAS (aulas 02 e 05). Todas montam uma lista nova (concat, map ou filter
  // não mexem na antiga) e passam para salvarTarefas, que atualiza a tela e salva.
  // Salvamos `novaLista` porque `tarefas` só muda no próximo desenho.
  // ---------------------------------------------------------------------------
  function salvarTarefas(novaLista) {
    setTarefas(novaLista);
    salvarDoUsuario('tarefas', novaLista);
  }

  function adicionarTarefa(titulo, categoriaId, data) {
    const nova = {
      id: Date.now().toString(),
      titulo: titulo,
      categoriaId: categoriaId,
      data: data,
      concluida: false,
      excluida: false,
    };
    salvarTarefas(tarefas.concat([nova]));
  }

  // map devolve a lista inteira; só a tarefa tocada troca o `concluida`.
  function alternarConcluida(id) {
    salvarTarefas(
      tarefas.map(function (tarefa) {
        return tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa;
      })
    );
  }

  // Excluir só marca a tarefa: ela vai para Tarefas Excluídas.
  function excluirTarefa(id) {
    salvarTarefas(
      tarefas.map(function (tarefa) {
        return tarefa.id === id ? { ...tarefa, excluida: true } : tarefa;
      })
    );
  }

  function restaurarTarefa(id) {
    salvarTarefas(
      tarefas.map(function (tarefa) {
        return tarefa.id === id ? { ...tarefa, excluida: false } : tarefa;
      })
    );
  }

  // Apagar de vez: filter devolve a lista SEM a tarefa desse id.
  function apagarTarefa(id) {
    salvarTarefas(
      tarefas.filter(function (tarefa) {
        return tarefa.id !== id;
      })
    );
  }

  function buscarTarefaPorId(id) {
    return tarefas.find(function (tarefa) {
      return tarefa.id === id;
    });
  }

  // Abre as opções. Se o menu está aberto, ele sai primeiro e só depois o vidro entra.
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

  // Fecha as opções: primeiro o vidro sai, depois o menu abre e volta para a
  // página principal certa ('/' ou '/calendario').
  // `depois` é opcional. O typeof existe porque o onPress manda o evento aqui.
  function voltarAoMenu(depois) {
    animarPainel(deslizeConfig, 1, function () {
      setMenuAberto(true);
      router.dismissTo(rotaPrincipal.current);
      if (typeof depois === 'function') depois();
    });
  }

  // Desliza o Calendário para dentro (0 -> 1). A PaginaCalendario chama ao abrir.
  function entrarNoCalendario() {
    rotaPrincipal.current = '/calendario';
    animarPainel(deslizeAba, 1);
  }

  // A PaginaCalendario chama quando fecha, até sem animação (botão voltar do
  // Android). Deixa tudo pronto para a próxima vez.
  function sairDoCalendario() {
    deslizeAba.setValue(0);
    rotaPrincipal.current = '/';
  }

  // Volta para a página inicial. A ordem importa: primeiro as páginas deslizam,
  // só depois a rota /calendario sai. Senão o Calendário some sem deslizar.
  function voltarAoInicio() {
    animarPainel(deslizeAba, 0, function () {
      router.dismissTo('/');
    });
  }

  // Apaga os dados do usuário logado e volta tudo ao início.
  // A pessoa continua logada, só que com os dados zerados.
  async function apagarDadosSalvos() {
    try {
      if (emailLogado !== null) {
        for (const campo of CAMPOS_DO_USUARIO) {
          await AsyncStorage.removeItem(chaveDoUsuario(emailLogado, campo));
        }
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
    setTarefas(INICIAL.tarefas);
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
        tarefas,
        tarefasAtivas,
        adicionarTarefa,
        alternarConcluida,
        excluirTarefa,
        restaurarTarefa,
        apagarTarefa,
        buscarTarefaPorId,
        diaSelecionado,
        setDiaSelecionado,
        apagarDadosSalvos,
        menuAberto,
        setMenuAberto,
        entrarNasOpcoes,
        voltarAoMenu,
        entrarNoCalendario,
        sairDoCalendario,
        voltarAoInicio,
        alvoDesfoque,
        deslizeMenu,
        deslizeConfig,
        deslizeAba,
      }}
    >
      {children}
    </OpcoesContext.Provider>
  );
}

// Atalho para as telas lerem o Context. Dá um erro claro se a tela estiver fora do Provider.
export function useOpcoes() {
  const contexto = useContext(OpcoesContext);
  if (!contexto) {
    throw new Error('useOpcoes precisa ser usado dentro de OpcoesProvider.');
  }
  return contexto;
}
