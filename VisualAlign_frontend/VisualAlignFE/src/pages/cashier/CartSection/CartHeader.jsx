import { Badge } from '@/components/ui/badge';
import Button from '@/components/Button';

function CartHeader({ orderInfo, onCheckout, onCancel }) {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-b bg-card">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{orderInfo.orderId}</h1>
                    <Badge variant="secondary">In Progress</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {orderInfo.date} · {orderInfo.time} · {orderInfo.cashier} · {orderInfo.branch}
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel Order</Button>
                <Button
                    className="bg-red-500 hover:bg-red-700"
                    size="sm"
                    onClick={onCheckout}
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
}

export default CartHeader;
