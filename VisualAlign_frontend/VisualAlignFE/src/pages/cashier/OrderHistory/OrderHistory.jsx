import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import OrderDetail from './OrderDetail';
import OrderTable from './OrderTable';
import { getCurrentUser, getCurrentUserRole } from '@/lib/authSession';
import { getOrdersByBranchId, getOrdersByCashierId } from '@/services/orderService';

/**
 * OrderHistory — master-detail page.
 *
 * Left  : OrderTable  (list of all orders, clickable rows)
 * Right : OrderDetail (full breakdown of the selected order)
 */
function OrderHistory() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const currentUser = getCurrentUser();
    const role = getCurrentUserRole();

    const {
        data: orders = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['order-history', role, currentUser?.id, currentUser?.branchId],
        queryFn: async () => {
            if (!currentUser?.id) return [];

            if (role === 'admin' && currentUser.branchId) {
                return getOrdersByBranchId(currentUser.branchId);
            }

            if (role === 'cashier') {
                return getOrdersByCashierId(currentUser.id);
            }

            if (currentUser.branchId) {
                return getOrdersByBranchId(currentUser.branchId);
            }

            return getOrdersByCashierId(currentUser.id);
        },
    });

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    );

    useEffect(() => {
        if (!sortedOrders.length) {
            setSelectedOrder(null);
            return;
        }

        if (!selectedOrder) {
            setSelectedOrder(sortedOrders[0]);
            return;
        }

        const stillExists = sortedOrders.some((order) => order.id === selectedOrder.id);
        if (!stillExists) {
            setSelectedOrder(sortedOrders[0]);
        }
    }, [sortedOrders, selectedOrder]);

    if (isLoading) {
        return <div className="p-4 text-sm text-muted-foreground">Loading order history...</div>;
    }

    if (isError) {
        return <div className="p-4 text-sm text-red-500">{error?.message ?? 'Failed to load orders.'}</div>;
    }

    return (
        <div className="grid grid-cols-1 items-start gap-4 p-4 xl:grid-cols-2">
            <OrderTable
                orders={sortedOrders}
                selectedOrderId={selectedOrder?.id ?? null}
                onSelectOrder={setSelectedOrder}
            />
            <OrderDetail order={selectedOrder} />
        </div>
    );
}

export default OrderHistory;
