import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/Button';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

const METHODS = [
    { key: 'CASH', label: 'Cash', desc: 'Pay with cash at counter', color: 'border-green-500 bg-green-500/10 text-green-600' },
    { key: 'CARD', label: 'Card', desc: 'Credit / debit (POS terminal)', color: 'border-blue-500 bg-blue-500/10 text-blue-600' },
    { key: 'UPI',  label: 'E-Transfer', desc: 'QR Code / Online banking',   color: 'border-purple-500 bg-purple-500/10 text-purple-600' },
];

const QUICK_AMOUNTS = [500000, 1000000, 2000000, 5000000];

function PaymentSection({ total, paymentMethod, onMethodChange, cashTendered, onCashChange, change, canPay, onPay }) {
    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Payment</CardTitle>
                    <Badge variant="secondary">{formatCurrency(total)}</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-4 text-sm">
                {/* Method selector */}
                <div className="space-y-2">
                    {METHODS.map(m => (
                        <div
                            key={m.key}
                            onClick={() => onMethodChange(m.key)}
                            className={`flex items-center justify-between px-4 py-3 rounded border-2 cursor-pointer transition-all ${
                                paymentMethod === m.key ? m.color : 'border-border hover:bg-muted/40'
                            }`}
                        >
                            <div>
                                <div className="font-semibold">{m.label}</div>
                                <div className="text-xs text-muted-foreground">{m.desc}</div>
                            </div>
                            {paymentMethod === m.key && (
                                <Badge variant="outline" className="shrink-0 ml-2">Selected</Badge>
                            )}
                        </div>
                    ))}
                </div>

                {/* Cash calculator */}
                {paymentMethod === 'CASH' && (
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
                            {QUICK_AMOUNTS.map(a => (
                                <button
                                    key={a}
                                    onClick={() => onCashChange(a)}
                                    className={`px-3 py-1.5 rounded border text-xs hover:bg-muted transition-colors ${
                                        cashTendered === a ? 'bg-primary text-primary-foreground border-primary' : ''
                                    }`}
                                >
                                    {formatCurrency(a)}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Change</span>
                            <Badge
                                variant={change >= 0 ? 'default' : 'destructive'}
                                className="text-sm px-3 py-1"
                            >
                                {change >= 0 ? formatCurrency(change) : 'Insufficient'}
                            </Badge>
                        </div>
                    </>
                )}

                {paymentMethod !== 'CASH' && (
                    <p className="text-center text-muted-foreground py-2 text-xs">
                        {paymentMethod === 'CARD'
                            ? 'Swipe / tap card on POS terminal'
                            : 'Customer transfers via QR Code / bank account'}
                    </p>
                )}

                <Separator />

                {/* Summary */}
                <div className="space-y-1">
                    <div className="flex justify-between font-bold text-base">
                        <span>Total Due</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Important — red */}
                <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                    disabled={!canPay}
                    onClick={onPay}
                >
                    Process Payment
                </Button>
            </CardContent>
        </Card>
    );
}

export default PaymentSection;
