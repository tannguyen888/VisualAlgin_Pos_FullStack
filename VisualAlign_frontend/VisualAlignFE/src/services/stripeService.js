import { loadStripe } from '@stripe/stripe-js';
import { requestJson } from '@/services/apiClient';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
let stripePromise = null;

function getStripeClient() {
    if (!publishableKey) {
        throw new Error('Stripe publishable key is missing. Set VITE_STRIPE_PUBLISHABLE_KEY in frontend env.');
    }

    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }

    return stripePromise;
}

export async function beginStripeCheckout(payload) {
    const checkoutSession = await requestJson('/api/payments/stripe/checkout-session', {
        method: 'POST',
        body: payload,
        useAuth: true,
    });

    if (checkoutSession?.url) {
        window.location.href = checkoutSession.url;
        return;
    }

    if (!checkoutSession?.sessionId) {
        throw new Error('Invalid Stripe session response from server.');
    }

    const stripe = await getStripeClient();
    const result = await stripe.redirectToCheckout({ sessionId: checkoutSession.sessionId });

    if (result?.error?.message) {
        throw new Error(result.error.message);
    }
}
