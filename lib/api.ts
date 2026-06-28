import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
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

function mapProduct(item: Record<string, unknown>) {
  return {
    id: item.id as string,
    name: item.title as string,
    description: item.description as string,
    price: item.price as number,
    category: item.category as string,
    image_url: item.image as string,
    stock_quantity: item.stock as number,
    is_featured: item.is_featured as boolean,
  };
}

export const registerUser = (data: {
  email: string;
  name: string;
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

export const updateUserProfile = (data: { name?: string; email?: string }) =>
  api.put('/users/me', data);

export const getProducts = async (params?: {
  skip?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  featured_only?: boolean;
}) => {
  const res = await api.get('/products/', { params });
  return { ...res, data: (res.data as Record<string, unknown>[]).map(mapProduct) };
};

export const getCategories = () => api.get('/products/categories');

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return { ...res, data: mapProduct(res.data as Record<string, unknown>) };
};

export const createOrder = (data: {
  items: { product_id: string; quantity: number }[];
  total_amount: number;
}) => api.post('/orders/', data);

export const getOrders = () => api.get('/orders/');

export const getOrderById = (id: string) => api.get(`/orders/${id}`);

export default api;
