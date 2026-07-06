import * as WebBrowser from 'expo-web-browser';
import {
  initializePaystack,
  getPaystackPublicKey,
  initializeTransaction,
  verifyTransaction,
  initializeFlutterwave,
  getFlutterwavePublicKey,
  initializePayment,
  verifyPayment,
} from '@fliqq/sdk';

export type PaymentProvider = 'paystack' | 'flutterwave';

export interface PaymentConfig {
  paystackPublicKey: string;
  flutterwavePublicKey: string;
}

export function configurePayments(config: PaymentConfig): void {
  initializePaystack(config.paystackPublicKey);
  initializeFlutterwave(config.flutterwavePublicKey);
}

function generateReference(): string {
  return `FLQ-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export async function payWithPaystack(params: {
  email: string;
  amount: number;
  currency?: 'NGN' | 'GHS' | 'USD' | 'ZAR';
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; reference?: string; message?: string }> {
  const reference = generateReference();
  const init = await initializeTransaction({
    email: params.email,
    amount: Math.round(params.amount * 100),
    currency: params.currency ?? 'NGN',
    reference,
    channels: ['card', 'bank', 'ussd', 'bank_transfer', 'qr', 'mobile_money'],
    metadata: params.metadata,
  });
  if (!init?.status || !init.data.authorization_url) {
    return { success: false, message: init?.message ?? 'Failed to initialize payment' };
  }
  const result = await WebBrowser.openAuthSessionAsync(init.data.authorization_url, 'fliqq://paystack');
  if (result.type === 'success') {
    const verify = await verifyTransaction(reference);
    const paid = verify?.data?.status === 'success';
    return { success: paid, reference, message: paid ? undefined : 'Payment not confirmed' };
  }
  return { success: false, reference, message: 'Payment cancelled' };
}

export async function payWithFlutterwave(params: {
  email: string;
  amount: number;
  currency?: 'NGN' | 'GHS' | 'USD' | 'KES' | 'ZAR' | 'UGX' | 'TZS' | 'RWF';
  name?: string;
  phone?: string;
  meta?: Record<string, unknown>;
}): Promise<{ success: boolean; reference?: string; message?: string }> {
  const txRef = generateReference();
  const init = await initializePayment({
    tx_ref: txRef,
    amount: params.amount,
    currency: params.currency ?? 'NGN',
    redirect_url: 'fliqq://flutterwave',
    customer: {
      email: params.email,
      name: params.name,
      phonenumber: params.phone,
    },
    payment_options: 'card,banktransfer,ussd,mobilemoney',
    meta: params.meta,
  });
  if (!init?.data?.link) {
    return { success: false, message: init?.message ?? 'Failed to initialize payment' };
  }
  const result = await WebBrowser.openAuthSessionAsync(init.data.link, 'fliqq://flutterwave');
  if (result.type === 'success') {
    const verify = await verifyPayment(init.data.id);
    const paid = verify?.data?.status === 'successful';
    return { success: paid, reference: txRef, message: paid ? undefined : 'Payment not confirmed' };
  }
  return { success: false, reference: txRef, message: 'Payment cancelled' };
}
