import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/Button';

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v) => (v != null ? `${Number(v).toLocaleString('vi-VN')} VND` : '—');

const fmtDate = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const PAYMENT_LABELS = { CASH: 'Cash', CARD: 'Card', UPI: 'E-Transfer' };

/**
 * Normalise order data so PrintReceipt works with both:
 *  - Frontend cart shape  { items[].{name, quantity, price} }
 *  - Backend OrderDto     { orderItems[].{product.name, quantiy, price} }  ← "quantiy" is backend typo
 */
const normalise = (order) => {
    const rawItems = order.orderItems || order.items || [];
    return {
        id:          order.id,
        totalAmount: order.totalAmount ?? order.total ?? 0,
        createdAt:   order.createdAt,
        paymentType: order.paymentType || order.paymentMethod || 'CASH',
        customer:    order.customer,
        cashier:     order.cashier,
        items: rawItems.map((item) => ({
            id:    item.id,
            name:  item.product?.name || item.name || `Item #${item.id}`,
            sku:   item.product?.sku  || '',
            qty:   item.quantiy ?? item.quantity ?? 0,   // backend typo kept
            price: item.price ?? 0,
        })),
    };
};

// ─── print window ───────────────────────────────────────────────────────────

/**
 * Opens a minimal browser print window (printer + "Save as PDF" both work).
 * Exported so PaymentDialog can call it directly.
 */
