import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StripeProvider, useStripe, CardField } from '@stripe/stripe-react-native';
import { useCartStore } from '../store/cartStore';
import { useCartTotals } from '../hooks/useCart';
import { createPaymentIntent, confirmPayment } from '../lib/api';
import CheckoutStepper from '../components/CheckoutStepper';
import { useToast } from '../components/ui/Toast';
import { formatPrice } from '../lib/utils';

const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

function ShippingStep({
  shipping,
  onChange,
  onNext,
  loading,
}: {
  shipping: ShippingInfo;
  onChange: (s: ShippingInfo) => void;
  onNext: () => void;
  loading: boolean;
}) {
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const validate = () => {
    const e: Partial<ShippingInfo> = {};
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required';
    if (!shipping.email.trim()) e.email = 'Email is required';
    if (!shipping.address.trim()) e.address = 'Address is required';
    if (!shipping.city.trim()) e.city = 'City is required';
    if (!shipping.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  };

  const inputClass = (field: string) =>
    `bg-card border ${errors[field as keyof ShippingInfo] ? 'border-error' : 'border-border'} rounded-xl px-4 py-3 text-foreground`;

  return (
    <View className="px-4 gap-4">
      <Text className="text-foreground text-lg font-bold">Shipping Information</Text>
      <View>
        <Text className="text-foreground text-sm font-medium mb-1">Full Name</Text>
        <TextInput
          className={inputClass('fullName')}
          placeholder="John Doe"
          placeholderTextColor="#71717a"
          value={shipping.fullName}
          onChangeText={(t) => onChange({ ...shipping, fullName: t })}
        />
        {errors.fullName && <Text className="text-error text-xs mt-1">{errors.fullName}</Text>}
      </View>
      <View>
        <Text className="text-foreground text-sm font-medium mb-1">Email</Text>
        <TextInput
          className={inputClass('email')}
          placeholder="john@example.com"
          placeholderTextColor="#71717a"
          value={shipping.email}
          onChangeText={(t) => onChange({ ...shipping, email: t })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text className="text-error text-xs mt-1">{errors.email}</Text>}
      </View>
      <View>
        <Text className="text-foreground text-sm font-medium mb-1">Address</Text>
        <TextInput
          className={inputClass('address')}
          placeholder="123 Main St"
          placeholderTextColor="#71717a"
          value={shipping.address}
          onChangeText={(t) => onChange({ ...shipping, address: t })}
        />
        {errors.address && <Text className="text-error text-xs mt-1">{errors.address}</Text>}
      </View>
      <View>
        <Text className="text-foreground text-sm font-medium mb-1">City</Text>
        <TextInput
          className={inputClass('city')}
          placeholder="New York"
          placeholderTextColor="#71717a"
          value={shipping.city}
          onChangeText={(t) => onChange({ ...shipping, city: t })}
        />
        {errors.city && <Text className="text-error text-xs mt-1">{errors.city}</Text>}
      </View>
      <View>
        <Text className="text-foreground text-sm font-medium mb-1">Phone</Text>
        <TextInput
          className={inputClass('phone')}
          placeholder="+1 555-0000"
          placeholderTextColor="#71717a"
          value={shipping.phone}
          onChangeText={(t) => onChange({ ...shipping, phone: t })}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text className="text-error text-xs mt-1">{errors.phone}</Text>}
      </View>
      <TouchableOpacity
        className={`rounded-xl py-4 items-center mt-2 ${loading ? 'bg-brand/50' : 'bg-brand'}`}
        onPress={validate}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fafafa" size="small" />
        ) : (
          <Text className="text-foreground font-bold text-base">Continue to Payment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function PaymentStep({
  total,
  onPaymentSuccess,
  clientSecret,
}: {
  total: number;
  onPaymentSuccess: () => void;
  clientSecret: string | null;
}) {
  const { confirmPayment } = useStripe();
  const [cardComplete, setCardComplete] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!clientSecret) return;
    setPaying(true);
    const { error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });
    if (error) {
      Alert.alert('Payment failed', error.message || 'Something went wrong');
      setPaying(false);
    } else {
      onPaymentSuccess();
    }
  };

  return (
    <View className="px-4 gap-4">
      <Text className="text-foreground text-lg font-bold">Payment</Text>
      <View className="bg-card rounded-xl p-4 border border-border">
        <Text className="text-muted text-sm mb-1">Total Amount</Text>
        <Text className="text-foreground text-3xl font-bold">{formatPrice(total)}</Text>
      </View>
      <Text className="text-foreground text-sm font-semibold">Card Details</Text>
      <View className="bg-card border border-border rounded-xl overflow-hidden p-2">
        <CardField
          postalCodeEnabled={true}
          placeholders={{ number: '4242 4242 4242 4242' }}
          cardStyle={{
            backgroundColor: '#18181b',
            textColor: '#fafafa',
            placeholderColor: '#71717a',
            borderColor: '#27272a',
            borderRadius: 12,
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 8,
          }}
          onCardChange={(details: { complete: boolean }) => setCardComplete(details.complete)}
        />
      </View>
      <TouchableOpacity
        className={`rounded-xl py-4 items-center mt-2 ${paying || !cardComplete ? 'bg-brand/50' : 'bg-brand'}`}
        onPress={handlePay}
        disabled={paying || !cardComplete}
        activeOpacity={0.8}
      >
        {paying ? (
          <ActivityIndicator color="#fafafa" size="small" />
        ) : (
          <Text className="text-foreground font-bold text-base">Pay {formatPrice(total)}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function ReviewStep({
  shipping,
  onPlaceOrder,
  placing,
}: {
  shipping: ShippingInfo;
  onPlaceOrder: () => void;
  placing: boolean;
}) {
  const items = useCartStore((s) => s.items);
  const { subtotal, tax, total } = useCartTotals();

  return (
    <View className="px-4 gap-4">
      <Text className="text-foreground text-lg font-bold">Review Order</Text>
      <View className="bg-card rounded-xl p-4 border border-border gap-2">
        <Text className="text-foreground font-semibold mb-1">Shipping To</Text>
        <Text className="text-foreground text-sm">{shipping.fullName}</Text>
        <Text className="text-muted text-sm">{shipping.email}</Text>
        <Text className="text-muted text-sm">{shipping.address}</Text>
        <Text className="text-muted text-sm">{shipping.city}</Text>
        <Text className="text-muted text-sm">{shipping.phone}</Text>
      </View>
      <View className="bg-card rounded-xl p-4 border border-border gap-3">
        <Text className="text-foreground font-semibold mb-1">Items ({items.length})</Text>
        {items.map((item) => (
          <View key={item.product.id} className="flex-row justify-between">
            <Text className="text-foreground text-sm flex-1" numberOfLines={1}>
              {item.product.name} x{item.quantity}
            </Text>
            <Text className="text-foreground text-sm ml-2">
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>
      <View className="bg-card rounded-xl p-4 border border-border gap-1">
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Subtotal</Text>
          <Text className="text-foreground text-sm">{formatPrice(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Tax (10%)</Text>
          <Text className="text-foreground text-sm">{formatPrice(tax)}</Text>
        </View>
        <View className="flex-row justify-between border-t border-border pt-2 mt-1">
          <Text className="text-foreground font-bold">Total</Text>
          <Text className="text-foreground font-bold">{formatPrice(total)}</Text>
        </View>
      </View>
      <TouchableOpacity
        className={`rounded-xl py-4 items-center mt-2 ${placing ? 'bg-brand/50' : 'bg-brand'}`}
        onPress={onPlaceOrder}
        disabled={placing}
        activeOpacity={0.8}
      >
        {placing ? (
          <ActivityIndicator color="#fafafa" size="small" />
        ) : (
          <Text className="text-foreground font-bold text-base">Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { total } = useCartTotals();

  const [step, setStep] = useState(1);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  const handleCreatePaymentIntent = async () => {
    setCreatingPayment(true);
    try {
      const payload = {
        order_data: {
          shipping_name: shipping.fullName.trim(),
          shipping_address: shipping.address.trim(),
          shipping_city: shipping.city.trim(),
          shipping_email: shipping.email.trim(),
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      };
      const res = await createPaymentIntent(payload);
      setClientSecret(res.data.clientSecret);
      setStep(2);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { detail: string } } }).response?.data?.detail || 'Payment initialization failed'
          : 'Payment initialization failed';
      Alert.alert('Error', msg);
    } finally {
      setCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    showToast({ message: 'Payment successful!', type: 'success' });
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const piId = clientSecret?.split('_secret_')[0];
      if (piId) {
        await confirmPayment(piId);
      }
      clearCart();
      showToast({ message: 'Order placed! Thank you.', type: 'success' });
      router.replace('/order/success');
    } catch {
      Alert.alert('Order Failed', 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted text-base text-center">Your cart is empty</Text>
        <TouchableOpacity
          className="bg-brand rounded-xl px-6 py-3 mt-4"
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Text className="text-foreground font-bold">Go to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 py-3 border-b border-border">
          <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)/cart'))}>
            <Text className="text-brand font-semibold">Back</Text>
          </TouchableOpacity>
          <Text className="text-foreground font-bold text-lg flex-1 text-center mr-10">
            Checkout
          </Text>
        </View>
        <CheckoutStepper currentStep={step} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <ShippingStep
              shipping={shipping}
              onChange={setShipping}
              onNext={handleCreatePaymentIntent}
              loading={creatingPayment}
            />
          )}
          {step === 2 && (
            <PaymentStep
              total={total}
              onPaymentSuccess={handlePaymentSuccess}
              clientSecret={clientSecret}
            />
          )}
          {step === 3 && (
            <ReviewStep shipping={shipping} onPlaceOrder={handlePlaceOrder} placing={placing} />
          )}
        </ScrollView>
        {placing && (
          <View className="absolute inset-0 bg-background/80 items-center justify-center">
            <View className="bg-card rounded-xl p-6 items-center gap-3">
              <ActivityIndicator size="large" color="#0066ff" />
              <Text className="text-foreground font-semibold">Finalizing your order...</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function CheckoutScreen() {
  if (!STRIPE_KEY) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-error text-base text-center">Stripe is not configured</Text>
      </SafeAreaView>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <CheckoutContent />
    </StripeProvider>
  );
}
