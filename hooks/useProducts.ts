import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById, getCategories } from '../lib/api';
import type { Product } from '../types';

function extractArray(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const candidates = ['products', 'items', 'data', 'results', 'product'];
    for (const key of candidates) {
      const val = (data as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val;
    }
  }
  return [];
}

export function useProducts(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  featured_only?: boolean;
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params).then((res) => res.data as Product[]),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => extractArray(res.data)),
  });
}
