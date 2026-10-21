
declare module '*.png' {
  // No React Native, require de uma imagem devolve um número (o id dela no pacote).
  const imagem: number;
  export = imagem;
}
