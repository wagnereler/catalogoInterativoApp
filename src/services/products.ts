// src/services/products.ts
import { api } from './api';
import { Product } from '../store/slices/productsSlice';

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const { data } = await api.get<{ products: Product[] }>(`/products/category/${category}`);
  return data.products;
}

export async function fetchProductById(id: string | number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}
