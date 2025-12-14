// src/screens/LoginScreen.tsx

import { Colors } from '@/src/constants/colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../hooks/use-app-theme';
import { login } from '../store/slices/authSlice';


export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();

  const theme = useAppTheme();
  const C = Colors[theme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha nome e e-mail.');
      return;
    }

    dispatch(login({ name: name.trim(), email: email.trim() }));
    router.replace('/products');
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <Text style={[styles.title, { color: C.text }]}>Catálogo Interativo</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: C.surface,
            color: C.text,
            borderColor: C.subtitle,
          },
        ]}
        placeholder="Nome"
        placeholderTextColor={C.subtitle}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: C.surface,
            color: C.text,
            borderColor: C.subtitle,
          },
        ]}
        placeholder="E-mail"
        placeholderTextColor={C.subtitle}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: C.primary }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: C.background }]}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },

  title: { fontSize: 24, marginBottom: 24, fontWeight: 'bold' },

  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },

  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: { fontWeight: 'bold', fontSize: 16 },
});
