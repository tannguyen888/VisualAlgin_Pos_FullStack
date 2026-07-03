import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StorePageHeader from '@/pages/Header/storePageHeader';
import Button from '@/components/Button';
import { useCartScope } from '@/context/CartContext';
import { getAuthToken, getCurrentUser } from '@/lib/authSession';
import { createOrder } from '@/services/orderService';
import { applyOrderSale } from '@/services/productionService';
import { beginStripeCheckout } from '@/services/stripeService';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function UserCheckoutPage() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const {
        items,
        clearCart,
    } = useCartScope('user');

    const [paymentMethod, setPaymentMethod] = useState('STRIPE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const ensureLogin = () => {
        const token = getAuthToken();
        if (token) return true;

        navigate('/user/login', {
            state: {
                redirectTo: '/store/checkout',
                reason: 'purchase_requires_login',
            },
        });
        return false;
    };

    const handlePlaceOrder = async () => {
        setError('');

        if (!ensureLogin()) return;
        if (items.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (paymentMethod === 'STRIPE') {
                await beginStripeCheckout({
                    items,
                    totalAmount: subtotal,
                    customerEmail: currentUser?.email ?? '',
                    successUrl: `${window.location.origin}/store?payment=success`,
                    cancelUrl: `${window.location.origin}/store/checkout?payment=cancel`,
                });
                return;
            }

            const orderPayload = {
                totalAmount: subtotal,
                paymentType: 'CASH',
                customerId: currentUser?.id ?? null,
                orderItems: items.map((item) => ({
                    productId: item.productId ?? item.id,
                    quantiy: item.quantity,
                    price: item.price,
                })),
            };

            await createOrder(orderPayload);
            await applyOrderSale(items);
            clearCart();
            navigate('/store?payment=success', { replace: true });
        } catch (checkoutError) {
            setError(checkoutError?.message || 'Checkout failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <StorePageHeader />
                <div className="mt-8 border border-zinc-700 rounded-xl bg-zinc-950/80 p-8 text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Checkout</h1>
                    <p className="text-zinc-300">Your cart is empty. Add products before checkout.</p>
                    <Button onClick={() => navigate('/store/cart')}>go to cart</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <StorePageHeader userName={currentUser?.fullName ?? currentUser?.name ?? 'Guest'} />

            <div className="mt-6 border border-zinc-700 rounded-xl bg-zinc-950/80 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="border border-zinc-700 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-zinc-400">{item.sku} • x{item.quantity}</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="border border-zinc-700 rounded-lg p-4 h-fit space-y-4">
                    <h2 className="text-lg font-semibold">Payment</h2>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="pay-method"
                            checked={paymentMethod === 'STRIPE'}
                            onChange={() => setPaymentMethod('STRIPE')}
                        />
                        Pay with Stripe
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="pay-method"
                            checked={paymentMethod === 'CASH'}
                            onChange={() => setPaymentMethod('CASH')}
                        />
                        Cash on pickup
                    </label>

                    <div className="border-t border-zinc-700 pt-3 space-y-1">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={isSubmitting}
                        onClick={handlePlaceOrder}
                    >
                        {isSubmitting ? 'processing...' : paymentMethod === 'STRIPE' ? 'pay with stripe' : 'place order'}
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => navigate('/store/cart')}>
                        back to cart
                    </Button>
                </aside>
            </div>
        </div>
    );
}

export default UserCheckoutPage;
