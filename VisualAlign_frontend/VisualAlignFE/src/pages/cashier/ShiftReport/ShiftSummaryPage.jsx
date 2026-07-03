import { useQuery } from '@tanstack/react-query';
import ShiftReportHeader from "./ShiftReportHeader";
import ShiftInformation from "./ShiftInformation";
import SalesSummaryCard from "./SalesSummaryCard";
import PaymentSummaryCard from "./PaymentSummaryCard";
import TopSellingItem from "./TopSellingItem";
import RecentOrdersTable from "./RecentOrdersTable";
import RefundsTable from "./RefundsTable";
import { getCurrentUser } from '@/lib/authSession';
import { getShiftDashboardData } from '@/services/shiftDashboardService';

function ShiftSummaryPage() {
    const currentUser = getCurrentUser();

    const {
        data: summaryData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['shift-dashboard', currentUser?.id, currentUser?.branchId],
        queryFn: () => getShiftDashboardData({ user: currentUser }),
        enabled: Boolean(currentUser?.id),
    });

    return (  
        <div className="h-full flex flex-col">   
            <ShiftReportHeader summaryData={summaryData} />
            <div className="flex-1 overflow-auto p-4">
                {isLoading && <p className="mb-4 text-sm text-muted-foreground">Loading shift summary...</p>}
                {isError && <p className="mb-4 text-sm text-red-500">{error?.message ?? 'Failed to load shift summary.'}</p>}
                <div className ="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <ShiftInformation summaryData={summaryData} />
               <SalesSummaryCard summaryData={summaryData} />

                </div>
                <div className ="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <PaymentSummaryCard summaryData={summaryData} />
                <TopSellingItem summaryData={summaryData} />
                </div>
                <div className ="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <RecentOrdersTable summaryData={summaryData} />
                <RefundsTable summaryData={summaryData} />
                </div>
            </div>
        </div>
    );
}

export default ShiftSummaryPage;