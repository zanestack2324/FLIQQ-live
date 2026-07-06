const FLW_API = 'https://api.flutterwave.com/v3';

let publicKey: string | null = null;

export function initializeFlutterwave(key: string): void {
  publicKey = key;
}

export function getFlutterwavePublicKey(): string | null {
  return publicKey;
}

export interface FlutterwaveInitParams {
  tx_ref: string;
  amount: number;
  currency?: 'NGN' | 'GHS' | 'USD' | 'KES' | 'ZAR' | 'UGX' | 'TZS' | 'RWF';
  redirect_url?: string;
  customer: {
    email: string;
    name?: string;
    phonenumber?: string;
  };
  payment_options?: string;
  meta?: Record<string, unknown>;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface FlutterwaveInitResponse {
  status: string;
  message: string;
  data: {
    link: string;
    id: number;
    tx_ref: string;
  };
}

export async function initializePayment(
  params: FlutterwaveInitParams,
): Promise<FlutterwaveInitResponse | null> {
  if (!publicKey) {
    console.error('Flutterwave not initialized. Call initializeFlutterwave() first.');
    return null;
  }
  try {
    const response = await fetch(`${FLW_API}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (error) {
    console.error('Flutterwave initialize error:', error);
    return null;
  }
}

export interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    created_at: string;
    customer: { email: string };
  };
}

export async function verifyPayment(
  transactionId: number,
): Promise<FlutterwaveVerifyResponse | null> {
  if (!publicKey) {
    console.error('Flutterwave not initialized.');
    return null;
  }
  try {
    const response = await fetch(`${FLW_API}/transactions/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${publicKey}` },
    });
    return await response.json();
  } catch (error) {
    console.error('Flutterwave verify error:', error);
    return null;
  }
}
