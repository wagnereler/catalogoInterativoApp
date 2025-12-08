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
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

import { fetchProductsByCategory } from '@/src/services/products';
import { Product, setSelectedProduct } from '@/src/store/slices/productsSlice';

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
    } catch (err) {
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
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.helperText}>Carregando catálogo...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadProducts}>
          <Text style={[styles.buttonText, styles.retryText]}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Catálogo por categoria</Text>
        <Text style={styles.subtitle}>Selecione um item para ver os detalhes</Text>

        {categoriesWithData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>Nenhum produto encontrado.</Text>
            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadProducts}>
              <Text style={[styles.buttonText, styles.retryText]}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {categoriesWithData.map((category) => (
          <View key={category.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{category.label}</Text>
                <Text style={styles.sectionDescription}>{category.description}</Text>
              </View>
              <Text style={styles.sectionCount}>
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
                  style={styles.card}
                  onPress={() => handleOpenDetails(item)}
                  activeOpacity={0.85}>
                  <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
                    {item.discountPercentage ? (
                      <Text style={styles.cardDiscount}>
                        -{item.discountPercentage.toFixed(0)}% off
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              ListFooterComponent={<View style={{ width: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDescription: {
    color: '#94a3b8',
    fontSize: 14,
  },
  sectionCount: {
    color: '#a5b4fc',
    fontWeight: '600',
    fontSize: 12,
  },
  card: {
    width: 180,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#0f172a',
  },
  cardContent: {
    padding: 10,
    gap: 4,
  },
  cardTitle: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 14,
  },
  cardPrice: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 15,
  },
  cardDiscount: {
    color: '#fb923c',
    fontWeight: '600',
    fontSize: 12,
  },
  button: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  retryText: {
    color: '#22c55e',
  },
  helperText: {
    color: '#cbd5e1',
    marginTop: 8,
  },
  errorText: {
    color: '#fca5a5',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
});
