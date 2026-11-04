import FormularioConta from '../../conta/FormularioConta';
import { useConta } from '../../contexto/ContaContext';

// Tela "/cadastro" (Figma: "iPhone 14 Plus - 10"). Quem se cadastra já entra
// direto no app.
export default function TelaCadastro() {
  const { cadastrar } = useConta();

  // Senha com no mínimo 6 caracteres (o Figma não define).
  return (
    <FormularioConta
      rotuloEmail="Seu email:"
      rotuloSenha="Sua senha:"
      textoBotao="cadastre-se"
      senhaMinima={6}
      aoEnviar={cadastrar}
    />
  );
}
