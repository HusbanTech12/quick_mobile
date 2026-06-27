import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { ShoppingBag, ShoppingCart, User, Grid2x2 } from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

import type { ColorValue } from 'react-native';

function TabIcon({ icon: Icon, color, size }: { icon: typeof ShoppingBag; color: ColorValue; size: number }) {
  return <Icon color={color as string} size={size} />;
}

function CartTabIcon({ color, size }: { color: ColorValue; size: number }) {
  const count = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  return (
    <View>
      <ShoppingCart color={color as string} size={size} />
      {count > 0 && (
        <View className="absolute -top-2 -right-2 bg-error rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-foreground text-[10px] font-bold">{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066ff',
        tabBarInactiveTintColor: '#71717a',
        tabBarStyle: {
          backgroundColor: '#18181b',
          borderTopColor: '#27272a',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon={ShoppingBag} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon={Grid2x2} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <CartTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon={User} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
