import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function CartItemList({ cartItems, onQtyChange, onRemove }) {

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Cart</CardTitle>
                    <Badge variant="secondary">{cartItems.length} items</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-1 text-sm">
                {cartItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No items in cart</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={item.id + '-' + index} className="flex justify-between items-center border-b pb-3 last:border-0 pt-1">
                            <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.sku} · {formatCurrency(item.price)}/unit</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                <button
                                    onClick={() => onQtyChange(item.id, -1)}
                                    className="w-6 h-6 rounded border text-center text-base leading-none hover:bg-muted"
                                >
                                    −
                                </button>
                                <span className="w-5 text-center font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => onQtyChange(item.id, 1)}
                                    className="w-6 h-6 rounded border text-center text-base leading-none hover:bg-muted"
                                >
                                    +
                                </button>
                                <span className="w-28 text-right font-semibold">
                                    {formatCurrency(item.quantity * item.price)}
                                </span>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-destructive text-xs hover:underline ml-1"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default CartItemList;
