import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const quickAmounts = [500000, 1000000, 2000000, 5000000];

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function PaymentCalculator({ orderTotal, paymentMethod, cashTendered, onCashChange, change }) {
    const isCash = paymentMethod === "CASH";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Calculator</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Due</span>
                    <span className="font-bold text-base">{formatCurrency(orderTotal)}</span>
                </div>

                {isCash ? (
                    <>
                        <Separator />
                        <div>
                            <label className="text-muted-foreground block mb-1">Cash Tendered</label>
                            <input
                                type="number"
                                className="w-full border rounded px-3 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
                                value={cashTendered}
                                onChange={e => onCashChange(Number(e.target.value))}
                                min={0}
                                step={10000}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {quickAmounts.map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => onCashChange(amount)}
                                    className={`px-3 py-1.5 rounded border text-xs hover:bg-muted transition-colors ${
                                        cashTendered === amount ? 'bg-primary text-primary-foreground border-primary' : ''
                                    }`}
                                >
                                    {formatCurrency(amount)}
                                </button>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Change</span>
                            <Badge
                                variant={change >= 0 ? 'default' : 'destructive'}
                                className="text-sm px-3 py-1"
                            >
                                {change >= 0 ? formatCurrency(change) : "Insufficient"}
                            </Badge>
                        </div>
                    </>
                ) : (
                    <div className="py-4 text-center text-muted-foreground">
                        {paymentMethod === "CARD" ? "Swipe / tap card on POS terminal" : "Customer transfers via QR Code / bank account"}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PaymentCalculator;
