import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CartHeader from "./CartHeader";
import ProductListPanel from "./ProductListPanel";
import CartItemList from "./CartItemList";
import CartSummary from "./CartSummary";
import CustomerSection from '../CustomerPaymentSection/CustomerSection';
import { fetchProducts } from '@/services/productionService';
import { useCartScope } from '@/context/CartContext';
import { getCurrentUser } from '@/lib/authSession';
import { buildCartActionKey, consumeCartActionOnce } from '@/lib/cartRouteState';

function CartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Detect route prefix to navigate correctly under /admin or /cashier
    const routePrefix = location.pathname.startsWith('/admin')
        ? '/admin'
        : location.pathname.startsWith('/store')
            ? '/store'
            : '/cashier';
    const currentUser = getCurrentUser();
    const { data: PRODUCT_LIST = [] } = useQuery({
        queryKey: ['products', currentUser?.storeId, currentUser?.branchId],
        queryFn: () => fetchProducts({ storeId: currentUser?.storeId, branchId: currentUser?.branchId }),
    });
    const {
        items: cartItems,
        customer,
        note,
        discount,
        addProduct,
        updateQuantity,
        removeItem,
        clearCart,
        setCustomer,
    } = useCartScope('staff');
    const [orderInfo] = useState(() => ({
        orderId: `POS-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        cashier: currentUser?.fullName ?? currentUser?.name ?? 'Staff',
        branch: 'VisualAlign - Branch',
    }));

    useEffect(() => {
        const preselectedProduct = location.state?.preselectedProduct;
        if (!preselectedProduct) return;

        const actionKey = buildCartActionKey(location.key, location.state);
        if (consumeCartActionOnce(actionKey)) {
            addProduct(preselectedProduct);
        }

        navigate(location.pathname, { replace: true, state: null });
    }, [location.key, location.pathname, location.state, addProduct, navigate]);

    useEffect(() => {
        if (customer) return;

        if (currentUser?.fullName || currentUser?.email || currentUser?.phone) {
            setCustomer({
                firstName: currentUser.fullName ?? currentUser.name ?? 'Staff',
                email: currentUser.email ?? '',
                phone: currentUser.phone ?? '',
            });
        }
    }, [currentUser, customer, setCustomer]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = 0;
    const total = Math.max(0, subtotal - discount + tax);

    const handleAddProduct = (product) => {
        addProduct(product);
    };

    const handleQtyChange = (id, delta) => {
        updateQuantity(id, delta);
    };

    const handleRemove = (id) => {
        removeItem(id);
    };

    const handleCancelOrder = () => {
        clearCart();
        navigate(routePrefix, { replace: true });
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        navigate(`${routePrefix}/payment`, {
            state: {
                order: {
                    id: orderInfo.orderId,
                    items: cartItems,
                    cashier: orderInfo.cashier,
                    branch: orderInfo.branch,
                },
                customer,
                discount,
                note,
            },
        });
    };

    return (
        <div className="h-full flex flex-col">
            <CartHeader orderInfo={orderInfo} onCheckout={handleCheckout} onCancel={handleCancelOrder} />
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProductListPanel products={PRODUCT_LIST} onAddProduct={handleAddProduct} />
                    <div className="flex flex-col gap-4">
                        <CustomerSection customer={customer} onChangeCustomer={setCustomer} />
                        <CartItemList
                            cartItems={cartItems}
                            onQtyChange={handleQtyChange}
                            onRemove={handleRemove}
                        />
                        <CartSummary
                            customer={customer?.firstName}
                            note={note}
                            subtotal={subtotal}
                            discount={discount}
                            tax={tax}
                            total={total}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
