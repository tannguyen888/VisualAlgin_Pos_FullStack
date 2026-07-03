import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function SalesSummaryCard({ summaryData }) {
    const salesData = {
        totalOrders: Number(summaryData?.totalOrders ?? 0),
        grossRevenue: Number(summaryData?.grossRevenue ?? 0),
        totalRefunds: Number(summaryData?.totalRefunds ?? 0),
        discounts: Number(summaryData?.discounts ?? 0),
    };

    const netSales = salesData.grossRevenue - salesData.totalRefunds - salesData.discounts;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium">{salesData.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Revenue</span>
                    <span className="font-medium">{formatCurrency(salesData.grossRevenue)}</span>
                </div>
                
                <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Refunds</span>
                    <span className="font-medium">{formatCurrency(salesData.totalRefunds)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Discounts</span>
                    <span className="font-medium">{formatCurrency(salesData.discounts)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Sales</span>
                    <span className="font-bold text-base">{formatCurrency(netSales)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default SalesSummaryCard;