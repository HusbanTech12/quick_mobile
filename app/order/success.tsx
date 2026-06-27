import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-success/20 rounded-full p-4 mb-6">
          <CheckCircle size={64} color="#10b981" />
        </View>
        <Text className="text-foreground text-2xl font-bold text-center">
          Order Placed!
        </Text>
        <Text className="text-muted text-center mt-2 leading-5">
          Your order has been placed successfully. You will receive a confirmation
          shortly.
        </Text>
        <TouchableOpacity
          className="bg-brand rounded-xl py-4 items-center w-full mt-8"
          onPress={() => router.push('/orders')}
          activeOpacity={0.8}
        >
          <Text className="text-foreground font-bold text-base">View My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-card border border-border rounded-xl py-4 items-center w-full mt-3"
          onPress={() => router.replace('/(tabs)/')}
          activeOpacity={0.8}
        >
          <Text className="text-foreground font-bold text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
