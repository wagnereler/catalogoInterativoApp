// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from '@/src/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login */}
        <Stack.Screen name="index" />

        {/* Grupo /products (filhos ficam no app/products/_layout.tsx) */}
        <Stack.Screen name="products" />
      </Stack>
    </Provider>
  );
}
