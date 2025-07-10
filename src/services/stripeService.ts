import {supabase} from '../utils/supabaseClient';
import type {CartItem} from '../features/cart/cartSlice';
import {loadStripe} from '@stripe/stripe-js';

export const StripeService = {
  async createCheckoutSession(
    cartItems: CartItem[],
    successUrl: string,
    cancelUrl: string
  ): Promise<void> {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;
    
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: JSON.stringify({
        items: cartItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        userId
      }),
    });

    if (error) throw new Error(error.message);
    
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    if (!stripe) throw new Error('Stripe not initialized');
    
    await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });
  },

  async handlePaymentSuccess(sessionId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('confirm-payment', {
      body: JSON.stringify({ sessionId }),
    });

    if (error) throw new Error(error.message);
  }
};
