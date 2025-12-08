// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="products/index" options={{ title: 'Catálogo' }} />
        <Stack.Screen name="products/details" options={{ title: 'Detalhes do Produto' }} />
      </Stack>
    </Provider>
  );
}
