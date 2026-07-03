import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function TopSellingItem({ summaryData }) {
    const topSellingProducts = summaryData?.topSellingProducts ?? [];

    const handleDisplayProductDetails = topSellingProducts.map((product, index) => {
        return (
            <TableRow key={`${product.name}-${index}`}>
                <TableCell>{index+1}| {product.name}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.sellingPrice)}</TableCell>
            </TableRow>
          
        )
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Unit Sold</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {handleDisplayProductDetails}
                      {topSellingProducts.length === 0 && (
                          <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground">
                                  No sales data in this shift.
                              </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default TopSellingItem;