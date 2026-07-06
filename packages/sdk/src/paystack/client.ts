const PAYSTACK_API = 'https://api.paystack.co';

let publicKey: string | null = null;

export function initializePaystack(key: string): void {
  publicKey = key;
}

export function getPaystackPublicKey(): string | null {
  return publicKey;
}

export interface PaystackInitParams {
  email: string;
  amount: number; // in kobo (i.e. amount * 100)
  currency?: 'NGN' | 'GHS' | 'USD' | 'ZAR';
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels?: ('card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer' | 'eft')[];
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(
  params: PaystackInitParams,
): Promise<PaystackInitResponse | null> {
  if (!publicKey) {
    console.error('Paystack not initialized. Call initializePaystack() first.');
    return null;
  }
  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (error) {
    console.error('Paystack initialize error:', error);
    return null;
  }
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    channel: string;
    paid_at: string;
    created_at: string;
    metadata: Record<string, unknown>;
  };
}

export async function verifyTransaction(
  reference: string,
): Promise<PaystackVerifyResponse | null> {
  if (!publicKey) {
    console.error('Paystack not initialized.');
    return null;
  }
  try {
    const response = await fetch(
      `${PAYSTACK_API}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${publicKey}` } },
    );
    return await response.json();
  } catch (error) {
    console.error('Paystack verify error:', error);
    return null;
  }
}
