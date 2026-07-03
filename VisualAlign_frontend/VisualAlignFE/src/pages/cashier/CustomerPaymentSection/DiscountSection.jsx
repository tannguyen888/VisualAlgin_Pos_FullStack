import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Button from '@/components/Button';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

const DISCOUNT_CODES = {
    'MEMBER10': 10,   // 10% off
    'VIP20':    20,   // 20% off
    'LOYAL50K': null, // flat 50,000
};

function DiscountSection({ subtotal, discount, onDiscountChange }) {
    const [code, setCode] = useState('');
    const [applied, setApplied] = useState('');
    const [error, setError] = useState('');
    const [manualDiscount, setManualDiscount] = useState(discount);

    const handleApplyCode = () => {
        const upper = code.trim().toUpperCase();
        if (upper === 'MEMBER10') {
            const d = Math.round(subtotal * 0.10);
            onDiscountChange(d);
            setApplied(`MEMBER10 (10%) — ${formatCurrency(d)}`);
            setError('');
        } else if (upper === 'VIP20') {
            const d = Math.round(subtotal * 0.20);
            onDiscountChange(d);
            setApplied(`VIP20 (20%) — ${formatCurrency(d)}`);
            setError('');
        } else if (upper === 'LOYAL50K') {
            onDiscountChange(50000);
            setApplied('LOYAL50K — 50,000 VND flat');
            setError('');
        } else {
            setError('Invalid discount code');
            setApplied('');
        }
    };

    const handleManualChange = (val) => {
        const n = Math.max(0, Math.min(subtotal, Number(val) || 0));
        setManualDiscount(n);
        onDiscountChange(n);
        setApplied('');
        setCode('');
        setError('');
    };

    const handleClear = () => {
        onDiscountChange(0);
        setManualDiscount(0);
        setCode('');
        setApplied('');
        setError('');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Discount</CardTitle>
                    {discount > 0 && (
                        <Badge variant="secondary">− {formatCurrency(discount)}</Badge>
                    )}
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3 text-sm">
                {/* Discount code */}
                <div>
                    <label className="text-muted-foreground block mb-1">Discount Code</label>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-1.5 text-sm bg-background outline-none focus:ring-1 focus:ring-ring uppercase"
                            placeholder="e.g. MEMBER10"
                            value={code}
                            onChange={e => { setCode(e.target.value); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleApplyCode()}
                        />
                        <Button size="sm" onClick={handleApplyCode}>Apply</Button>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    {applied && <p className="text-green-600 text-xs mt-1">✓ {applied}</p>}
                </div>

                <Separator />

                {/* Manual discount */}
                <div>
                    <label className="text-muted-foreground block mb-1">Manual Discount (VND)</label>
                    <input
                        type="number"
                        className="w-full border rounded px-3 py-1.5 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
                        value={manualDiscount}
                        onChange={e => handleManualChange(e.target.value)}
                        min={0}
                        step={10000}
                    />
                </div>

                {discount > 0 && (
                    /* Important — red */
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleClear}
                    >
                        Remove Discount
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default DiscountSection;
