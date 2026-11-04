import { View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import { estilosConfig } from '../configuracoes/estilosConfig';
import ListaTarefas from './ListaTarefas';

// Página de Tarefas Concluídas ou Excluídas. Título, lista e ações chegam por props.
export default function PaginaTarefas({ titulo, tarefas, mensagemVazia, acoes, aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo={titulo} aoVoltar={aoVoltar} rotuloVoltar="Voltar ao menu" />
      <ListaTarefas tarefas={tarefas} mensagemVazia={mensagemVazia} acoes={acoes} />
    </View>
  );
}
