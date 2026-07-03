
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
import { Button } from '@/components/ui/button';

// Maps backend PaymentType enum → display label / badge variant
const PAYMENT_LABELS = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };
const PAYMENT_VARIANT = { CASH: 'secondary', CARD: 'default', UPI: 'outline' };

const formatCurrency = (value) =>
    value != null ? `${Number(value).toLocaleString('vi-VN')} VND` : '—';

// createdAt comes from backend as LocalDateTime → ISO string e.g. "2026-05-20T09:15:00"
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
 * OrderTable — list of orders (left panel).
 *
 * Props:
 *   orders          {OrderDto[]}             — from GET /api/orders
 *   selectedOrderId {number | null}          — highlighted row
 *   onSelectOrder   {(order: OrderDto) => void}
 *
 * OrderDto shape (mirrors backend):
 *   { id, totalAmount, createdAt, paymentType, customer: { id, firstName, phone }, cashier, branch, orderItems }
 */
function OrderTable({ orders = [], selectedOrderId, onSelectOrder, buttonAction }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Order History</CardTitle>
                    <Badge variant="secondary">{orders.length} orders</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 text-sm">
                {orders.length === 0 ? (
                    <p className="py-6 text-center text-muted-foreground">No orders found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Payment</TableHead>
                               
                                <TableHead className="text-right">Total</TableHead>
                               {buttonAction != null && <TableHead>Action</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className={`cursor-pointer transition-colors ${
                                        selectedOrderId === order.id
                                            ? 'bg-muted'
                                            : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => onSelectOrder(order)}
                                >
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDateTime(order.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        {order.customer?.firstName ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={PAYMENT_VARIANT[order.paymentType]}>
                                            {PAYMENT_LABELS[order.paymentType] ?? order.paymentType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(order.totalAmount)}
                                    </TableCell>
                                    <TableCell>
                                       {buttonAction != null && (
                                           <Button
                                               onClick={() => buttonAction === 'refund' && onSelectOrder(order)}
                                               variant="outline"
                                               size="sm"
                                           >
                                               Refund
                                           </Button>
                                       )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default OrderTable;
