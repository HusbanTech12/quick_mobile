import { View, Text, TouchableOpacity } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, ctaLabel, onCtaPress }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      {Icon && <Icon size={48} color="#71717a" />}
      <Text className="text-foreground font-bold text-lg mt-4 text-center">{title}</Text>
      {description && <Text className="text-muted text-sm mt-2 text-center">{description}</Text>}
      {ctaLabel && onCtaPress && (
        <TouchableOpacity
          className="bg-brand rounded-xl px-6 py-3 mt-6"
          onPress={onCtaPress}
          activeOpacity={0.8}
        >
          <Text className="text-foreground font-bold">{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
