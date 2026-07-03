import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, DownloadIcon, RefreshCw } from 'lucide-react';
import { fetchTotalSales } from '@/services/productionService';
import myDocument from '@/components/PrintForAdmin/myDocument';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/Button';
import { getCurrentUser } from '@/lib/authSession';

const fmt     = (v) => Number(v).toLocaleString('vi-VN') + ' VND';
const fmtNum  = (v) => Number(v).toLocaleString('vi-VN');

function TotalSalePage() {
    const navigate  = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = getCurrentUser();

    const { data: salesData = [], isLoading, isError, dataUpdatedAt } = useQuery({
        queryKey: ['total-sales', currentUser?.storeId, currentUser?.branchId, currentUser?.id],
        queryFn: () =>
            fetchTotalSales({
                storeId: currentUser?.storeId,
                branchId: currentUser?.branchId,
                cashierId: currentUser?.id,
            }),
        enabled: Boolean(currentUser?.id),
    });

    const rows = salesData;

    // Tổng tính từ rows hiện tại 
    const grandTotal = rows.reduce((s, r) => s + (r.totalRevenue ?? 0), 0);
    const grandSold  = rows.reduce((s, r) => s + (r.totalSold  ?? 0), 0);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <BarChart2 size={20} className="text-muted-foreground" />
                    <h1 className="text-xl font-bold">Total Sales Report</h1>

                </div>
               
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—'}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            queryClient.invalidateQueries({ queryKey: ['total-sales', currentUser?.storeId, currentUser?.branchId, currentUser?.id] });
                        }}
                    >
                        <RefreshCw size={14} className="mr-1" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 bg-card space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Units Sold</p>
                    <p className="text-2xl font-bold">{fmtNum(grandSold)}</p>
                </div>
                <div className="rounded-lg border p-4 bg-card space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{fmt(grandTotal)}</p>
                </div>
            </div>

            <Separator />

            {/* States */}
            {isLoading && <p className="text-sm text-muted-foreground py-8 text-center">Loading sales data…</p>}
            {isError   && <p className="text-sm text-red-500 py-8 text-center">Failed to load sales data.</p>}

            {/* Editable table */}
            {!isLoading && !isError && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Units Sold</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell className="text-muted-foreground">{row.sku}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell className="text-right">{fmt(row.sellingPrice)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary">{row.stock}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold">{fmtNum(row.totalSold)}</span>
                                </TableCell>
                                <TableCell className="text-right text-green-700 font-semibold">
                                    {fmt(row.totalRevenue)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
             <div className="flex justify-end m-10-0-0-35">
                     <Button className="pointer-cursor p-2 bg-red-600 hover:bg-red-700 text-white "
                     
                     onClick={() => {
    

   myDocument(rows);


                     }}
                     ><DownloadIcon></DownloadIcon> Print</Button>
                     </div>
        </div>
    );
}

export default TotalSalePage;