import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../lib/api';
import { useCartStore } from '../store/cartStore';

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, tax, total, count };
}

export function useCreateOrder() {
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);

  return useMutation({
    mutationFn: () => {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
      const total_amount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      return createOrder({ items: orderItems, total_amount });
    },
    onSuccess: () => {
      clearCart();
    },
  });
}
