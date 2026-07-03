import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const methodConfig = {
    CASH: { label: "Cash", desc: "Pay with cash at counter", color: "bg-green-500/10 border-green-500 text-green-600" },
    CARD: { label: "Card", desc: "Credit / debit card (POS terminal)", color: "bg-blue-500/10 border-blue-500 text-blue-600" },
    UPI: { label: "E-Transfer", desc: "QR Code / Online banking", color: "bg-purple-500/10 border-purple-500 text-purple-600" },
};

function PaymentMethodSelector({ methods, selected, onSelect }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3 text-sm">
                {methods.map(method => {
                    const cfg = methodConfig[method];
                    const isSelected = selected === method;
                    return (
                        <div
                            key={method}
                            onClick={() => onSelect(method)}
                            className={`flex items-center justify-between px-4 py-3 rounded border-2 cursor-pointer transition-all ${
                                isSelected ? cfg.color : 'border-border hover:bg-muted/40'
                            }`}
                        >
                            <div>
                                <div className="font-semibold">{cfg.label}</div>
                                <div className="text-xs text-muted-foreground">{cfg.desc}</div>
                            </div>
                            {isSelected && (
                                <Badge variant="outline" className="ml-2 shrink-0">Selected</Badge>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default PaymentMethodSelector;
