import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { loginUser, getCurrentUser } from '../../lib/api';
import { saveToken } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/ui/Toast';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coldStart, setColdStart] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    setColdStart(false);

    const slowTimer = setTimeout(() => {
      setColdStart(true);
    }, 5000);

    try {
      const loginRes = await loginUser(username, password);
      const token = loginRes.data.access_token;

      await saveToken(token);

      const userRes = await getCurrentUser();
      setAuth(userRes.data, token);

      showToast({ message: 'Welcome back!', type: 'success' });
      router.replace('/(tabs)/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(
        apiError.response?.data?.detail || 'Login failed. Please try again.'
      );
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setColdStart(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground text-center">
              Welcome Back
            </Text>
            <Text className="text-muted text-center mt-2">
              Sign in to your account
            </Text>
          </View>

          {coldStart && (
            <View className="bg-card rounded-xl p-4 mb-4 border border-border">
              <Text className="text-warning text-center text-sm">
                Connecting to server... This may take a moment on first request.
              </Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-foreground text-sm font-medium mb-2">
              Username
            </Text>
            <TextInput
              className="bg-card border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Enter your username"
              placeholderTextColor="#71717a"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (error) setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="text-foreground text-sm font-medium mb-2">
              Password
            </Text>
            <TextInput
              className="bg-card border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#71717a"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {error ? (
            <Text className="text-error text-sm mb-4 text-center">
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              loading ? 'bg-brand/50' : 'bg-brand'
            }`}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fafafa" size="small" />
            ) : (
              <Text className="text-foreground font-bold text-base">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-brand font-bold">Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
