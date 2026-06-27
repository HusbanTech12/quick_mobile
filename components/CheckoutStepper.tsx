import { View, Text } from 'react-native';

const DEFAULT_STEPS = ['Shipping', 'Payment', 'Review'];

interface CheckoutStepperProps {
  currentStep: number;
  steps?: string[];
}

export default function CheckoutStepper({ currentStep, steps }: CheckoutStepperProps) {
  const stepLabels = steps || DEFAULT_STEPS;
  return (
    <View className="flex-row items-center justify-center px-4 py-4">
      {stepLabels.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <View key={label} className="flex-row items-center">
            <View className="items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isCompleted
                    ? 'bg-success'
                    : isActive
                    ? 'bg-brand'
                    : 'bg-border'
                }`}
              >
                <Text className="text-foreground font-bold text-sm">{stepNum}</Text>
              </View>
              <Text
                className={`text-xs mt-1 ${
                  isActive ? 'text-brand font-semibold' : 'text-muted'
                }`}
              >
                {label}
              </Text>
            </View>
            {index < stepLabels.length - 1 && (
              <View
                className={`h-0.5 w-10 mx-2 mb-4 ${
                  stepNum <= currentStep ? 'bg-brand' : 'bg-border'
                }`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
