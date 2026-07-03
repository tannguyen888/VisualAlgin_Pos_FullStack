import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getOrdersByCustomerId } from '@/services/orderService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const paymentLabels = {
    CASH: "Cash",
    CARD: "Card",
    UPI: "E-Transfer",
};

const paymentVariant = {
    CASH: "secondary",
    CARD: "default",
    UPI: "outline",
};

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;
const formatDateTime = (iso) => {
    if (!iso) return { date: '-', time: '-' };
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('en-GB'),
        time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
};

function CustomerOrderHistory({ customerId, customerName }) {
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders-by-customer', customerId],
        queryFn: () => getOrdersByCustomerId(customerId),
        enabled: Boolean(customerId),
    });

    if (!customerId) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Order History</CardTitle>
                        <Badge variant="secondary">0 orders</Badge>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 text-sm">
                    <p className="text-center text-muted-foreground py-6">
                        No customer selected.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Order History</CardTitle>
                    <Badge variant="secondary">{orders.length} orders</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 text-sm">
                {isLoading && (
                    <p className="text-center text-muted-foreground py-3">Loading orders...</p>
                )}
                {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">
                        {customerName} has no orders yet
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => {
                                const { date, time } = formatDateTime(order.createdAt);

                                return (
                                    <TableRow key={order.id + '-' + index}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell className="text-muted-foreground">{date} {time}</TableCell>
                                        <TableCell>
                                            <Badge variant={paymentVariant[order.paymentType] ?? 'outline'}>
                                                {paymentLabels[order.paymentType] ?? order.paymentType ?? 'Unknown'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(order.totalAmount ?? 0)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default CustomerOrderHistory;
