import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';
import { useCartTotals } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import EmptyState from '../../components/ui/EmptyState';
import { formatPrice } from '../../lib/utils';

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const { subtotal, tax, total } = useCartTotals();

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet"
          ctaLabel="Browse Products"
          onCtaPress={() => router.push('/(tabs)/products')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-2">
        <Text className="text-foreground text-xl font-bold mb-4">Shopping Cart</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => item.product.id}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4"
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
      <View className="bg-card border-t border-border px-4 py-4 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Subtotal</Text>
          <Text className="text-foreground text-sm">{formatPrice(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Tax (10%)</Text>
          <Text className="text-foreground text-sm">{formatPrice(tax)}</Text>
        </View>
        <View className="flex-row justify-between border-t border-border pt-2">
          <Text className="text-foreground font-bold text-base">Total</Text>
          <Text className="text-foreground font-bold text-base">{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          className="bg-brand rounded-xl py-4 items-center mt-2"
          onPress={() => router.push('/checkout')}
          activeOpacity={0.8}
        >
          <Text className="text-foreground font-bold text-base">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
