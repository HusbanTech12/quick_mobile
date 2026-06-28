import { View, Text, TextInput } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
}: InputProps) {
  return (
    <View className="gap-1">
      {label ? <Text className="text-foreground text-sm font-semibold">{label}</Text> : null}
      <TextInput
        className={`bg-card border rounded-xl px-4 py-3 text-foreground ${
          error ? 'border-error' : 'border-border'
        }`}
        placeholder={placeholder}
        placeholderTextColor="#71717a"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error ? <Text className="text-error text-xs">{error}</Text> : null}
    </View>
  );
}
