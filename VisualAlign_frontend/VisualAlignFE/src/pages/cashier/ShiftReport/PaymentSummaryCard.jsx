import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowArcRightIcon } from '@phosphor-icons/react';
import { useState } from 'react';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;
const PAYMENT_LABEL = {
    CASH: 'Cash',
    CARD: 'Card',
    UPI: 'E-Transfer',
};

function PaymentSummaryCard({ summaryData }) {
    const paymentSummary = summaryData?.paymentSummary ?? [];
    const totalSales = Number(summaryData?.grossRevenue ?? 0);
    const totalTransactions = paymentSummary.reduce(
        (sum, item) => sum + Number(item.transactionCount ?? 0),
        0
    );
    const [paymentType, setPaymentType] = useState('');

    const handlePaymentHover = (type) => {
        setPaymentType(type);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transaction Count  </span>
                    <Badge variant="outline">{totalTransactions}</Badge>
                </div>
                {paymentSummary.map((item) => {
                    const key = item.type ?? 'UNKNOWN';
                    const amount = Number(item.totalAmount ?? 0);
                    const rate = totalSales > 0 ? (amount / totalSales) * 100 : 0;

                    return (
                        <div key={key} className="flex justify-between items-center">
                            <span
                                onMouseEnter={() => handlePaymentHover(key)}
                                onMouseLeave={() => handlePaymentHover('')}
                                className={`text-muted-foreground ${paymentType === key ? 'text-red-500' : ''}`}
                            >
                                {PAYMENT_LABEL[key] ?? key}
                                <span className="font-thin inline-flex items-center ml-1">
                                    <ArrowArcRightIcon />
                                    Transaction Rate: {rate.toFixed(2)}%
                                </span>
                            </span>

                            <Badge variant="outline">{formatCurrency(amount)}</Badge>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default PaymentSummaryCard;