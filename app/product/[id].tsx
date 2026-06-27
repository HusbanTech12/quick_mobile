import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react-native';
import { useProduct, useProducts } from '../../hooks/useProducts';
import Badge from '../../components/ui/Badge';
import ProductCard from '../../components/ProductCard';
import Skeleton from '../../components/ui/Skeleton';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../../components/ui/Toast';
import { formatPrice } from '../../lib/utils';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const addToCart = useCartStore((s) => s.addToCart);
  const { showToast } = useToast();

  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: related } = useProducts({ category: product?.category, limit: 10 });

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="p-4">
          <Skeleton width="100%" height={350} />
          <View className="p-4 gap-3">
            <Skeleton width="70%" height={24} />
            <Skeleton width="30%" height={20} />
            <Skeleton width="100%" height={100} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-base mb-4">Failed to load product</Text>
          <TouchableOpacity className="bg-brand rounded-xl px-6 py-3" onPress={() => refetch()}>
            <Text className="text-foreground font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const relatedProducts = (Array.isArray(related) ? related : []).filter((p) => p.id !== product.id);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-8">
        <View className="relative">
          <Image
            source={{ uri: product.image_url }}
            style={{ width: '100%', aspectRatio: 1 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={300}
          />
          <TouchableOpacity
            className="absolute top-4 left-4 bg-card/80 rounded-full p-2"
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color="#fafafa" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4 gap-3">
          <Text className="text-sm text-muted">{product.category}</Text>
          <Text className="text-2xl font-bold text-foreground">{product.name}</Text>
          <Text className="text-2xl font-bold text-brand">{formatPrice(product.price)}</Text>

          <Badge stock={product.stock_quantity} />

          <View className="flex-row items-center gap-3">
            <Text className="text-foreground font-medium">Quantity:</Text>
            <View className="flex-row items-center bg-card border border-border rounded-xl">
              <TouchableOpacity
                className="p-3"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={18} color={quantity <= 1 ? '#52525b' : '#fafafa'} />
              </TouchableOpacity>
              <Text className="text-foreground font-bold text-base px-4 min-w-[40px] text-center">
                {quantity}
              </Text>
              <TouchableOpacity
                className="p-3"
                onPress={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                disabled={quantity >= product.stock_quantity}
              >
                <Plus size={18} color={quantity >= product.stock_quantity ? '#52525b' : '#fafafa'} />
              </TouchableOpacity>
            </View>
          </View>

          {product.stock_quantity > 0 && (
            <TouchableOpacity
              className="bg-brand rounded-xl py-4 flex-row items-center justify-center gap-2"
              onPress={() => {
                addToCart(product, quantity);
                showToast({ message: `${product.name} added to cart`, type: 'success' });
                setQuantity(1);
              }}
              activeOpacity={0.8}
            >
              <ShoppingCart size={20} color="#fafafa" />
              <Text className="text-foreground font-bold text-base">Add to Cart</Text>
            </TouchableOpacity>
          )}

          <View className="mt-2">
            <Text className="text-foreground font-bold text-lg mb-2">Description</Text>
            <Text className="text-muted leading-6">{product.description}</Text>
          </View>

          {relatedProducts.length > 0 && (
            <View className="mt-4">
              <Text className="text-foreground font-bold text-lg mb-3">Related Products</Text>
              <FlatList
                data={relatedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View className="w-40 mr-3">
                    <ProductCard
                      product={item}
                      onPress={() => router.push(`/product/${item.id}`)}
                      onAddToCart={() => addToCart(item)}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
