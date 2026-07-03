import { useState } from 'react';
import { createPortal } from 'react-dom';
import PrintReceipt from '@/components/PrintRecipt';
import Button from '@/components/Button';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (v) =>
    v != null ? `${Number(v).toLocaleString('vi-VN')} VND` : '—';

/**
 * ReturnRecipetDialog — dialog xác nhận refund thành công + in receipt.
 *
 * Props:
 *   order       {OrderDto}   — order gốc
 *   cartItems   {array}      — items đã được chọn refund (sau khi user chỉnh)
 *   refundTotal {number}     — tổng tiền hoàn
 *   onClose     {function}   — đóng dialog (navigate về order-history)
 */
function ReturnRecipetDialog({ order, cartItems, refundTotal, onClose }) {
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    if (!order) return null;

    // Tạo object order đã update (chỉ chứa items được refund) để truyền vào triggerPrint
    const refundOrder = {
        ...order,
        orderItems: cartItems,
        totalAmount: refundTotal,
    };

    const handleOpenPrintPreview = () => {
        setShowPrintPreview(true);
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

                {/* Success icon */}
                <p className="flex justify-center items-center text-5xl mb-2">✓</p>
                <h2 className="text-xl font-bold text-center mb-1">Refund Confirmed</h2>
                <p className="text-sm text-gray-500 text-center mb-4">Order #{order.id}</p>

                <Separator className="mb-4" />

                {/* Items being refunded */}
                <div className="space-y-1 mb-4 text-sm">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <span className="text-gray-700">
                                {item.product?.name ?? `Product #${item.productId}`}
                                <span className="text-gray-400 ml-1">x{item.quantiy ?? 0}</span>
                            </span>
                            <span className="font-medium">
                                {formatCurrency((item.price ?? 0) * (item.quantiy ?? 0))}
                            </span>
                        </div>
                    ))}
                </div>

                <Separator className="mb-4" />

                {/* Refund total */}
                <div className="flex justify-between text-base font-semibold mb-6">
                    <span>Refund Total</span>
                    <span className="text-orange-600">{formatCurrency(refundTotal)}</span>
                </div>

                {/* Actions */}
                {showPrintPreview ? (
                    <div className="space-y-3">
                        <PrintReceipt order={refundOrder} discount={0} change={0} />
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowPrintPreview(false)}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                                onClick={onClose}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleOpenPrintPreview}
                        >
                            Print Receipt
                        </Button>
                        <Button
                            className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                            onClick={onClose}
                        >
                            Done
                        </Button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default ReturnRecipetDialog;