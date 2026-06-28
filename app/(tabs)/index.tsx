import { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import Skeleton from '../../components/ui/Skeleton';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../../components/ui/Toast';
import type { Product } from '../../types';

const SKELETON_IDS = [1, 2, 3, 4];

export default function HomeScreen() {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: featured,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useProducts({ featured_only: true, limit: 10 });
  const { data: categories } = useCategories();
  const {
    data: recent,
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useProducts({ sort_by: 'created_at', sort_order: 'desc', limit: 10 });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchRecent()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchRecent]);

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
        <View className="mx-4 mb-6 mt-4">
          <View
            className="rounded-xl p-4 overflow-hidden"
            style={{ backgroundColor: '#0f0f12', position: 'relative' }}
          >
            <View
              style={{
                position: 'absolute', top: 0, left: 20, right: 20, height: 1,
                backgroundImage: 'linear-gradient(90deg, transparent, #0066ff, transparent)',
              }}
            />
            <View
              className="absolute w-2 h-2 rounded-full"
              style={{ top: -3.5, left: '50%', marginLeft: -4, backgroundColor: '#0066ff' }}
            />
            <View
              className="flex-row items-center"
              style={{ backgroundColor: 'rgba(0,102,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,102,255,0.3)', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginBottom: 10, alignSelf: 'flex-start' }}
            >
              <View className="w-[5px] h-[5px] rounded-full mr-1.5" style={{ backgroundColor: '#0066ff' }} />
              <Text style={{ color: '#60a5fa', fontSize: 10 }}>Premium Store</Text>
            </View>
            <Text className="text-white font-bold" style={{ fontSize: 22, letterSpacing: -0.5 }}>
              Shop<Text style={{ color: '#0066ff' }}>.pk</Text>
            </Text>
            <Text style={{ color: '#52525b', fontSize: 11, marginBottom: 12, marginTop: 2 }}>
              Best deals, delivered fast
            </Text>
            <TouchableOpacity
              className="self-start"
              style={{ backgroundColor: '#0066ff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold" style={{ fontSize: 12 }}>Explore Now →</Text>
            </TouchableOpacity>
          </View>
        </View>

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
                  onAddToCart={() => {
                    addToCart(item);
                    showToast({ message: `${item.name} added to cart`, type: 'success' });
                  }}
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
                  onAddToCart={() => {
                    addToCart(item);
                    showToast({ message: `${item.name} added to cart`, type: 'success' });
                  }}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
