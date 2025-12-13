// src/components/AppMenu.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { setSelectedProduct } from '../store/slices/productsSlice';
import { setThemeMode, ThemeMode } from '../store/slices/themeSlice';

export function AppMenu() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const handleTheme = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
    setOpen(false);
  };

  const handleLogoff = () => {
    dispatch(setSelectedProduct(null));
    dispatch(logout());
    setOpen(false);
    router.replace('/');
  };

  const themeLabel = useMemo(() => {
    if (themeMode === 'light') return 'Claro';
    if (themeMode === 'dark') return 'Escuro';
    return 'Sistema';
  }, [themeMode]);

  return (
    <>
      {/* Botão sanduíche */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.button}
        accessibilityLabel="Menu">
        <Text style={styles.icon}>☰</Text>
      </TouchableOpacity>

      {/* Menu */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.menu} onPress={() => {}}>
            <Text style={styles.title}>Menu</Text>

            <Text style={styles.section}>Tema</Text>

            <View style={styles.chipRow}>
              <Text style={styles.chipLabel}>Atual:</Text>
              <Text style={styles.chipValue}>{themeLabel}</Text>
            </View>

            <TouchableOpacity style={styles.item} onPress={() => handleTheme('light')}>
              <Text style={styles.itemText}>☀️ Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleTheme('dark')}>
              <Text style={styles.itemText}>🌙 Escuro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleTheme('system')}>
              <Text style={styles.itemText}>🖥️ Sistema</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.item} onPress={handleLogoff}>
              <Text style={styles.itemTextDanger}>Sair (Logoff)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.close} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 22,
    color: '#0f172a',
    fontWeight: '800',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 12,
  },
  menu: {
    width: 240,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  title: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  chipLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  chipValue: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: '800',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    marginBottom: 8,
  },
  itemText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  itemTextDanger: {
    color: '#fca5a5',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 8,
  },
  close: {
    marginTop: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#a5b4fc',
    fontWeight: '700',
  },
});
