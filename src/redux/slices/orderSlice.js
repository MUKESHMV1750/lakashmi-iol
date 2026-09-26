import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data.order;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create order'); }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders'); }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch order details'); }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/${id}/cancel`, { reason });
    toast.success('Order cancelled successfully');
    return data.order;
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to cancel order';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], order: null, loading: false, cancelling: false, error: null, total: 0 },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; toast.error(action.payload); })
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders; state.total = action.payload.total; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; state.error = null; state.order = null; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(cancelOrder.pending, (state) => { state.cancelling = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelling = false;
        state.order = action.payload;
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(cancelOrder.rejected, (state) => { state.cancelling = false; });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
