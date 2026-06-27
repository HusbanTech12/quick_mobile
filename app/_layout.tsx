import { View, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../components/ui/Toast';
import NetworkError from '../components/NetworkError';
import { useNetwork } from '../hooks/useNetwork';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isConnected } = useNetwork();

  if (isConnected === false) {
    return <NetworkError onRetry={() => queryClient.refetchQueries()} />;
  }

  if (isConnected === null) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0066ff" />
        <Text className="text-muted text-sm mt-3">Connecting...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <LayoutContent>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </LayoutContent>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
