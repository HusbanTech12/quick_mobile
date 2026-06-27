import { View, Text, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';

interface NetworkErrorProps {
  onRetry?: () => void;
}

export default function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <View className="bg-card rounded-2xl p-8 items-center max-w-sm w-full border border-border">
        <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-4">
          <WifiOff size={32} color="#ef4444" />
        </View>
        <Text className="text-foreground text-xl font-bold mb-2">No Internet Connection</Text>
        <Text className="text-muted text-center mb-6">
          You're offline. Check your connection and try again.
        </Text>
        {onRetry && (
          <TouchableOpacity
            className="bg-brand rounded-xl px-6 py-3 flex-row items-center gap-2"
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <RefreshCw size={18} color="#fafafa" />
            <Text className="text-foreground font-bold">Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
