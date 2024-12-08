export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  prices: {
    premium: 'price_xxxxx' // Replace with your actual Stripe price ID
  }
};