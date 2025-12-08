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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { fetchProductById } from '@/src/services/products';
import { Product } from '@/src/store/slices/productsSlice';
import { RootState } from '@/src/store';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const cachedProduct = useSelector((state: RootState) => state.products.selectedProduct);

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
        if (isMounted) {
          setProduct(fetched);
        }
      } catch (err) {
        if (isMounted) {
          setError('Não foi possível carregar os detalhes agora.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
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
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.helperText}>Carregando detalhes...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Produto não encontrado.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.thumbnail }} style={styles.heroImage} />

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.category}>{product.category ?? 'Categoria'}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>

        {product.discountPercentage ? (
          <Text style={styles.discount}>-{product.discountPercentage.toFixed(0)}% de desconto</Text>
        ) : null}

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Marca</Text>
            <Text style={styles.metaValue}>{product.brand ?? 'N/D'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Avaliação</Text>
            <Text style={styles.metaValue}>{product.rating ?? '—'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Estoque</Text>
            <Text style={styles.metaValue}>{product.stock ?? '—'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar ao catálogo</Text>
        </TouchableOpacity>
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
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  title: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  category: {
    color: '#a5b4fc',
    marginTop: 4,
    fontSize: 14,
  },
  price: {
    color: '#22c55e',
    fontWeight: '800',
    fontSize: 20,
  },
  discount: {
    color: '#fb923c',
    fontWeight: '700',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  description: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metaItem: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
  },
  metaLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 14,
  },
  backButton: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  backText: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 15,
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
});
