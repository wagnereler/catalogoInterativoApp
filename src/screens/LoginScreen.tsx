// src/screens/LoginScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha nome e e-mail.');
      return;
    }

    // Aqui poderíamos validar formato de e-mail, etc.
    dispatch(login({ name: name.trim(), email: email.trim() }));
    router.replace('/products'); // navega para a tela de lista de produtos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo Interativo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: '#f9fafb',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1f2933',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#f9fafb',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
