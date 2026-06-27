import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { View, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#0066ff',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const showToast = useCallback((data: ToastData) => {
    setToast(data);
  }, []);

  useEffect(() => {
    if (!toast) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToast(null);
        fadeAnim.setValue(0);
      });
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, fadeAnim]);

  if (!toast) {
    return <>{children}</>;
  }

  const Icon = ICONS[toast.type];
  const color = COLORS[toast.type];

  return (
    <>
      {children}
      <Animated.View
        style={{ opacity: fadeAnim, paddingTop: insets.top + 8 }}
        className="absolute top-0 left-0 right-0 z-50"
      >
        <View className="mx-4 bg-card rounded-xl border border-border p-4 flex-row items-center shadow-lg">
          <Icon size={20} color={color} />
          <Text className="text-foreground flex-1 ml-3 text-sm">{toast.message}</Text>
        </View>
      </Animated.View>
    </>
  );
}
