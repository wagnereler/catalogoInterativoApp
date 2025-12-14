// src/components/AppMenu.tsx
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/hooks/use-app-theme';
import { RootState } from '@/src/store';
import { logout } from '@/src/store/slices/authSlice';
import { setSelectedProduct } from '@/src/store/slices/productsSlice';
import { setThemeMode } from '@/src/store/slices/themeSlice';

type ThemeMode = 'light' | 'dark' | 'system';

export function AppMenu() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const theme = useAppTheme();
  const C = Colors[theme];

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const themeLabel = useMemo(() => {
    if (themeMode === 'light') return 'Claro';
    if (themeMode === 'dark') return 'Escuro';
    return 'Sistema';
  }, [themeMode]);

  const closeMenu = () => setOpen(false);

  const handleTheme = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
    closeMenu();
  };

  const handleLogoff = () => {
    dispatch(setSelectedProduct(null));
    dispatch(logout());
    closeMenu();
    router.replace('/');
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.button}
        accessibilityLabel="Menu"
        hitSlop={10}
      >
        <Text style={[styles.icon, { color: C.text }]}>☰</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent={false}
        onRequestClose={closeMenu}
      >
        <View style={styles.overlay}>
          <Pressable
            style={[
              styles.backdrop,
              {
                backgroundColor:
                  theme === 'dark'
                    ? 'rgba(0,0,0,0.85)'
                    : 'rgba(0,0,0,0.55)',
              },
            ]}
            onPress={closeMenu}
          />

          <View
            style={[
              styles.menu,
              {
                backgroundColor: C.surface,
                borderColor: C.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: C.text }]}>Menu</Text>

            <View style={styles.sectionRow}>
              <Text style={[styles.section, { color: C.subtitle }]}>Tema</Text>
              <View style={[styles.pill, { backgroundColor: C.badgeBg }]}>
                <Text style={[styles.pillText, { color: C.badgeText }]}>
                  Atual: {themeLabel}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.item, { backgroundColor: C.background, borderColor: C.border }]}
              onPress={() => handleTheme('light')}
            >
              <Text style={[styles.itemText, { color: C.text }]}>☀️ Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.item, { backgroundColor: C.background, borderColor: C.border }]}
              onPress={() => handleTheme('dark')}
            >
              <Text style={[styles.itemText, { color: C.text }]}>🌙 Escuro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.item, { backgroundColor: C.background, borderColor: C.border }]}
              onPress={() => handleTheme('system')}
            >
              <Text style={[styles.itemText, { color: C.text }]}>🖥️ Sistema</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: C.border }]} />

            <TouchableOpacity
              style={[styles.itemDanger, { backgroundColor: C.background, borderColor: C.danger }]}
              onPress={handleLogoff}
            >
              <Text style={[styles.itemTextDanger, { color: C.danger }]}>
                🚪 Sair (Logoff)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.close} onPress={closeMenu}>
              <Text style={[styles.closeText, { color: C.primary }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontWeight: '900',
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 12,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  menu: {
    width: 260,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },

  title: {
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 10,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 10,
  },
  section: {
    fontWeight: '800',
    fontSize: 12,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '900',
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  itemText: {
    fontWeight: '800',
  },

  divider: {
    height: 1,
    marginTop: 12,
    marginBottom: 4,
  },

  itemDanger: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  itemTextDanger: {
    fontWeight: '900',
  },

  close: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    fontWeight: '900',
    fontSize: 14,
  },
});
