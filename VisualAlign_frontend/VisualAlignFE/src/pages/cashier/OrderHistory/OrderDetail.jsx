import { Badge } from '@/components/ui/badge';
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
import PrintReceipt from '@/components/PrintRecipt';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import InstructionHover from './InstructionHover';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';


const PAYMENT_LABELS = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };
const PAYMENT_VARIANT = { CASH: 'secondary', CARD: 'default', UPI: 'outline' };

const formatCurrency = (value) =>
    value != null ? `${Number(value).toLocaleString('vi-VN')} VND` : '—';

const formatDateTime = (createdAt) => {
    if (!createdAt) return '—';
    const d = new Date(createdAt);
    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * OrderDetail — full breakdown of a single order (right panel).
 *
 * Props:
 *   order {OrderDto | null}
 *
 * OrderDto shape (mirrors backend):
 *   {
 *     id, totalAmount, createdAt, paymentType,
 *     customer: { id, firstName, email, phone },
 *     cashier:  { id, fullName, email, role },       ← UserDto
 *     branch:   { id, name },                         ← BranchDto
 *     orderItems: [
 *       { id, quantiy, price, productId, orderId,    ← "quantiy" = backend typo, kept as-is
 *         product: { id, name, sku, sellingPrice } }  ← ProductDto
 *     ]
 *   }
 */
function OrderDetail({ order }) {
    const navigate = useNavigate();
    const [showPrint, setShowPrint] = useState(false);

    if (!order) {
        return (
            <Card className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Select an order to view details.
                </p>
            </Card>
        );
    }

    const subtotal =
        order.orderItems?.reduce(
            (sum, item) => sum + (item.price ?? 0) * (item.quantiy ?? 0),
            0
        ) ?? 0;

    return (
        <>
        <Card>
            {/* ── Header ── */}
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Order #{order.id} 
                      <InstructionHover/>
                      <Button
                      onClick={() => setShowPrint(true)}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Print Invoice
                      </Button>
                      <Button
                        onClick={() => navigate('/cashier/refund' , { state: { order } })}
                        className="ml-2 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <RotateCcw size={14} className="mr-1" />
                        Refund
                      </Button>
                    </CardTitle>
                    <Badge variant={PAYMENT_VARIANT[order.paymentType]}>
                        {PAYMENT_LABELS[order.paymentType] ?? order.paymentType}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                </p>
            </CardHeader>
            <Separator />

            <CardContent className="space-y-4 pt-4 text-sm">
                {/* ── Customer + Cashier ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Customer
                        </p>
                        <p className="font-medium">{order.customer?.firstName ?? '—'}</p>
                        <p className="text-muted-foreground">{order.customer?.phone ?? '—'}</p>
                        <p className="text-muted-foreground">{order.customer?.email ?? '—'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Cashier
                        </p>
                        <p className="font-medium">{order.cashier?.fullName ?? '—'}</p>
                        <p className="text-muted-foreground">{order.cashier?.email ?? '—'}</p>
                        {order.branch && (
                            <p className="text-muted-foreground">
                                Branch: {order.branch.name ?? `#${order.branch.id}`}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* ── Order Items ── */}
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                        Items
                    </p>
                    {!order.orderItems || order.orderItems.length === 0 ? (
                        <p className="py-4 text-center text-muted-foreground">
                            No items in this order.
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.orderItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.product?.name ?? `Product #${item.productId}`}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.product?.sku ?? '—'}
                                        </TableCell>
                                        {/* Note: field is "quantiy" (backend typo) */}
                                        <TableCell className="text-center">
                                            {item.quantiy ?? 0}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(item.price)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(
                                                (item.price ?? 0) * (item.quantiy ?? 0)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <Separator />

                {/* ── Totals ── */}
                <div className="space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Modal Print Receipt — chỉ mở khi bấm Print Invoice */}
        {showPrint && createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-base">Print Invoice — Order #{order.id}</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPrint(false)}
                        >
                            ✕
                        </Button>
                    </div>
                    <PrintReceipt order={order} discount={0} change={0} />
                </div>
            </div>,
            document.body
        )}
        </>
    );
}

export default OrderDetail;
