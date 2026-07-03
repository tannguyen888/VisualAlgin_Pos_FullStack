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

const orderItems = [
    { id: 1, name: "Motul 5W-30", sku: "OIL-001", quantity: 2, price: 350000 },
    { id: 2, name: "Bosch Oil Filter", sku: "FIL-001", quantity: 1, price: 85000 },
    { id: 3, name: "NGK Spark Plug", sku: "SPA-001", quantity: 4, price: 45000 },
];

const orderMeta = {
    orderId: "ORD-20260528-009",
    customer: "Tran Minh Khoa",
    cashier: "Nguyen Hoang An",
    discount: 50000,
};

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function PaymentOrderSummary({ orderTotal }) {
    const subtotal = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 text-sm space-y-3">
                <div className="flex justify-between text-muted-foreground">
                    <span>Customer</span>
                    <span className="text-foreground font-medium">{orderMeta.customer}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Cashier</span>
                    <span className="text-foreground">{orderMeta.cashier}</span>
                </div>
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderItems.map((item, index) => (
                            <TableRow key={item.id + '-' + index}>
                                <TableCell>
                                    <div>{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.sku}</div>
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(item.quantity * item.price)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-red-500">− {formatCurrency(orderMeta.discount)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default PaymentOrderSummary;
