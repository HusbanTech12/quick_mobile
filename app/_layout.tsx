import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../components/ui/Toast';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
