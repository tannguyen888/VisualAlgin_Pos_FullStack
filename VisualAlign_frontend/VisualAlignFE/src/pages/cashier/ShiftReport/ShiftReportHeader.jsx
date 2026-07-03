import { useState } from 'react';
import Button from "@/components/Button";
import { LogIn, LogOut } from "lucide-react";
import ConfirmLogout from "@/components/ConfirmLogout/ConfirmLogout";
import { useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/authSession';
import { ensureShiftStartedForUser } from '@/services/shiftService';

function formatHeaderDate(value) {
    if (!value) return new Date().toLocaleDateString('en-GB');
    return new Date(value).toLocaleDateString('en-GB');
}

function ShiftReportHeader({ summaryData }) {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isStartingShift, setIsStartingShift] = useState(false);
    const queryClient = useQueryClient();
    const currentUser = getCurrentUser();

    const shiftId = summaryData?.shift?.id;
    const reportDate = formatHeaderDate(summaryData?.shift?.shiftStart);

    const handleStartShift = async () => {
        if (isStartingShift) return;
        setIsStartingShift(true);
        await ensureShiftStartedForUser(currentUser);
        await queryClient.invalidateQueries({ queryKey: ['shift-dashboard', currentUser?.id, currentUser?.branchId] });
        setIsStartingShift(false);
    };

    return (
        <>
            <div className="p-4 bg-card border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Shift Summary</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {shiftId ? `SHIFT-${shiftId}` : 'No Active Shift'} | {reportDate}
                        </p>
                    </div>

                    <div className="flex gap-2">
                         <Button
                            onClick={handleStartShift}
                            variant="outline"
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={isStartingShift}
                        >
                            <LogIn size={16} className="mr-2" />
                           {isStartingShift ? 'Starting...' : 'Start Shift'}
                        </Button>
                        <Button
                            onClick={() => setLogoutOpen(true)}
                            variant="outline"
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            <LogOut size={16} className="mr-2" />
                            End Shift &amp; Logout
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmLogout
                isOpen={logoutOpen}
                onClose={() => setLogoutOpen(false)}
            />
        </>
    );
}

export default ShiftReportHeader;