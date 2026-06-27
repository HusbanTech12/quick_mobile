import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { formatPrice } from '../lib/utils';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;

  return (
    <View className="flex-row bg-card rounded-xl p-3 mb-3 items-center">
      <Image
        source={{ uri: product.image_url }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View className="flex-1 ml-3">
        <Text className="text-foreground font-semibold text-sm" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-brand font-bold mt-1">{formatPrice(product.price)}</Text>
        <View className="flex-row items-center mt-2 gap-2">
          <TouchableOpacity
            className="bg-border rounded-full w-7 h-7 items-center justify-center"
            onPress={() => quantity > 1 && onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus size={14} color={quantity <= 1 ? '#52525b' : '#fafafa'} />
          </TouchableOpacity>
          <Text className="text-foreground font-semibold w-6 text-center">{quantity}</Text>
          <TouchableOpacity
            className="bg-border rounded-full w-7 h-7 items-center justify-center"
            onPress={() =>
              quantity < product.stock_quantity && onUpdateQuantity(product.id, quantity + 1)
            }
            disabled={quantity >= product.stock_quantity}
          >
            <Plus size={14} color={quantity >= product.stock_quantity ? '#52525b' : '#fafafa'} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="items-end gap-2">
        <Text className="text-foreground font-bold">
          {formatPrice(product.price * quantity)}
        </Text>
        <TouchableOpacity onPress={() => onRemove(product.id)}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
