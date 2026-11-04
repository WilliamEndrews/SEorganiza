import TelaInicial from '../../inicio/TelaInicial';

// Rota "/": a página inicial.
// Os parênteses de (principal) não entram no endereço. O grupo só serve para
// juntar as rotas com o mesmo _layout.js.
export default function RotaInicial() {
  return <TelaInicial />;
}
