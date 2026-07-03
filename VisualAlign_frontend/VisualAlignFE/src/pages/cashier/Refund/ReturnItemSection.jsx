import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/Button';
import ReturnRecipetDialog from './ReturnRecipetDialog';


const formatCurrency = (v) =>
    v != null ? `${Number(v).toLocaleString('vi-VN')} VND` : '—';

const formatDateTime = (createdAt) => {
    if (!createdAt) return '—';
    return new Date(createdAt).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const PAYMENT_LABELS  = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };
const PAYMENT_VARIANT = { CASH: 'secondary', CARD: 'default', UPI: 'outline' };

/**
 * ReturnItemSection — trang xử lý hoàn trả đơn hàng.
 *
 * Nhận dữ liệu qua location.state.order (navigate từ OrderDetail).
 *
 * TODO khi tích hợp API:
 *   const res = await fetch(`/api/refunds`, {
 *       method: 'POST',
 *       body: JSON.stringify({ orderId: order.id, refundItems: cartItems }),
 *   });
 */
function ReturnItemSection() {
   
    const { state } = useLocation();
    const navigate  = useNavigate();
    const order    = state?.order ?? null;

    // cartItems giữ danh sách item đang được refund (có thể xoá bớt)
    const [cartItems, setCartItems] = useState(order?.orderItems ?? []);
    const [showDialog, setShowDialog] = useState(false);

    // Xoá 1 item khỏi danh sách refund
    const handleRemoveItem = (itemId) => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
    };

    // Cập nhật số lượng refund của 1 item
    // - Nếu qty <= 0: xoá item khỏi danh sách
    // - Nếu qty > số lượng gốc: giữ nguyên (không cho refund quá số đã mua)
    const handleEditCartItem = (itemId, newQty) => {
        if (newQty <= 0) {
            handleRemoveItem(itemId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => {
                if (item.id !== itemId) return item;
                const maxQty = order.orderItems.find(i => i.id === itemId)?.quantiy ?? newQty;
                return { ...item, quantiy: Math.min(newQty, maxQty) };
            })
        );
    };

    // Tổng tiền refund tính động theo cartItems hiện tại
    const refundTotal = cartItems.reduce(
        (s, i) => s + (i.price ?? 0) * (i.quantiy ?? 0), 0
    );

    const handleConfirmRefund = () => {
        // Mở dialog xác nhận + in receipt
        // TODO: gọi API tạo refund với cartItems trước khi mở dialog
        setShowDialog(true);
    };

    if (!order) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                <p className="text-muted-foreground">No order data. Please go back and select an order.</p>
                <Button variant="outline" onClick={() => navigate('/cashier/order-history')}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Order History
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <RotateCcw size={18} className="text-orange-500" />
                            Refund — Order #{order.id}
                        </CardTitle>
                        <Badge variant={PAYMENT_VARIANT[order.paymentType]}>
                            {PAYMENT_LABELS[order.paymentType] ?? order.paymentType}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-4 pt-4 text-sm">
                    {/* Customer */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.customer?.firstName ?? '—'}</p>
                        <p className="text-muted-foreground">{order.customer?.phone ?? '—'}</p>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                            Items to Return
                            {cartItems.length === 0 && (
                                <span className="ml-2 text-orange-500 normal-case">(No items selected)</span>
                            )}
                        </p>

                        {cartItems.length === 0 ? (
                            <p className="py-6 text-center text-muted-foreground">
                                All items removed. Add items back or cancel.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                        <TableHead className="text-center">Remove</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.product?.name ?? `Product #${item.productId}`}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.product?.sku ?? '—'}
                                            </TableCell>
                                            {/* Qty stepper */}
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditCartItem(item.id, (item.quantiy ?? 1) - 1)}
                                                        className="w-6 h-6 rounded border text-sm leading-none hover:bg-muted"
                                                    >−</button>
                                                    <span className="w-6 text-center">{item.quantiy ?? 0}</span>
                                                    <button
                                                        onClick={() => handleEditCartItem(item.id, (item.quantiy ?? 1) + 1)}
                                                        className="w-6 h-6 rounded border text-sm leading-none hover:bg-muted"
                                                    >+</button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency((item.price ?? 0) * (item.quantiy ?? 0))}
                                            </TableCell>
                                            {/* Remove button */}
                                            <TableCell className="text-center">
                                              
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                    title="Remove from refund"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                                 
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    <Separator />

                    {/* Total — cập nhật động theo cartItems */}
                    <div className="flex justify-between text-base font-semibold">
                        <span>Refund Total</span>
                        <span className="text-orange-600">{formatCurrency(refundTotal)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                            onClick={handleConfirmRefund}
                            disabled={cartItems.length === 0}
                        >
                            <RotateCcw size={16} className="mr-2" />
                            Confirm Refund
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog hiển thị sau khi confirm — truyền order đã update + tổng tiền refund */}
            {showDialog && (
                <ReturnRecipetDialog
                    order={order}
                    cartItems={cartItems}
                    refundTotal={refundTotal}
                    onClose={() => {
                        setShowDialog(false);
                        navigate('/cashier/order-history');
                    }}
                />
            )}
        </div>
    );
    
}

export default ReturnItemSection;

