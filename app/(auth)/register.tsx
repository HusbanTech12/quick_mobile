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
import { registerUser } from '../../lib/api';

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser({ email: email.trim(), name: username.trim(), password });
      router.replace('/(auth)/login');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string | { loc: string[]; msg: string }[] } } };
      const detail = apiError.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msgs = detail.map((d) => {
          const field = d.loc[d.loc.length - 1];
          if (d.msg === 'Field required') {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
          return d.msg;
        });
        setError(msgs.join('. '));
      } else {
        setError(detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
              Create Account
            </Text>
            <Text className="text-muted text-center mt-2">
              Sign up to get started
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-foreground text-sm font-medium mb-2">
              Email
            </Text>
            <TextInput
              className="bg-card border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#71717a"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="text-foreground text-sm font-medium mb-2">
              Username
            </Text>
            <TextInput
              className="bg-card border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Choose a username"
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
              placeholder="Create a password"
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
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fafafa" size="small" />
            ) : (
              <Text className="text-foreground font-bold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-brand font-bold">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
