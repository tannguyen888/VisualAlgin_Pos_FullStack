import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/Button';
import { useState } from 'react';

const methodLabels = {
    CASH: "Cash",
    CARD: "Card",
    UPI: "E-Transfer",
};

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function PaymentConfirmButton({ orderTotal, paymentMethod, change }) {
    const [confirmed, setConfirmed] = useState(false);

    const canConfirm = paymentMethod !== "CASH" || change >= 0;

    const handleConfirm = () => {
        if (!canConfirm) return;
        setConfirmed(true);
    };

    if (confirmed) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment Successful</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">{formatCurrency(orderTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <Badge>{methodLabels[paymentMethod]}</Badge>
                    </div>
                    {paymentMethod === "CASH" && (
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Change</span>
                            <span className="font-semibold text-green-600">{formatCurrency(change)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">Print Receipt</Button>
                        <Button size="sm" className="flex-1">New Order</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Confirm Payment</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold text-base">{formatCurrency(orderTotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <Badge variant="outline">{methodLabels[paymentMethod]}</Badge>
                </div>
                {paymentMethod === "CASH" && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Change</span>
                        <span className={change >= 0 ? "text-green-600 font-semibold" : "text-destructive font-semibold"}>
                            {change >= 0 ? formatCurrency(change) : "Insufficient"}
                        </span>
                    </div>
                )}
                <Separator />
                <Button
                    size="lg"
                    className="w-full mt-2"
                    disabled={!canConfirm}
                    onClick={handleConfirm}
                >
                    Confirm Payment
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                    Cancel
                </Button>
            </CardContent>
        </Card>
    );
}

export default PaymentConfirmButton;
