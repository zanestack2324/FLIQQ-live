import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let publishableKey: string | null = null;

export function initializeStripe(key: string): void {
  publishableKey = key;
}

export function getPublishableKey(): string | null {
  return publishableKey;
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
): Promise<{ paymentIntent: string; ephemeralKey: string; customer: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment intent: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return null;
  }
}

export async function initPaymentSheet(
  stripe: { initPaymentSheet: (params: any) => Promise<{ error: any }> },
  merchantDisplayName: string,
  paymentIntentClientSecret: string,
  ephemeralKeySecret?: string,
  customerId?: string,
): Promise<void> {
  try {
    const params: any = {
      merchantDisplayName,
      paymentIntentClientSecret,
    };

    if (ephemeralKeySecret && customerId) {
      params.customerId = customerId;
      params.ephemeralKeySecret = ephemeralKeySecret;
    }

    const { error } = await stripe.initPaymentSheet(params);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('Error initializing payment sheet:', error);
    throw error;
  }
}

export async function presentPaymentSheetUI(
  stripe: { presentPaymentSheet: () => Promise<{ error: any }> },
): Promise<{ error: boolean; message: string | null }> {
  try {
    const { error } = await stripe.presentPaymentSheet();

    if (error) {
      return { error: true, message: error.message ?? 'Payment failed' };
    }

    return { error: false, message: null };
  } catch (error: any) {
    return { error: true, message: error?.message ?? 'Payment sheet error' };
  }
}

