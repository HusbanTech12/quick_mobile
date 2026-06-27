import { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../../components/ui/Toast';
import type { Product } from '../../types';

const SKELETON_IDS = [1, 2, 3, 4, 5, 6];

const SORT_OPTIONS = [
  { label: 'Newest', sort_by: 'created_at', sort_order: 'desc' },
  { label: 'Price: Low', sort_by: 'price', sort_order: 'asc' },
  { label: 'Price: High', sort_by: 'price', sort_order: 'desc' },
  { label: 'Name', sort_by: 'name', sort_order: 'asc' },
] as const;

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const addToCart = useCartStore((s) => s.addToCart);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category || '');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [skip, setSkip] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data: categories } = useCategories();

  const queryParams = useMemo(() => ({
    skip,
    limit: 20,
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(minPrice ? { min_price: Number(minPrice) } : {}),
    ...(maxPrice ? { max_price: Number(maxPrice) } : {}),
  }), [skip, selectedCategory, debouncedSearch, sortBy, sortOrder, minPrice, maxPrice]);

  const { data: products, isLoading, isError, refetch, isFetching } = useProducts(queryParams);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(text);
      setSkip(0);
    }, 500);
  }, []);

  const handleSort = useCallback((option: typeof SORT_OPTIONS[number]) => {
    setSortBy(option.sort_by);
    setSortOrder(option.sort_order);
    setSkip(0);
    setShowFilters(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory('');
    setSearch('');
    setDebouncedSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('created_at');
    setSortOrder('desc');
    setSkip(0);
  }, []);

  const onRefresh = useCallback(async () => {
    setSkip(0);
    await refetch();
  }, []);

  const loadMore = useCallback(() => {
    if (!isFetching && products && products.length >= 20) {
      setSkip((prev) => prev + 20);
    }
  }, [isFetching, products]);

  const renderSkeletonItem = useCallback(() => (
    <View className="flex-1 m-1.5 bg-card rounded-xl overflow-hidden">
      <Skeleton width="100%" height={180} />
      <View className="p-2.5 gap-2">
        <Skeleton width="80%" height={14} />
        <Skeleton width="40%" height={16} />
      </View>
    </View>
  ), []);

  const renderProductItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}`)}
      onAddToCart={() => {
        addToCart(item);
        showToast({ message: `${item.name} added to cart`, type: 'success' });
      }}
    />
  ), []);

  const hasActiveFilters = selectedCategory || debouncedSearch || minPrice || maxPrice || sortBy !== 'created_at';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 gap-3">
        <View className="flex-row items-center bg-card border border-border rounded-xl px-3">
          <Search size={18} color="#71717a" />
          <TextInput
            className="flex-1 text-foreground px-2 py-3"
            placeholder="Search products..."
            placeholderTextColor="#71717a"
            value={search}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X size={18} color="#71717a" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="flex-row items-center justify-between">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            {Array.isArray(categories) && categories.map((category: string) => (
              <TouchableOpacity
                key={category}
                className={`rounded-full px-3 py-1.5 mr-2 ${
                  selectedCategory === category ? 'bg-brand' : 'bg-card border border-border'
                }`}
                onPress={() => {
                  setSelectedCategory(selectedCategory === category ? '' : category);
                  setSkip(0);
                }}
                activeOpacity={0.7}
              >
                <Text className={`text-sm ${selectedCategory === category ? 'text-foreground font-medium' : 'text-muted'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            className="ml-2 p-2"
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} color={hasActiveFilters ? '#0066ff' : '#71717a'} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View className="bg-card border border-border rounded-xl p-4 gap-4">
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-muted text-xs mb-1">Min Price</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="$0"
                  placeholderTextColor="#71717a"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-xs mb-1">Max Price</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                  placeholder="$999"
                  placeholderTextColor="#71717a"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View>
              <Text className="text-muted text-xs mb-2">Sort By</Text>
              <View className="flex-row flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    className={`rounded-full px-3 py-1.5 ${
                      sortBy === option.sort_by && sortOrder === option.sort_order
                        ? 'bg-brand'
                        : 'bg-background border border-border'
                    }`}
                    onPress={() => handleSort(option)}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-sm ${
                      sortBy === option.sort_by && sortOrder === option.sort_order
                        ? 'text-foreground font-medium'
                        : 'text-muted'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {isLoading ? (
        <FlatList
          data={SKELETON_IDS}
          numColumns={2}
          contentContainerClassName="px-2 pt-4"
          renderItem={renderSkeletonItem}
          removeClippedSubviews
        />
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-error text-base mb-4">Failed to load products</Text>
          <TouchableOpacity className="bg-brand rounded-xl px-6 py-3" onPress={() => refetch()}>
            <Text className="text-foreground font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : products && products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={hasActiveFilters ? 'Try adjusting your filters' : 'Check back later for new products'}
          ctaLabel={hasActiveFilters ? 'Clear Filters' : undefined}
          onCtaPress={clearFilters}
        />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerClassName="px-2 pt-4 pb-8"
          renderItem={renderProductItem}
          keyExtractor={(item) => String(item.id)}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={7}
          initialNumToRender={6}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor="#0066ff" />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}
