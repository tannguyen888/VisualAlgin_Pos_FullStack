import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;
const PAYMENT_LABEL = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };

const formatTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

function RecentOrdersTable({ summaryData }) {
    const recentOrders = summaryData?.recentOrders ?? [];

    const handleDisplayRecentOrders = recentOrders.map((order, index) => {
        return(
         <TableRow key={`${order.id}-${index}`}>
            <TableCell className="text-muted-foreground">{order.id}</TableCell>
            <TableCell className="text-muted-foreground">{formatTime(order.createdAt)}</TableCell>
            <TableCell className="text-muted-foreground">{PAYMENT_LABEL[order.paymentType] ?? order.paymentType ?? '-'}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
         </TableRow>
        )
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {handleDisplayRecentOrders}
                        {recentOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No recent orders in this shift.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default RecentOrdersTable;