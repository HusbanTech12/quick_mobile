import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../lib/auth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken();
        if (token) {
          router.replace('/(tabs)/');
        } else {
          router.replace('/(auth)/login');
        }
      } catch {
        router.replace('/(auth)/login');
      }
    };
    init();
  }, [router]);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#0066ff" />
    </View>
  );
}
