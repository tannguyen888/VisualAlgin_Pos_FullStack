import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function CartSummary({ customer, note, subtotal, discount, tax, total }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{customer || 'Walk-in'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Note</span>
                    <span className="italic text-muted-foreground">{note || '—'}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-red-500">− {formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (VAT)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default CartSummary;
