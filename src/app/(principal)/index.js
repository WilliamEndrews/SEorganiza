import TelaInicial from '../../inicio/TelaInicial';

// Rota "/": a página inicial 

// organizar as rotas e dar a elas um _layout.js em comum. Por isso este arquivo
// continua respondendo pelo endereço "/", como quando ficava em src/app/index.js.
export default function RotaInicial() {
  return <TelaInicial />;
}
