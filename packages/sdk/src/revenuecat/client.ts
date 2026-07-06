import Purchases, { PurchasesOfferings, PurchasesStoreProduct, CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

export interface SubscriptionStatus {
  isActive: boolean;
  entitlement: string | null;
  productId: string | null;
  expiresAt: Date | null;
}

let customerInfoListener: ((customerInfo: CustomerInfo) => void) | null = null;

export async function configureRevenueCat(iosApiKey: string, androidApiKey: string): Promise<void> {
  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const apiKey = Platform.OS === 'ios' ? iosApiKey : androidApiKey;
    Purchases.configure({ apiKey });

    if (customerInfoListener) {
      Purchases.addCustomerInfoUpdateListener(customerInfoListener);
    }
  } catch (error) {
    console.error('Error configuring RevenueCat:', error);
    throw error;
  }
}

export async function checkEntitlement(entitlementId: string = 'Fliqq Live Pro'): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[entitlementId] !== 'undefined';
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
}

export async function purchasePackage(packageToBuy: PurchasesStoreProduct): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchaseStoreProduct(packageToBuy);
    return customerInfo;
  } catch (error: any) {
    if (error?.userCancelled) {
      return null;
    }
    console.error('Error purchasing package:', error);
    throw error;
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlements = customerInfo.entitlements.active;
    return Object.keys(entitlements).length > 0;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

export function onCustomerInfoUpdated(callback: (customerInfo: CustomerInfo) => void): void {
  customerInfoListener = callback;
  Purchases.addCustomerInfoUpdateListener(callback);
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const active = Object.values(customerInfo.entitlements.active);
    const entitlement = active.length > 0 ? active[0] : null;

    return {
      isActive: entitlement !== null,
      entitlement: entitlement?.identifier ?? null,
      productId: entitlement?.productIdentifier ?? null,
      expiresAt: entitlement?.expirationDate ? new Date(entitlement.expirationDate) : null,
    };
  } catch (error) {
    return {
      isActive: false,
      entitlement: null,
      productId: null,
      expiresAt: null,
    };
  }
}

