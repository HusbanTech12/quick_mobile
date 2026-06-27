import { View, Text } from 'react-native';

interface BadgeProps {
  stock: number;
}

export default function Badge({ stock }: BadgeProps) {
  const type = stock === 0 ? 'error' : stock <= 10 ? 'warning' : 'success';
  const label = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';

  const colors = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
  };

  return (
    <View className={`self-start px-2 py-0.5 rounded-full ${colors[type].split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${colors[type].split(' ')[1]}`}>
        {label}
      </Text>
    </View>
  );
}
