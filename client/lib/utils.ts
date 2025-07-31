import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting utilities
export const formatCurrency = (amount: number, currency: 'USD' | 'VND' = 'USD'): string => {
  if (currency === 'USD') {
    // Convert from VND to USD (approximate rate: 1 USD = 24,000 VND)
    const usdAmount = amount / 24000;
    
    if (usdAmount >= 1000000) {
      return `$${(usdAmount / 1000000).toFixed(1)}M`;
    } else if (usdAmount >= 1000) {
      return `$${(usdAmount / 1000).toFixed(0)}K`;
    } else {
      return `$${usdAmount.toFixed(0)}`;
    }
  } else {
    // Original VND formatting
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M VND`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K VND`;
    } else {
      return `${amount.toFixed(0)} VND`;
    }
  }
};

export const formatCurrencyForTooltip = (amount: number, currency: 'USD' | 'VND' = 'USD'): string => {
  if (currency === 'USD') {
    const usdAmount = amount / 24000;
    return `$${usdAmount.toFixed(0)}`;
  } else {
    return `${(amount / 1000).toFixed(0)}K VND`;
  }
};
