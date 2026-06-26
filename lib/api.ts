import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data: {
  email: string;
  username: string;
  password: string;
}) => api.post('/auth/register', data);

export const loginUser = (username: string, password: string) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  return api.post('/auth/login', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCurrentUser = () => api.get('/auth/me');

export const getProducts = (params?: {
  skip?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  featured_only?: boolean;
}) => api.get('/products/', { params });

export const getCategories = () => api.get('/products/categories');

export const getProductById = (id: number) => api.get(`/products/${id}`);

export const createOrder = (data: {
  items: { product_id: number; quantity: number }[];
  total_amount: number;
}) => api.post('/orders/', data);

export const getOrders = () => api.get('/orders/');

export const getOrderById = (id: number) => api.get(`/orders/${id}`);

export default api;
