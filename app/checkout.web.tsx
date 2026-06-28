import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useCartTotals, useCreateOrder } from '../hooks/useCart';
import CheckoutStepper from '../components/CheckoutStepper';
import { formatPrice } from '../lib/utils';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  phone: string;
}

function ShippingStep({ shipping, onChange, onNext }: { shipping: ShippingInfo; onChange: (s: ShippingInfo) => void; onNext: () => void }) {
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const validate = () => {
    const e: Partial<ShippingInfo> = {};
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required';
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
      <View><Text className="text-foreground text-sm font-medium mb-1">Full Name</Text><TextInput className={inputClass('fullName')} placeholder="John Doe" placeholderTextColor="#71717a" value={shipping.fullName} onChangeText={(t) => onChange({ ...shipping, fullName: t })} />{errors.fullName && <Text className="text-error text-xs mt-1">{errors.fullName}</Text>}</View>
      <View><Text className="text-foreground text-sm font-medium mb-1">Address</Text><TextInput className={inputClass('address')} placeholder="123 Main St" placeholderTextColor="#71717a" value={shipping.address} onChangeText={(t) => onChange({ ...shipping, address: t })} />{errors.address && <Text className="text-error text-xs mt-1">{errors.address}</Text>}</View>
      <View><Text className="text-foreground text-sm font-medium mb-1">City</Text><TextInput className={inputClass('city')} placeholder="New York" placeholderTextColor="#71717a" value={shipping.city} onChangeText={(t) => onChange({ ...shipping, city: t })} />{errors.city && <Text className="text-error text-xs mt-1">{errors.city}</Text>}</View>
      <View><Text className="text-foreground text-sm font-medium mb-1">Phone</Text><TextInput className={inputClass('phone')} placeholder="+1 555-0000" placeholderTextColor="#71717a" value={shipping.phone} onChangeText={(t) => onChange({ ...shipping, phone: t })} keyboardType="phone-pad" />{errors.phone && <Text className="text-error text-xs mt-1">{errors.phone}</Text>}</View>
      <TouchableOpacity className="bg-brand rounded-xl py-4 items-center mt-2" onPress={validate} activeOpacity={0.8}><Text className="text-foreground font-bold text-base">Continue</Text></TouchableOpacity>
    </View>
  );
}

function ReviewStep({ shipping, onPlaceOrder }: { shipping: ShippingInfo; onPlaceOrder: () => void }) {
  const items = useCartStore((s) => s.items);
  const { subtotal, tax, total } = useCartTotals();
  return (
    <View className="px-4 gap-4">
      <Text className="text-foreground text-lg font-bold">Review Order</Text>
      <View className="bg-card rounded-xl p-4 border border-border gap-2">
        <Text className="text-foreground font-semibold mb-1">Shipping To</Text>
        <Text className="text-foreground text-sm">{shipping.fullName}</Text>
        <Text className="text-muted text-sm">{shipping.address}</Text>
        <Text className="text-muted text-sm">{shipping.city}</Text>
        <Text className="text-muted text-sm">{shipping.phone}</Text>
      </View>
      <View className="bg-card rounded-xl p-4 border border-border gap-3">
        <Text className="text-foreground font-semibold mb-1">Items ({items.length})</Text>
        {items.map((item) => (<View key={item.product.id} className="flex-row justify-between"><Text className="text-foreground text-sm flex-1" numberOfLines={1}>{item.product.name} x{item.quantity}</Text><Text className="text-foreground text-sm ml-2">{formatPrice(item.product.price * item.quantity)}</Text></View>))}
      </View>
      <View className="bg-card rounded-xl p-4 border border-border gap-1">
        <View className="flex-row justify-between"><Text className="text-muted text-sm">Subtotal</Text><Text className="text-foreground text-sm">{formatPrice(subtotal)}</Text></View>
        <View className="flex-row justify-between"><Text className="text-muted text-sm">Tax (10%)</Text><Text className="text-foreground text-sm">{formatPrice(tax)}</Text></View>
        <View className="flex-row justify-between border-t border-border pt-2 mt-1"><Text className="text-foreground font-bold">Total</Text><Text className="text-foreground font-bold">{formatPrice(total)}</Text></View>
      </View>
      <TouchableOpacity className="bg-brand rounded-xl py-4 items-center mt-2" onPress={onPlaceOrder} activeOpacity={0.8}><Text className="text-foreground font-bold text-base">Place Order</Text></TouchableOpacity>
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingInfo>({ fullName: '', address: '', city: '', phone: '' });
  const createOrder = useCreateOrder();
  const handlePlaceOrder = async () => {
    try { await createOrder.mutateAsync(); router.replace('/order/success'); }
    catch { Alert.alert('Order Failed', 'Something went wrong. Please try again.'); }
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center px-4 py-3 border-b border-border">
          <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)/cart'))}><Text className="text-brand font-semibold">Back</Text></TouchableOpacity>
          <Text className="text-foreground font-bold text-lg flex-1 text-center mr-10">Checkout</Text>
        </View>
        <CheckoutStepper currentStep={step} steps={['Shipping', 'Review']} />
        <ScrollView className="flex-1" contentContainerClassName="pb-8" keyboardShouldPersistTaps="handled">
          {step === 1 && <ShippingStep shipping={shipping} onChange={setShipping} onNext={() => setStep(2)} />}
          {step === 2 && <ReviewStep shipping={shipping} onPlaceOrder={handlePlaceOrder} />}
        </ScrollView>
        {createOrder.isPending && (
          <View className="absolute inset-0 bg-background/80 items-center justify-center">
            <View className="bg-card rounded-xl p-6 items-center gap-3"><ActivityIndicator size="large" color="#0066ff" /><Text className="text-foreground font-semibold">Placing your order...</Text></View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
