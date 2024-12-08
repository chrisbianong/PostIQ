import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const createSubscription = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw error;
  }
};