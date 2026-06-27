import { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import Skeleton from '../../components/ui/Skeleton';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types';

const SKELETON_IDS = [1, 2, 3, 4];

export default function HomeScreen() {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const [refreshing, setRefreshing] = useState(false);

  const { data: featured, isLoading: featuredLoading } = useProducts({ featured_only: true, limit: 10 });
  const { data: categories } = useCategories();
  const { data: recent, isLoading: recentLoading } = useProducts({ sort_by: 'created_at', sort_order: 'desc', limit: 10 });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([featured?.refetch?.(), recent?.refetch?.()]);
    setRefreshing(false);
  }, []);

  const renderSkeletonGrid = () => (
    <FlatList
      data={SKELETON_IDS}
      numColumns={2}
      scrollEnabled={false}
      renderItem={() => (
        <View className="flex-1 m-1.5 bg-card rounded-xl overflow-hidden">
          <Skeleton width="100%" height={180} />
          <View className="p-2.5 gap-2">
            <Skeleton width="80%" height={14} />
            <Skeleton width="40%" height={16} />
          </View>
        </View>
      )}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066ff" />
        }
      >
        <Text className="text-2xl font-bold text-foreground px-4 pt-4 pb-2">QuickStore</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-6">
          <View className="bg-brand/20 rounded-2xl p-6 w-[300px]">
            <Text className="text-foreground text-xl font-bold">Premium Products</Text>
            <Text className="text-muted text-sm mt-1">Shop the best deals today</Text>
          </View>
        </ScrollView>

        {Array.isArray(categories) && categories.length > 0 && (
          <View className="mb-6">
            <Text className="text-foreground font-bold text-lg px-4 mb-3">Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
              {categories.map((category: string) => (
                <TouchableOpacity
                  key={category}
                  className="bg-card border border-border rounded-full px-4 py-2 mr-2"
                  onPress={() => router.push({ pathname: '/(tabs)/products', params: { category } })}
                  activeOpacity={0.7}
                >
                  <Text className="text-foreground text-sm">{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-foreground font-bold text-lg">Featured</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text className="text-brand text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {featuredLoading ? (
            <FlatList
              data={SKELETON_IDS}
              numColumns={2}
              scrollEnabled={false}
              renderItem={() => (
                <View className="flex-1 m-1.5 bg-card rounded-xl overflow-hidden">
                  <Skeleton width="100%" height={180} />
                  <View className="p-2.5 gap-2">
                    <Skeleton width="80%" height={14} />
                    <Skeleton width="40%" height={16} />
                  </View>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={featured}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onAddToCart={() => addToCart(item)}
                />
              )}
            />
          )}
        </View>

        <View>
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-foreground font-bold text-lg">New Arrivals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text className="text-brand text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {recentLoading ? (
            <FlatList
              data={SKELETON_IDS}
              numColumns={2}
              scrollEnabled={false}
              renderItem={() => (
                <View className="flex-1 m-1.5 bg-card rounded-xl overflow-hidden">
                  <Skeleton width="100%" height={180} />
                  <View className="p-2.5 gap-2">
                    <Skeleton width="80%" height={14} />
                    <Skeleton width="40%" height={16} />
                  </View>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={recent}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onAddToCart={() => addToCart(item)}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
