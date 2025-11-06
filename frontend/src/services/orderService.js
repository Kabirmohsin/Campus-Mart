import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders/user/my-orders');
    return response.data;
  },

  // ✅ ADD THIS FUNCTION FOR SELLER DASHBOARD
  getSellerOrders: async () => {
    const response = await api.get('/orders/seller/my-orders');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
};