// app/products/index.tsx
import { Colors } from '@/src/constants/colors';
import { useAppTheme } from '@/src/hooks/use-app-theme';
import { fetchProductsByCategory } from '@/src/services/products';
import { Product, setSelectedProduct } from '@/src/store/slices/productsSlice';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

type TabKey = 'masculino' | 'feminino';

type SubCategory = {
  key: string;   // ex: mens-shirts
  label: string; // ex: Camisas
};

const MALE_SUBCATEGORIES: SubCategory[] = [
  { key: 'mens-shirts', label: 'Camisas' },
  { key: 'mens-shoes', label: 'Calçados' },
  { key: 'mens-watches', label: 'Relógios' },
];

const FEMALE_SUBCATEGORIES: SubCategory[] = [
  { key: 'womens-bags', label: 'Bolsas' },
  { key: 'womens-dresses', label: 'Vestidos' },
  { key: 'womens-jewellery', label: 'Joias' },
  { key: 'womens-shoes', label: 'Calçados' },
  { key: 'womens-watches', label: 'Relógios' },
];

type ProductWithSub = Product & { __subCategory: string };

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const theme = useAppTheme();
  const C = Colors[theme];

  const [activeTab, setActiveTab] = useState<TabKey>('masculino');

  // filtro de subcategoria dentro da aba
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [subFilterOpen, setSubFilterOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // guarda produtos carregados por subcategoria
  const [productsBySub, setProductsBySub] = useState<Record<string, Product[]>>({});

  const subcategories = useMemo(() => {
    return activeTab === 'masculino' ? MALE_SUBCATEGORIES : FEMALE_SUBCATEGORIES;
  }, [activeTab]);

  const selectedSubLabel = useMemo(() => {
    if (selectedSub === 'all') return 'Todas';
    return subcategories.find((s) => s.key === selectedSub)?.label ?? 'Todas';
  }, [selectedSub, subcategories]);

  const loadAllSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        subcategories.map(async (sub) => {
          const products = await fetchProductsByCategory(sub.key);
          return [sub.key, products] as const;
        })
      );

      const mapped = results.reduce<Record<string, Product[]>>((acc, [key, products]) => {
        acc[key] = products;
        return acc;
      }, {});

      setProductsBySub(mapped);
    } catch {
      setError('Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [subcategories]);

  useEffect(() => {
    // ao trocar Masculino/Feminino, volta filtro p/ "Todas" e recarrega
    setSelectedSub('all');
    setProductsBySub({});
    loadAllSubcategories();
  }, [activeTab, loadAllSubcategories]);

  const allProducts: ProductWithSub[] = useMemo(() => {
    // “flatten” de todas subcategorias em uma lista única
    const merged: ProductWithSub[] = [];
    for (const sub of subcategories) {
      const list = productsBySub[sub.key] ?? [];
      for (const p of list) {
        merged.push({ ...p, __subCategory: sub.key });
      }
    }
    return merged;
  }, [productsBySub, subcategories]);

  const filteredProducts: ProductWithSub[] = useMemo(() => {
    if (selectedSub === 'all') return allProducts;
    return allProducts.filter((p) => p.__subCategory === selectedSub);
  }, [allProducts, selectedSub]);

  const handleOpenDetails = (product: Product) => {
    dispatch(setSelectedProduct(product));
    router.push({ pathname: '/products/details', params: { id: String(product.id) } });
  };

  const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;

  const subLabelFromKey = (key: string) =>
    subcategories.find((s) => s.key === key)?.label ?? key;

  const renderItem = ({ item }: { item: ProductWithSub }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}
      onPress={() => handleOpenDetails(item)}
      activeOpacity={0.85}>
      <Image
        source={{ uri: item.thumbnail }}
        style={[styles.thumb, { backgroundColor: C.background }]}
        resizeMode="contain"
      />
      <View style={styles.cardInfo}>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={[styles.badge, { backgroundColor: C.badgeBg }]}>
            <Text style={[styles.badgeText, { color: C.badgeText }]}>
              {subLabelFromKey(item.__subCategory)}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardPrice, { color: C.primary }]}>{formatPrice(item.price)}</Text>
        
        {Math.round(item.discountPercentage ?? 0) >= 1 ? (
          <Text style={[styles.cardDiscount, { color: C.subtitle }]}>
            -{Math.round(item.discountPercentage)}% off
          </Text>
        ) : null}


      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Tabs principais */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.text }]}>Produtos</Text>

        <View style={[styles.tabs, { backgroundColor: C.surface, borderColor: C.border }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'masculino' && { backgroundColor: C.primary },
            ]}
            onPress={() => setActiveTab('masculino')}>
            <Text style={[styles.tabText, { color: activeTab === 'masculino' ? C.onPrimary : C.text }]}>
              Masculino
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'feminino' && { backgroundColor: C.primary },
            ]}
            onPress={() => setActiveTab('feminino')}>
            <Text style={[styles.tabText, { color: activeTab === 'feminino' ? C.onPrimary : C.text }]}>
              Feminino
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtro por subcategoria */}
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: C.surface, borderColor: C.border }]}
          onPress={() => setSubFilterOpen(true)}
          activeOpacity={0.85}>
          <Text style={[styles.filterLabel, { color: C.subtitle }]}>Subcategoria</Text>
          <Text style={[styles.filterValue, { color: C.text }]} numberOfLines={1}>
            {selectedSubLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.helperText, { color: C.subtitle }]}>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: C.danger }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: C.primary, backgroundColor: C.surface }]}
            onPress={loadAllSubcategories}>
            <Text style={[styles.retryText, { color: C.primary }]}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: C.subtitle }]}>
              Nenhum produto nessa subcategoria.
            </Text>
          }
        />
      )}

      {/* Modal do filtro */}
      <Modal
        transparent
        visible={subFilterOpen}
        animationType="fade"
        onRequestClose={() => setSubFilterOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSubFilterOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: C.surface, borderColor: C.border }]}
            onPress={() => {}}>
            <Text style={[styles.sheetTitle, { color: C.text }]}>Filtrar por subcategoria</Text>

            <TouchableOpacity
              style={[styles.sheetItem, { backgroundColor: C.background }]}
              onPress={() => {
                setSelectedSub('all');
                setSubFilterOpen(false);
              }}>
              <Text style={[styles.sheetText, { color: C.text }]}>Todas</Text>
            </TouchableOpacity>

            {subcategories.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sheetItem, { backgroundColor: C.background }]}
                onPress={() => {
                  setSelectedSub(s.key);
                  setSubFilterOpen(false);
                }}>
                <Text style={[styles.sheetText, { color: C.text }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.sheetClose} onPress={() => setSubFilterOpen(false)}>
              <Text style={[styles.sheetCloseText, { color: C.primary }]}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  title: { fontSize: 22, fontWeight: '800' },

  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { fontWeight: '800' },

  filterButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterLabel: { fontSize: 12, fontWeight: '700' },
  filterValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  helperText: { marginTop: 8 },
  errorText: { textAlign: 'center', fontSize: 16 },

  retryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: { fontWeight: '800' },

  listContent: { paddingHorizontal: 16, paddingBottom: 24 },

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumb: { width: 92, height: 92 },
  cardInfo: { flex: 1, padding: 10, gap: 6 },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flex: 1, fontWeight: '800', fontSize: 14 },
  cardPrice: { fontWeight: '900', fontSize: 15 },
  cardDiscount: { fontWeight: '700', fontSize: 12 },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '900' },

  emptyText: { paddingHorizontal: 16, paddingTop: 20, textAlign: 'center' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  sheetTitle: { fontWeight: '900', fontSize: 16, marginBottom: 6 },
  sheetItem: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12 },
  sheetText: { fontWeight: '800' },
  sheetClose: { paddingVertical: 10, alignItems: 'center' },
  sheetCloseText: { fontWeight: '900' },
});
