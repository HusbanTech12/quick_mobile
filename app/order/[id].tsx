import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useOrder } from '../../hooks/useOrders';
import Skeleton from '../../components/ui/Skeleton';
import { formatPrice, formatDate } from '../../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#0066ff',
  shipped: '#0066ff',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id || '');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="p-4 gap-4">
          <Skeleton width="40%" height={24} />
          <Skeleton width="100%" height={80} />
          <Skeleton width="100%" height={120} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-base mb-4">Failed to load order</Text>
          <TouchableOpacity className="bg-brand rounded-xl px-6 py-3" onPress={() => refetch()}>
            <Text className="text-foreground font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLORS[order.status] || '#71717a';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color="#fafafa" />
        </TouchableOpacity>
        <Text className="text-foreground font-bold text-lg flex-1 text-center mr-6">
          Order #{order.id}
        </Text>
      </View>
      <ScrollView contentContainerClassName="p-4 gap-4">
        <View className="bg-card rounded-xl p-4 border border-border">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-muted text-sm">Status</Text>
            <View style={{ backgroundColor: statusColor + '20' }} className="rounded-full px-3 py-1">
              <Text style={{ color: statusColor }} className="text-sm font-semibold capitalize">
                {order.status}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-muted text-sm">Date</Text>
            <Text className="text-foreground text-sm">{formatDate(order.created_at)}</Text>
          </View>
        </View>

        <View className="bg-card rounded-xl p-4 border border-border">
          <Text className="text-foreground font-semibold mb-3">Items</Text>
          {order.items.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0"
            >
              <View className="flex-1">
                <Text className="text-foreground text-sm" numberOfLines={1}>
                  {item.product_name}
                </Text>
                <Text className="text-muted text-xs">Qty: {item.quantity}</Text>
              </View>
              <Text className="text-foreground text-sm ml-2">
                {formatPrice(item.unit_price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-card rounded-xl p-4 border border-border">
          <Text className="text-foreground font-semibold mb-2">Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-muted text-sm">Total</Text>
            <Text className="text-foreground font-bold">{formatPrice(order.total_amount)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
