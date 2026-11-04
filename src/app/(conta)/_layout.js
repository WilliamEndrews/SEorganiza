import { Stack } from 'expo-router';

// Telas "/login" e "/cadastro". Só aparecem para quem não está logado
// (o Stack.Protected do layout raiz cuida disso).
export default function LayoutConta() {
  return <Stack id={undefined} screenOptions={{ headerShown: false }} />;
}
