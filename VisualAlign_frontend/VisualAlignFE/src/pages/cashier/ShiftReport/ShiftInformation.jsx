import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function formatDateTime(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString('en-GB');
}

function ShiftInformation({ summaryData }) {
    const shift = summaryData?.shift;
    const cashierName = shift?.cashier?.fullName ?? 'Unknown Cashier';
    const branchName = shift?.branch?.name ?? (shift?.branchId ? `Branch #${shift.branchId}` : '-');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shift Information</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Cashier</span>
                    <span className="font-medium">{cashierName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{branchName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time</span>
                    <span className="font-medium">{formatDateTime(shift?.shiftStart)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">End Time</span>
                    <span className="font-medium">{formatDateTime(shift?.shiftEnd)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{summaryData?.latestShiftDuration ?? '-'}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default ShiftInformation;