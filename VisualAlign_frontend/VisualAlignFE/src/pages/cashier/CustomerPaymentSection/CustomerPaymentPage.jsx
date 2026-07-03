import PaymentOrderSummary from "./PaymentOrderSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentCalculator from "./PaymentCalculator";
import PaymentConfirmButton from "./PaymentConfirmButton";
import { useState } from 'react';

const ORDER_TOTAL = 910000;
const PAYMENT_METHODS = ["CASH", "CARD", "UPI"];

function CustomerPaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [cashTendered, setCashTendered] = useState(1000000);

    const change = paymentMethod === "CASH" ? Math.max(0, cashTendered - ORDER_TOTAL) : 0;

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b bg-card">
                <h1 className="text-xl font-bold">Order Payment</h1>
                <p className="text-sm text-muted-foreground">ORD-20260528-009 · Tran Minh Khoa</p>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <PaymentOrderSummary orderTotal={ORDER_TOTAL} />
                    <PaymentMethodSelector
                        methods={PAYMENT_METHODS}
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PaymentCalculator
                        orderTotal={ORDER_TOTAL}
                        paymentMethod={paymentMethod}
                        cashTendered={cashTendered}
                        onCashChange={setCashTendered}
                        change={change}
                    />
                    <PaymentConfirmButton
                        orderTotal={ORDER_TOTAL}
                        paymentMethod={paymentMethod}
                        change={change}
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomerPaymentPage;
