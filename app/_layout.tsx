import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas séries' }} />
      <Stack.Screen name="form" options={{ title: 'Nova série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes da série' }} />
    </Stack>
  );
}
