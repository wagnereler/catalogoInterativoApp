import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';

import { Colors } from '../constants/colors';
import { AppMenu } from '../src/components/AppMenu';
import { store } from '../src/store';

// OBS: seus hooks estão fora de src, então o import é a partir de /hooks
import { useAppTheme } from '../hooks/use-app-theme';

function ThemedStack() {
  const theme = useAppTheme(); // 'light' | 'dark'

  return (
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors[theme].surface },
          headerTintColor: Colors[theme].text,
          contentStyle: { backgroundColor: Colors[theme].background }, // garante fundo consistente nas telas
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="products/index"
          options={{
            title: 'Catálogo',
            headerRight: () => <AppMenu />,
          }}
        />

        <Stack.Screen
          name="products/details"
          options={{
            title: 'Detalhes do Produto',
            headerRight: () => <AppMenu />,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemedStack />
    </Provider>
  );
}
