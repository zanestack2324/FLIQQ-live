import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { configureRevenueCat } from '@fliqq/sdk';
import { configurePayments } from './src/services/payment';

export default function App() {
  useEffect(() => {
    configureRevenueCat(
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '',
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '',
    );
    configurePayments({
      paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '',
      flutterwavePublicKey: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? '',
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
