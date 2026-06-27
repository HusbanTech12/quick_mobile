import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrderById } from '../lib/api';
import type { Order } from '../types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await getOrders();
      return res.data as Order[];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getOrderById(id);
      return res.data as Order;
    },
    enabled: !!id,
  });
}
