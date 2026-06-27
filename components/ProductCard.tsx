import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import Badge from './ui/Badge';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  return (
    <TouchableOpacity
      className="bg-card rounded-xl overflow-hidden flex-1 m-1.5"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: product.image_url }}
        className="w-full aspect-square"
        resizeMode="cover"
      />
      <View className="p-2.5 gap-1">
        <Text className="text-foreground font-semibold text-sm" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-brand font-bold text-base">
          {formatPrice(product.price)}
        </Text>
        <View className="flex-row items-center justify-between">
          <Badge stock={product.stock_quantity} />
          {product.stock_quantity > 0 && (
            <TouchableOpacity
              className="bg-brand rounded-full p-1.5"
              onPress={onAddToCart}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Plus size={16} color="#fafafa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
