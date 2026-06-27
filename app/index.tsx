import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../lib/auth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    };
    init();
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <View className="items-center gap-3">
        <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center">
          <Text className="text-foreground text-2xl font-bold">QS</Text>
        </View>
        <Text className="text-foreground text-xl font-bold">QuickStore</Text>
        <Text className="text-muted text-sm">Loading your experience...</Text>
        <ActivityIndicator size="large" color="#0066ff" className="mt-4" />
      </View>
    </View>
  );
}
