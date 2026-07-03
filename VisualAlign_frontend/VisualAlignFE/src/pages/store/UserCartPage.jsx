import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StorePageHeader from '@/pages/Header/storePageHeader';
import { useCartScope } from '@/context/CartContext';
import Button from '@/components/Button';
import { getCurrentUser } from '@/lib/authSession';
import { buildCartActionKey, consumeCartActionOnce } from '@/lib/cartRouteState';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function UserCartPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const {
        items,
        updateQuantity,
        removeItem,
        clearCart,
        addProduct,
    } = useCartScope('user');

    useEffect(() => {
        const preselectedProduct = location.state?.preselectedProduct;
        if (!preselectedProduct) return;

        const actionKey = buildCartActionKey(location.key, location.state);
        if (consumeCartActionOnce(actionKey)) {
            addProduct(preselectedProduct);
        }

        navigate(location.pathname, { replace: true, state: null });
    }, [addProduct, location.key, location.pathname, location.state, navigate]);

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <StorePageHeader userName={currentUser?.fullName ?? currentUser?.name ?? 'Guest'} />

            <div className="mt-6 border border-zinc-700 rounded-xl bg-zinc-950/80 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-semibold">Your Cart</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={clearCart}>clear cart</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => navigate('/store/checkout')}
                            disabled={items.length === 0}
                        >
                            checkout
                        </Button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                        <p className="text-zinc-300">Your cart is empty.</p>
                        <Button onClick={() => navigate('/store')}>continue shopping</Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="border border-zinc-700 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-zinc-400">{item.sku} • {formatCurrency(item.price)}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-7 h-7 border border-zinc-600 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-7 h-7 border border-zinc-600 rounded"
                                    >
                                        +
                                    </button>
                                    <span className="w-36 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-400 text-xs hover:underline"
                                    >
                                        remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="border-t border-zinc-700 pt-3 flex justify-between font-semibold text-lg">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserCartPage;
