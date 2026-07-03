import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

// products và onAddProduct được truyền từ CartPage
// - products: danh sách sản phẩm (từ useQuery trong CartPage)
// - onAddProduct: thêm 1 sản phẩm vào giỏ hàng
function ProductListPanel({ products = [], onAddProduct }) {
    const [search, setSearch] = useState("");

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product List</CardTitle>
                <input
                    className="mt-2 w-full border rounded px-3 py-1.5 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Search by name, SKU or brand..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-1 text-sm max-h-[480px] overflow-y-auto">
                {products.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No products found.</p>
                )}
                {filtered.map((product, index) => (
                    <div
                        key={product.id + '-' + index}
                        className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-muted/40 rounded px-2 cursor-pointer"
                        onClick={() => onAddProduct(product)}
                    >
                        <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {product.sku} · {product.brand} · {product.category}
                            </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                            <div className="font-semibold">{formatCurrency(product.sellingPrice)}</div>
                            <Badge variant="outline" className="text-xs">Stock: {product.stock}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default ProductListPanel;
