import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Package, LogOut, ChevronRight, User } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '../../store/authStore';
import { removeToken } from '../../lib/auth';
import { getInitials } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { showToast } = useToast();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          showToast({ message: 'Logged out successfully', type: 'success' });
          await removeToken();
          logout();
        },
      },
    ]);
  };

  const initials = user?.username ? getInitials(user.username) : '?';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-foreground text-xl font-bold px-4 pt-2 pb-4">Profile</Text>
      <View className="items-center px-4 pb-6">
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            className="w-20 h-20 rounded-full mb-3"
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-brand items-center justify-center mb-3">
            <Text className="text-foreground text-2xl font-bold">{initials}</Text>
          </View>
        )}
        <Text className="text-foreground text-lg font-bold">{user?.username || 'User'}</Text>
        <Text className="text-muted text-sm">{user?.email || ''}</Text>
      </View>
      <View className="px-4 gap-2">
        <TouchableOpacity
          className="bg-card rounded-xl p-4 border border-border flex-row items-center"
          onPress={() => router.push('/orders')}
          activeOpacity={0.8}
        >
          <Package size={20} color="#0066ff" />
          <Text className="text-foreground font-semibold flex-1 ml-3">My Orders</Text>
          <ChevronRight size={18} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-card rounded-xl p-4 border border-border flex-row items-center mt-2"
          onPress={() => router.push('/edit-profile')}
          activeOpacity={0.8}
        >
          <User size={20} color="#0066ff" />
          <Text className="text-foreground font-semibold flex-1 ml-3">Edit Profile</Text>
          <ChevronRight size={18} color="#71717a" />
        </TouchableOpacity>
      </View>
      <View className="flex-1" />
      <View className="px-4 pb-4 gap-4">
        <TouchableOpacity
          className="bg-card border border-error/30 rounded-xl py-4 items-center flex-row justify-center gap-2"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="text-error font-bold text-base">Logout</Text>
        </TouchableOpacity>
        <Text className="text-muted text-xs text-center">
          v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
