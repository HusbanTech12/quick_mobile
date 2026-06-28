import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { updateUserProfile } from '../lib/api';
import { getInitials } from '../lib/utils';
import { useToast } from '../components/ui/Toast';
import Input from '../components/ui/Input';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAvatar = useAuthStore((s) => s.setAvatar);
  const token = useAuthStore((s) => s.token);
  const { showToast } = useToast();

  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow access to your photo library to set a profile picture');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalAvatar(uri);
      setAvatar(uri);
    }
  };

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
      showToast({ message: 'Profile saved', type: 'success' });
      router.back();
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

  const avatarUrl = localAvatar || user?.avatar_url;
  const initials = user?.username ? getInitials(user.username) : '?';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text className="text-foreground text-xl font-bold">Edit Profile</Text>
      </View>
      <View className="items-center px-4 pb-6">
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-20 h-20 rounded-full"
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-brand items-center justify-center">
              <Text className="text-foreground text-2xl font-bold">{initials}</Text>
            </View>
          )}
          <View className="absolute -bottom-1 -right-1 bg-card rounded-full p-2 border-2 border-background">
            <Camera size={16} color="#fafafa" />
          </View>
        </TouchableOpacity>
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
