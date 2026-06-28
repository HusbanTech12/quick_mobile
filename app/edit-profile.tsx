import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { updateUserProfile } from '../lib/api';
import Input from '../components/ui/Input';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [name, setName] = useState(user?.name || (user as Record<string, unknown>)?.name as string || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim() && !email.trim()) {
      setError('At least one field must be changed');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body: { name?: string; email?: string } = {};
      if (name.trim()) body.name = name.trim();
      if (email.trim()) body.email = email.trim();
      const res = await updateUserProfile(body);
      if (user && token) {
        setAuth({ ...user, ...res.data }, token);
      }
      Alert.alert('Success', 'Profile updated', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { detail: string } } }).response?.data?.detail || 'Failed to update profile'
          : 'Failed to update profile';
      setError(typeof msg === 'string' ? msg : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text className="text-foreground text-xl font-bold">Edit Profile</Text>
      </View>
      <View className="px-4 gap-4">
        <Input
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text className="text-error text-sm">{error}</Text> : null}
        <TouchableOpacity
          className="bg-brand rounded-xl py-4 items-center mt-2"
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fafafa" />
          ) : (
            <Text className="text-foreground font-bold text-base">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
