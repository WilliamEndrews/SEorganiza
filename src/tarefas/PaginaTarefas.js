import { View } from 'react-native';

import CabecalhoPagina from '../componentes/CabecalhoPagina';
import { estilosConfig } from '../configuracoes/estilosConfig';
import ListaTarefas from './ListaTarefas';

// Página de Tarefas Concluídas ou Excluídas: o título e a lista chegam por props.
export default function PaginaTarefas({ titulo, tarefas, mensagemVazia, aoVoltar }) {
  return (
    <View style={estilosConfig.configMiolo}>
      <CabecalhoPagina titulo={titulo} aoVoltar={aoVoltar} rotuloVoltar="Voltar ao menu" />
      <ListaTarefas tarefas={tarefas} mensagemVazia={mensagemVazia} />
    </View>
  );
}
