// app/_layout.tsx
import { Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import { store } from '@/src/store';
import { login } from '@/src/store/slices/authSlice';
import { loadUser } from '@/src/utils/sessionStorage';

function Bootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const user = await loadUser();

        if (!alive) return;

        if (user) {
          dispatch(login(user));

          // Se já tem sessão salva, pula a tela de login
          router.replace('/products');
        }
      } catch {
        // Se der erro no AsyncStorage, apenas ignora e segue pro login
      }
    })();

    return () => {
      alive = false;
    };
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Bootstrap />

      <Stack screenOptions={{ headerShown: false }}>
        {/* Login */}
        <Stack.Screen name="index" />

        {/* Grupo /products (filhos ficam no app/products/_layout.tsx) */}
        <Stack.Screen name="products" />
      </Stack>
    </Provider>
  );
}
