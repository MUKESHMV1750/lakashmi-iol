import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchFeatured = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data.products;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchBestSellers = createAsyncThunk('products/fetchBestSellers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/bestsellers');
    return data.products;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    featuredProducts: [],
    bestSellers: [],
    pagination: { page: 1, pages: 1, total: 0 },
    loading: false,
    error: null,
    filters: { keyword: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: 'newest' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { keyword: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: 'newest' }; },
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.product = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.product = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featuredProducts = action.payload; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload; });
  },
});

export const { setFilters, clearFilters, clearProduct } = productSlice.actions;
export default productSlice.reducer;
