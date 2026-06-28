import '../global.css';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Stack, Redirect, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../components/ui/Toast';
import NetworkError from '../components/NetworkError';
import { useNetwork } from '../hooks/useNetwork';
import { useAuthStore } from '../store/authStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function LayoutContent({ children, onReady }: { children: React.ReactNode; onReady: () => void }) {
  const { isConnected } = useNetwork();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isConnected !== null) {
      setReady(true);
      onReady();
    }
  }, [isConnected, onReady]);

  if (isConnected === false) {
    return <NetworkError onRetry={() => queryClient.refetchQueries()} />;
  }

  if (!ready) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0066ff" />
        <Text className="text-muted text-sm mt-3">Connecting to server...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const isInTabs = segments[0] === '(tabs)';

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (appReady && !isAuthenticated && isInTabs) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <LayoutContent onReady={() => setAppReady(true)}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </LayoutContent>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
