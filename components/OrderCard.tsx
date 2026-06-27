import { View, Text, TouchableOpacity } from 'react-native';
import { Package } from 'lucide-react-native';
import { formatPrice, formatDate } from '../lib/utils';
import type { Order } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#0066ff',
  shipped: '#0066ff',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const statusColor = STATUS_COLORS[order.status] || '#71717a';

  return (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 border border-border mb-3"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Package size={18} color="#0066ff" />
          <Text className="text-foreground font-semibold">#{order.id}</Text>
        </View>
        <View style={{ backgroundColor: statusColor + '20' }} className="rounded-full px-3 py-1">
          <Text style={{ color: statusColor }} className="text-xs font-semibold capitalize">
            {order.status}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-muted text-sm">{formatDate(order.created_at)}</Text>
        <Text className="text-foreground font-bold">{formatPrice(order.total_amount)}</Text>
      </View>
    </TouchableOpacity>
  );
}
