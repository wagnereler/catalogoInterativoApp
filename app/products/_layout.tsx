// app/products/_layout.tsx
import { AppMenu } from '@/src/components/AppMenu';
import { Colors } from '@/src/constants/colors';
import { useAppTheme } from '@/src/hooks/use-app-theme';
import { Stack } from 'expo-router';
import React from 'react';

export default function ProductsLayout() {
  const theme = useAppTheme();
  const C = Colors[theme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.surface },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '800' },
        headerRight: () => <AppMenu />,
      }}
    >
      {/* /products */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Catálogo',
        }}
      />

      {/* /products/details?id=123 */}
      <Stack.Screen
        name="details"
        options={{
          title: 'Detalhes do Produto',
        }}
      />
    </Stack>
  );
}
