import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import type { Order } from '../types';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, isError, refetch, isFetching } = useOrders();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-foreground text-xl font-bold px-4 pt-2 pb-4">My Orders</Text>
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(i) => String(i)}
          contentContainerClassName="px-4"
          renderItem={() => (
            <View className="bg-card rounded-xl p-4 border border-border mb-3 gap-2">
              <Skeleton width="40%" height={16} />
              <Skeleton width="60%" height={14} />
            </View>
          )}
        />
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-base mb-4">Failed to load orders</Text>
          <TouchableOpacity className="bg-brand rounded-xl px-6 py-3" onPress={() => refetch()}>
            <Text className="text-foreground font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Start shopping to see your orders here"
          ctaLabel="Start Shopping"
          onCtaPress={() => router.push('/(tabs)/')}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: Order) => String(item.id)}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => router.push(`/order/${item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#0066ff" />
          }
        />
      )}
    </SafeAreaView>
  );
}
