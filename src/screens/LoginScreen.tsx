// src/screens/LoginScreen.tsx
import { Colors } from '@/src/constants/colors';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useAppTheme } from '@/src/hooks/use-app-theme';
import { login } from '@/src/store/slices/authSlice';
import { saveUser } from '@/src/utils/sessionStorage';

/**
 * Validação simples e suficiente para formulário
 */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

function normalizeName(name: string) {
  return name.replace(/\s+/g, ' ').trim();
}

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();

  const theme = useAppTheme();
  const C = Colors[theme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });

  const nameNormalized = useMemo(() => normalizeName(name), [name]);
  const emailNormalized = useMemo(() => email.trim(), [email]);

  /**
   * Regras de validação
   */
  const errors = useMemo(() => {
    const e: { name?: string; email?: string } = {};

    if (!nameNormalized) {
      e.name = 'Informe seu nome.';
    } else if (nameNormalized.length < 2) {
      e.name = 'Nome muito curto.';
    }

    if (!emailNormalized) {
      e.email = 'Informe seu e-mail.';
    } else if (!isValidEmail(emailNormalized)) {
      e.email = 'E-mail inválido.';
    }

    return e;
  }, [nameNormalized, emailNormalized]);

  const isFormValid = useMemo(
    () => !errors.name && !errors.email,
    [errors]
  );

  const handleLogin = async () => {
    if (!isFormValid) return;

    const user = {
      name: nameNormalized,
      email: emailNormalized,
    };

    dispatch(login(user));
    await saveUser(user);

    router.replace('/products');
  };

  const showNameError = touched.name && !!errors.name;
  const showEmailError = touched.email && !!errors.email;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <Text style={[styles.title, { color: C.text }]}>Catálogo Interativo</Text>

      {/* Campo Nome */}
      <View style={styles.field}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: C.surface,
              color: C.text,
              borderColor: showNameError ? C.danger : C.border,
            },
          ]}
          placeholder="Nome"
          placeholderTextColor={C.subtitle}
          value={name}
          onChangeText={setName}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          autoCapitalize="words"
        />
        {showNameError ? (
          <Text style={[styles.errorText, { color: C.danger }]}>
            {errors.name}
          </Text>
        ) : null}
      </View>

      {/* Campo Email */}
      <View style={styles.field}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: C.surface,
              color: C.text,
              borderColor: showEmailError ? C.danger : C.border,
            },
          ]}
          placeholder="E-mail"
          placeholderTextColor={C.subtitle}
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {showEmailError ? (
          <Text style={[styles.errorText, { color: C.danger }]}>
            {errors.email}
          </Text>
        ) : null}
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isFormValid ? C.primary : C.border,
            opacity: isFormValid ? 1 : 0.8,
          },
        ]}
        disabled={!isFormValid}
        onPress={handleLogin}
        activeOpacity={0.85}
      >
        <Text style={[styles.buttonText, { color: C.background }]}>
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },

  field: {
    width: '100%',
    marginBottom: 12,
  },

  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },

  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
