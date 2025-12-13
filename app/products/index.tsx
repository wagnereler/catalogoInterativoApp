// app/products/index.tsx
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { fetchProductsByCategory } from '@/src/services/products';
import { Product, setSelectedProduct } from '@/src/store/slices/productsSlice';

// Tema (obs: seus hooks ficam fora de src)

import { useAppTheme } from '@/hooks/use-app-theme';
import { Colors } from '@/src/constants/colors';

type CategoryConfig = {
  key: string;
  label: string;
  description: string;
};

const CATEGORIES: CategoryConfig[] = [
  { key: 'mens-shirts', label: 'Masculino', description: 'Peças clássicas para eles' },
  { key: 'womens-dresses', label: 'Feminino', description: 'Tendências e vestidos leves' },
];

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const theme = useAppTheme(); // 'light' | 'dark'
  const C = Colors[theme];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        CATEGORIES.map(async (category) => {
          const products = await fetchProductsByCategory(category.key);
          return [category.key, products] as const;
        })
      );

      const mapped = results.reduce<Record<string, Product[]>>((acc, [key, products]) => {
        acc[key] = products;
        return acc;
      }, {});

      setProductsByCategory(mapped);
    } catch {
      setError('Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categoriesWithData = useMemo(
    () => CATEGORIES.filter((category) => productsByCategory[category.key]?.length),
    [productsByCategory]
  );

  const handleOpenDetails = (product: Product) => {
    dispatch(setSelectedProduct(product));
    router.push({ pathname: '/products/details', params: { id: String(product.id) } });
  };

  const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;

  if (loading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.helperText, { color: C.subtitle }]}>Carregando catálogo...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: C.background }]}>
        <Text style={[styles.errorText, { color: C.danger }]}>{error}</Text>

        <TouchableOpacity
          style={[
            styles.button,
            styles.retryButton,
            { borderColor: C.primary, backgroundColor: C.surface },
          ]}
          onPress={loadProducts}>
          <Text style={[styles.buttonText, { color: C.primary }]}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: C.text }]}>Catálogo por categoria</Text>
        <Text style={[styles.subtitle, { color: C.subtitle }]}>
          Selecione um item para ver os detalhes
        </Text>

        {categoriesWithData.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: C.surface }]}>
            <Text style={[styles.errorText, { color: C.danger }]}>Nenhum produto encontrado.</Text>
            <TouchableOpacity
              style={[
                styles.button,
                styles.retryButton,
                { borderColor: C.primary, backgroundColor: C.surface },
              ]}
              onPress={loadProducts}>
              <Text style={[styles.buttonText, { color: C.primary }]}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {categoriesWithData.map((category) => (
          <View key={category.key} style={[styles.section, { backgroundColor: C.surface }]}>
            <View style={styles.sectionHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>{category.label}</Text>
                <Text style={[styles.sectionDescription, { color: C.subtitle }]}>
                  {category.description}
                </Text>
              </View>
              <Text style={[styles.sectionCount, { color: C.subtitle }]}>
                {productsByCategory[category.key]?.length ?? 0} itens
              </Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={productsByCategory[category.key]}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: C.surface }]}
                  onPress={() => handleOpenDetails(item)}
                  activeOpacity={0.85}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={[styles.cardImage, { backgroundColor: C.background }]}
                    resizeMode="contain"
                  />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={[styles.cardPrice, { color: C.primary }]}>
                      {formatPrice(item.price)}
                    </Text>
                    {item.discountPercentage ? (
                      <Text style={[styles.cardDiscount, { color: C.subtitle }]}>
                        -{item.discountPercentage.toFixed(0)}% off
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              ListFooterComponent={() => <View style={{ width: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },

  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { marginBottom: 8 },

  section: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 8, gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionDescription: { fontSize: 14 },
  sectionCount: { fontWeight: '600', fontSize: 12 },

  card: { width: 180, borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 10, gap: 4 },
  cardTitle: { fontWeight: '600', fontSize: 14 },
  cardPrice: { fontWeight: '700', fontSize: 15 },
  cardDiscount: { fontWeight: '600', fontSize: 12 },

  button: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  retryButton: { borderWidth: 1 },
  buttonText: { fontWeight: '700', fontSize: 15 },

  helperText: { marginTop: 8 },
  errorText: { textAlign: 'center', fontSize: 16 },

  emptyState: { borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 },
});
