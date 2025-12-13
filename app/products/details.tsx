// app/products/details.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { useAppTheme } from '@/hooks/use-app-theme';
import { Colors } from '@/src/constants/colors';
import { fetchProductById } from '@/src/services/products';
import { RootState } from '@/src/store';
import { Product } from '@/src/store/slices/productsSlice';


export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const cachedProduct = useSelector((state: RootState) => state.products.selectedProduct);

  const theme = useAppTheme();
  const C = Colors[theme];

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cachedMatchesParam = useMemo(
    () => cachedProduct && id && String(cachedProduct.id) === String(id),
    [cachedProduct, id]
  );

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setError('Produto não encontrado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (cachedMatchesParam) {
          setProduct(cachedProduct);
          return;
        }

        const fetched = await fetchProductById(id);
        if (isMounted) setProduct(fetched);
      } catch {
        if (isMounted) setError('Não foi possível carregar os detalhes agora.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [cachedMatchesParam, cachedProduct, id]);

  const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;

  if (loading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.helperText, { color: C.subtitle }]}>Carregando detalhes...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: C.background }]}>
        <Text style={[styles.errorText, { color: C.danger }]}>
          {error ?? 'Produto não encontrado.'}
        </Text>

        <TouchableOpacity
          style={[styles.backButton, { borderColor: C.primary, backgroundColor: C.surface }]}
          onPress={() => router.back()}>
          <Text style={[styles.backText, { color: C.primary }]}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: product.thumbnail }}
          style={[styles.heroImage, { backgroundColor: C.surface }]}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: C.text }]}>{product.title}</Text>
            <Text style={[styles.category, { color: C.subtitle }]}>
              {product.category ?? 'Categoria'}
            </Text>
          </View>
          <Text style={[styles.price, { color: C.primary }]}>{formatPrice(product.price)}</Text>
        </View>

        {product.discountPercentage ? (
          <Text style={[styles.discount, { color: C.subtitle }]}>
            -{product.discountPercentage.toFixed(0)}% de desconto
          </Text>
        ) : null}

        <Text style={[styles.description, { color: C.text }]}>{product.description}</Text>

        <View style={[styles.metaRow]}>
          <View style={[styles.metaItem, { backgroundColor: C.surface }]}>
            <Text style={[styles.metaLabel, { color: C.subtitle }]}>Marca</Text>
            <Text style={[styles.metaValue, { color: C.text }]}>{product.brand ?? 'N/D'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: C.surface }]}>
            <Text style={[styles.metaLabel, { color: C.subtitle }]}>Avaliação</Text>
            <Text style={[styles.metaValue, { color: C.text }]}>{product.rating ?? '—'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: C.surface }]}>
            <Text style={[styles.metaLabel, { color: C.subtitle }]}>Estoque</Text>
            <Text style={[styles.metaValue, { color: C.text }]}>{product.stock ?? '—'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.backButton, { borderColor: C.primary, backgroundColor: C.surface }]}
          onPress={() => router.back()}>
          <Text style={[styles.backText, { color: C.primary }]}>Voltar ao catálogo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 24 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },

  heroImage: { width: '100%', height: 280 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'flex-start',
  },

  title: { fontSize: 22, fontWeight: '800' },
  category: { marginTop: 4, fontSize: 14 },
  price: { fontWeight: '800', fontSize: 20 },

  discount: { fontWeight: '700', marginTop: 6, paddingHorizontal: 16 },

  description: { fontSize: 15, lineHeight: 22, marginTop: 12, paddingHorizontal: 16 },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metaItem: { flex: 1, borderRadius: 10, padding: 12 },
  metaLabel: { fontSize: 12, marginBottom: 4, fontWeight: '700' },
  metaValue: { fontWeight: '700', fontSize: 14 },

  backButton: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backText: { fontWeight: '700', fontSize: 15 },

  helperText: { marginTop: 8 },
  errorText: { textAlign: 'center', fontSize: 16 },
});
