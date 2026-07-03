import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/Button';
import { triggerPrint } from '@/components/PrintRecipt';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { applyOrderSale } from '@/services/productionService';
import { createOrder } from '@/services/orderService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

const METHOD_LABELS = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };

function PaymentDialog({ order, customer, total, discount, paymentMethod, change, onClose, onCompleted }) {
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const subtotal = order.items.reduce((s, i) => s + i.quantity * i.price, 0);

    const handleConfirmComplete = async () => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const orderPayload = {
                totalAmount: total,
                paymentType: paymentMethod,
                customerId: customer?.id ?? null,
                orderItems: order.items.map((item) => ({
                    productId: item.productId ?? item.id,
                    quantiy: item.quantity,
                    price: item.price,
                })),
            };

            await createOrder(orderPayload);

            // Hoàn tất đơn: cập nhật stock + totalSold theo order.items
            await applyOrderSale(order.items);

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['total-sales'] }),
            ]);

            setDone(true);
        } catch (error) {
            console.error('Failed to complete payment:', error);
            alert('Không thể hoàn tất thanh toán. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };


    if (done) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-background rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 text-center space-y-4">
                    <div className="text-4xl">✓</div>
                    <h2 className="text-xl font-bold">Payment Complete</h2>
                    <p className="text-muted-foreground text-sm">{order.id}</p>
                    <Separator />
                    <div className="text-left space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Paid</span>
                            <span className="font-bold">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Method</span>
                            <Badge>{METHOD_LABELS[paymentMethod]}</Badge>
                        </div>
                        {paymentMethod === 'CASH' && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Change</span>
                                <span className="font-semibold text-green-600">{formatCurrency(change)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => triggerPrint(order, { discount, change })}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                        >
                             Print Receipt
                        </Button>
                        {/* Important — red */}
                        <Button
                            size="sm"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={onCompleted ?? onClose}
                        >
                            New Order
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-base font-bold">Confirm Payment</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
                </div>

                <div className="p-5 space-y-4 text-sm">
                    {/* Customer */}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer</span>
                        <span className="font-medium">{customer ? customer.firstName : 'Walk-in'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID</span>
                        <span>{order.id}</span>
                    </div>

                    <Separator />

                    {/* Items */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={item.id + '-' + index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Separator />

                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-red-500">− {formatCurrency(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <Badge variant="outline">{METHOD_LABELS[paymentMethod]}</Badge>
                        </div>
                        {paymentMethod === 'CASH' && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Change</span>
                                <span className="font-semibold text-green-600">{formatCurrency(change)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 px-5 py-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
                    {/* Important — red */}
                    <Button
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleConfirmComplete}
                        disabled={submitting}
                    >
                        {submitting ? 'Processing...' : 'Confirm & Complete'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PaymentDialog;
