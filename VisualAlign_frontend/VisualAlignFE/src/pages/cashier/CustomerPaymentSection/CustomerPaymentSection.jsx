import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/Button';
import CustomerSection from './CustomerSection';
import DiscountSection from './DiscountSection';
import NoteSection from './NoteSection';
import PaymentSection from './PaymentSection';
import PaymentDialog from './PaymentDialog';
import { getAuthToken } from '@/lib/authSession';
import { useCartScope } from '@/context/CartContext';
import { getCurrentUser } from '@/lib/authSession';

function CustomerPaymentSection() {
    const location = useLocation();
    const navigate = useNavigate();
    const routePrefix = location.pathname.startsWith('/admin') ? '/admin' : '/cashier';
    const currentUser = getCurrentUser();
    const {
        items,
        customer,
        discount,
        note,
        setCustomer,
        setDiscount,
        setNote,
        clearCart,
    } = useCartScope('staff');

    const [order] = useState(() => ({
        id: `POS-${Date.now().toString().slice(-8)}`,
        cashier: currentUser?.fullName ?? currentUser?.name ?? 'Staff',
        branch: 'VisualAlign - Branch',
    }));
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [cashTendered, setCashTendered] = useState(1000000);
    const [showDialog, setShowDialog] = useState(false);

    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const total = Math.max(0, subtotal - discount);
    const change = paymentMethod === 'CASH' ? Math.max(0, cashTendered - total) : 0;
    const canPay = (paymentMethod !== 'CASH' || cashTendered >= total) && items.length > 0;

    const openPaymentFlow = () => {
        const token = getAuthToken();
        if (!token) {
            navigate('/staff/login', {
                state: {
                    redirectTo: `${routePrefix}/payment`,
                    redirectState: location.state,
                    reason: 'staff_auth_required',
                },
            });
            return;
        }
        setShowDialog(true);
    };

    const handleCancelOrder = () => {
        clearCart();
        navigate(`${routePrefix}/cart`, { replace: true });
    };

    const handlePaymentCompleted = () => {
        clearCart();
        setShowDialog(false);
        navigate(`${routePrefix}/cart`, { replace: true });
    };

    if (items.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-semibold">No items to process</h2>
                    <p className="text-sm text-muted-foreground">Add products to cart before opening payment.</p>
                    <Button onClick={() => navigate(`${routePrefix}/cart`, { replace: true })}>Back To Cart</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-card">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">{order.id}</h1>
                        <Badge variant="secondary">Pending Payment</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {order.cashier} · {order.branch}
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Important — red */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleCancelOrder}
                    >
                        Cancel Order
                    </Button>
                    <Button
                        size="sm"
                        disabled={!canPay}
                        onClick={openPaymentFlow}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Process Payment
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="flex flex-col gap-4">
                        <CustomerSection customer={customer} onChangeCustomer={setCustomer} />
                        <DiscountSection subtotal={subtotal} discount={discount} onDiscountChange={setDiscount} />
                        <NoteSection note={note} onNoteChange={setNote} />
                    </div>
                    {/* Right column */}
                    <PaymentSection
                        total={total}
                        paymentMethod={paymentMethod}
                        onMethodChange={setPaymentMethod}
                        cashTendered={cashTendered}
                        onCashChange={setCashTendered}
                        change={change}
                        canPay={canPay}
                        onPay={openPaymentFlow}
                    />
                </div>
            </div>

            {/* Confirmation dialog */}
            {showDialog && (
                <PaymentDialog
                    order={{ ...order, items }}
                    customer={customer}
                    total={total}
                    discount={discount}
                    paymentMethod={paymentMethod}
                    change={change}
                    onClose={() => setShowDialog(false)}
                    onCompleted={handlePaymentCompleted}
                />
            )}
        </div>
    );
}

export default CustomerPaymentSection;
