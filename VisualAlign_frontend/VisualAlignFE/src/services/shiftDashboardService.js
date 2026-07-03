import { getOrdersByBranchId, getRecentOrdersByBranchId } from '@/services/orderService';
import { getRefundsByBranchId } from '@/services/refundService';
import { getActiveShiftByCashierId, getShiftReportsByCashierId } from '@/services/shiftService';

function toDate(value) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWithinShift(dateLike, shiftStart, shiftEnd) {
    const value = toDate(dateLike);
    const start = toDate(shiftStart);
    const end = toDate(shiftEnd);
    if (!value) return false;
    if (!start) return true;
    if (!end) return value >= start;
    return value >= start && value <= end;
}

function summarizePayments(orders, grossRevenue) {
    const summaryMap = new Map();

    orders.forEach((order) => {
        const key = order.paymentType ?? 'UNKNOWN';
        const row = summaryMap.get(key) ?? { type: key, totalAmount: 0, transactionCount: 0, percentage: 0 };
        row.totalAmount += Number(order.totalAmount ?? 0);
        row.transactionCount += 1;
        summaryMap.set(key, row);
    });

    return Array.from(summaryMap.values()).map((row) => ({
        ...row,
        percentage: grossRevenue > 0 ? (row.totalAmount / grossRevenue) * 100 : 0,
    }));
}

function summarizeTopItems(orders) {
    const map = new Map();

    orders.forEach((order) => {
        (order.orderItems ?? []).forEach((item) => {
            const productId = Number(item.productId ?? item.product?.id);
            if (!productId) return;

            const current = map.get(productId) ?? {
                id: productId,
                name: item.product?.name ?? `Product #${productId}`,
                sellingPrice: Number(item.product?.sellingPrice ?? item.price ?? 0),
                quantity: 0,
            };

            current.quantity += Number(item.quantiy ?? 0);
            map.set(productId, current);
        });
    });

    return Array.from(map.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
}

export async function getShiftDashboardData({ user }) {
    if (!user?.id) {
        return {
            shift: null,
            orders: [],
            recentOrders: [],
            refunds: [],
            paymentSummary: [],
            topSellingProducts: [],
            totalOrders: 0,
            grossRevenue: 0,
            totalRefunds: 0,
            discounts: 0,
            netSales: 0,
            latestShiftDuration: '-',
        };
    }

    let shift = null;
    try {
        shift = await getActiveShiftByCashierId(user.id);
    } catch {
        const reports = await getShiftReportsByCashierId(user.id).catch(() => []);
        shift = (reports ?? [])
            .slice()
            .sort((a, b) => new Date(b.shiftStart ?? 0).getTime() - new Date(a.shiftStart ?? 0).getTime())[0] ?? null;
    }

    const branchId = user.branchId ?? shift?.branchId;
    const [branchOrders, recentOrdersRaw, branchRefunds] = await Promise.all([
        branchId ? getOrdersByBranchId(branchId).catch(() => []) : Promise.resolve([]),
        branchId ? getRecentOrdersByBranchId(branchId).catch(() => []) : Promise.resolve([]),
        branchId ? getRefundsByBranchId(branchId).catch(() => []) : Promise.resolve([]),
    ]);

    const orders = (branchOrders ?? []).filter((order) => {
        const sameCashier = !order.cashier?.id || order.cashier.id === user.id;
        const withinShift = isWithinShift(order.createdAt, shift?.shiftStart, shift?.shiftEnd);
        return sameCashier && withinShift;
    });

    const recentOrders = (recentOrdersRaw ?? [])
        .filter((order) => {
            const sameCashier = !order.cashier?.id || order.cashier.id === user.id;
            const withinShift = isWithinShift(order.createdAt, shift?.shiftStart, shift?.shiftEnd);
            return sameCashier && withinShift;
        })
        .slice(0, 5);

    const refunds = (branchRefunds ?? []).filter((refund) => {
        const sameCashier = !refund.cashier?.id || refund.cashier.id === user.id;
        const withinShift = isWithinShift(refund.createdAt, shift?.shiftStart, shift?.shiftEnd);
        return sameCashier && withinShift;
    });

    const grossRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);
    const totalRefunds = refunds.reduce((sum, refund) => sum + Number(refund.amount ?? 0), 0);
    const discounts = 0;
    const netSales = grossRevenue - totalRefunds - discounts;

    const shiftStart = toDate(shift?.shiftStart);
    const shiftEnd = toDate(shift?.shiftEnd) ?? new Date();
    let latestShiftDuration = '-';
    if (shiftStart) {
        const mins = Math.max(0, Math.floor((shiftEnd.getTime() - shiftStart.getTime()) / 60000));
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;
        latestShiftDuration = `${hours}h ${remMins}m`;
    }

    return {
        shift,
        orders,
        recentOrders,
        refunds,
        paymentSummary: summarizePayments(orders, grossRevenue),
        topSellingProducts: summarizeTopItems(orders),
        totalOrders: orders.length,
        grossRevenue,
        totalRefunds,
        discounts,
        netSales,
        latestShiftDuration,
    };
}
