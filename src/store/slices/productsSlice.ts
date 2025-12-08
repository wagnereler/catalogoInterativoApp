// src/store/slices/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  category?: string;
  brand?: string;
  rating?: number;
  stock?: number;
  thumbnail: string;
  images?: string[];
}

interface ProductsState {
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  selectedProduct: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