export function triggerPrint(order, { discount = 0, change = 0 } = {}) {
    const o       = normalise(order);
    const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    const payLabel = PAYMENT_LABELS[o.paymentType] ?? o.paymentType;
    const dateStr  = fmtDate(o.createdAt);

    const rows = o.items.map((i) => `
        <tr>
            <td style="padding:2px 4px">${i.name}${i.sku ? ` (${i.sku})` : ''}</td>
            <td style="text-align:center;padding:2px 4px">${i.qty}</td>
            <td style="text-align:right;padding:2px 4px">${Number(i.price).toLocaleString('vi-VN')}</td>
            <td style="text-align:right;padding:2px 4px">${Number(i.price * i.qty).toLocaleString('vi-VN')}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Receipt #${o.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    width: 80mm;
    margin: 0 auto;
    padding: 12px 8px;
    color: #000;
  }
  .center { text-align: center; }
  .bold   { font-weight: bold; }
  .divider{ border-top: 1px dashed #000; margin: 6px 0; }
  table   { width: 100%; border-collapse: collapse; font-size: 11px; }
  th      { text-align: left; padding: 2px 4px; border-bottom: 1px solid #000; }
  .row-total { border-top: 1px solid #000; }
  .summary-row { display: flex; justify-content: space-between; margin: 2px 0; }
  .total-row   { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin: 4px 0; }
  .footer      { margin-top: 10px; text-align: center; font-size: 10px; line-height: 1.5; }
  @media print {
    @page { margin: 0; size: 80mm auto; }
    body  { width: 80mm; }
  }
</style>
</head>
<body>
  <div class="center bold" style="font-size:16px;letter-spacing:2px">VISUALALIGN</div>
  <div class="center" style="font-size:10px;margin-bottom:4px">Simlicity POS</div>
  <div class="divider"></div>

  <div class="summary-row"><span>Order #</span><span>${o.id}</span></div>
  <div class="summary-row"><span>Date</span><span>${dateStr}</span></div>
  ${o.customer ? `<div class="summary-row"><span>Customer</span><span>${o.customer.firstName}</span></div>` : ''}
  ${o.cashier  ? `<div class="summary-row"><span>Cashier</span><span>${o.cashier.fullName}</span></div>` : ''}

  <div class="divider"></div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="divider"></div>

  <div class="summary-row"><span>Subtotal</span><span>${Number(subtotal).toLocaleString('vi-VN')} VND</span></div>
  ${discount > 0 ? `<div class="summary-row"><span>Discount</span><span>- ${Number(discount).toLocaleString('vi-VN')} VND</span></div>` : ''}
  <div class="total-row"><span>TOTAL</span><span>${Number(o.totalAmount).toLocaleString('vi-VN')} VND</span></div>

  <div class="divider"></div>

  <div class="summary-row"><span>Payment</span><span>${payLabel}</span></div>
  ${o.paymentType === 'CASH' && change > 0 ? `<div class="summary-row"><span>Change</span><span>${Number(change).toLocaleString('vi-VN')} VND</span></div>` : ''}

  <div class="footer">
    <div class="divider"></div>
    <p>Thank you for your purchase!</p>
    <p>Return / refund within 30 days.</p>
    <p>Check policies at visualalign.com</p>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=480,height=640,scrollbars=yes');
    if (!win) return; // blocked by popup blocker
    win.document.write(html);
    win.document.close();
    win.focus();
    // small delay to let styles render before print dialog opens
    setTimeout(() => { win.print(); }, 300);
}

// ─── component ──────────────────────────────────────────────────────────────

/**
 * PrintReceipt — receipt preview card with Print and Export PDF buttons.
 *
 * Props
 *   order    {OrderDto | CartOrder}  — backend or frontend cart shape (auto-normalised)
 *   discount {number}
 *   change   {number}                — cash change amount
 */
function PrintReceipt({ order, discount = 0, change = 0 }) {
    const receiptRef = useRef(null);

    if (!order) {
        return (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                No order data to display.
            </div>
        );
    }

    const o        = normalise(order);
    const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    const payLabel = PAYMENT_LABELS[o.paymentType] ?? o.paymentType;

    return (
        <div className="space-y-4">
            {/* ── Action buttons ── */}
            <div className="flex gap-2 no-print">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerPrint(order, { discount, change })}
                >
                     Print Receipt
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerPrint(order, { discount, change })}
                >
                     Export PDF
                </Button>
                <span className="text-xs text-muted-foreground self-center">
                    (Select "Save as PDF" in the print dialog)
                </span>
            </div>

            {/* ── Receipt preview ── */}
            <div
                ref={receiptRef}
                className="font-mono text-xs border rounded-lg p-4 bg-white text-black w-full max-w-xs mx-auto space-y-2 shadow-sm"
            >
                {/* Header */}
                <div className="text-center space-y-0.5">
                    <p className="text-base font-bold tracking-widest">VISUALALIGN</p>
                    <p className="text-[10px]"> Simplicity POS</p>
                </div>

                <Separator className="bg-black/20" />

                {/* Meta */}
                <div className="space-y-0.5">
                    <div className="flex justify-between"><span>Order #</span><span className="font-semibold">{o.id}</span></div>
                    <div className="flex justify-between"><span>Date</span><span>{fmtDate(o.createdAt)}</span></div>
                    {o.customer && <div className="flex justify-between"><span>Customer</span><span>{o.customer.firstName}</span></div>}
                    {o.cashier  && <div className="flex justify-between"><span>Cashier</span><span>{o.cashier.fullName}</span></div>}
                </div>

                <Separator className="bg-black/20" />

                {/* Items */}
                <div className="space-y-1">
                    <div className="flex justify-between font-semibold border-b border-black/20 pb-0.5">
                        <span className="flex-1">Item</span>
                        <span className="w-6 text-center">Qty</span>
                        <span className="w-20 text-right">Total</span>
                    </div>
                    {o.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <span className="flex-1 truncate pr-1">{item.name}</span>
                            <span className="w-6 text-center">{item.qty}</span>
                            <span className="w-20 text-right">{Number(item.price * item.qty).toLocaleString('vi-VN')}</span>
                        </div>
                    ))}
                </div>

                <Separator className="bg-black/20" />

                {/* Totals */}
                <div className="space-y-0.5">
                    <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                    {discount > 0 && <div className="flex justify-between"><span>Discount</span><span>− {fmt(discount)}</span></div>}
                    <div className="flex justify-between font-bold text-sm pt-0.5 border-t border-black/20">
                        <span>TOTAL</span><span>{fmt(o.totalAmount)}</span>
                    </div>
                </div>

                <Separator className="bg-black/20" />

                {/* Payment */}
                <div className="space-y-0.5">
                    <div className="flex justify-between"><span>Payment</span>
                        <Badge variant="outline" className="text-[10px] h-4">{payLabel}</Badge>
                    </div>
                    {o.paymentType === 'CASH' && change > 0 && (
                        <div className="flex justify-between"><span>Change</span><span className="text-green-700 font-semibold">{fmt(change)}</span></div>
                    )}
                </div>

                <Separator className="bg-black/20" />

                {/* Footer */}
                <div className="text-center space-y-0.5 text-[10px]">
                    <p>Thank you for your purchase!</p>
                    <p>Return / refund within 30 days.</p>
                </div>
            </div>
        </div>
    );
}

export default PrintReceipt;