import {  ArrowArcRightIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

function InstructionHover() {
    const [isOpen, setIsOpen] = useState(false);
    const timerRef = useRef(null);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        clearTimer();
        setIsOpen(true);
        timerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 5000);
    };

    const handleMouseLeave = () => {
        clearTimer();
        setIsOpen(false);
    };

    useEffect(() => {
        return () => clearTimer();
    }, []);

    return (
        <div className="relative inline-flex items-center">
            <p
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="ml-4 text-sm text-muted-foreground cursor-pointer underline decoration-dotted"
            >
               Click here to Generate and Print the Invoice for this order.
               <ArrowArcRightIcon className="inline-block ml-1" size={16} />
            </p>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
                    This button generates invoice data and opens the print dialog.
                    You can print to a small receipt printer or choose "Save as PDF".
                </div>
            )}
        </div>
    );
}

export default InstructionHover;