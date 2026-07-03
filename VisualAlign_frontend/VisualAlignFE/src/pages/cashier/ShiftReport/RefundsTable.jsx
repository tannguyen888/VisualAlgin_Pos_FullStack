import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function RefundsTable({ summaryData }) {
    const refunds = summaryData?.refunds ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Refunds</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Refund #</TableHead>
                            <TableHead>Order #</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {refunds.map((refund) => (
                            <TableRow key={refund.id}>
                                <TableCell className="text-muted-foreground">RF-{refund.id}</TableCell>
                                <TableCell className="text-muted-foreground">#{refund.orderId ?? refund.order?.id ?? '-'}</TableCell>
                                <TableCell className="text-muted-foreground">{refund.reason ?? '-'}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(Number(refund.amount ?? 0))}</TableCell>
                            </TableRow>
                        ))}
                        {refunds.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No refunds in this shift.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default RefundsTable;