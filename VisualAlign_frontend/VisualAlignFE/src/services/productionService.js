import { requestJson } from '@/services/apiClient';

function normalizeProduct(product = {}) {
    return {
        id: product.id,
        name: product.name ?? 'Unnamed Product',
        sku: product.sku ?? '',
        brand: product.brand ?? 'Unknown Brand',
        sellingPrice: Number(product.sellingPrice ?? 0),
        category: product.category?.name ?? product.category?.fullName ?? product.categoryName ?? 'General',
        categoryId: product.categoryId ?? product.category?.id ?? null,
        storeId: product.storeId ?? product.store?.id ?? null,
        description: product.description ?? '',
        image: product.image ?? '',
        mrp: Number(product.mrp ?? product.sellingPrice ?? 0),
    };
}

function normalizeCategory(category = {}) {
    return {
        id: category.id,
        name: category.name ?? 'General',
    };
}

function toInventoryPayload(productId, branchId, quantity) {
    return {
        product: { id: Number(productId) },
        branch: { id: Number(branchId) },
        quantity: Math.max(0, Number(quantity ?? 0)),
    };
}

/**
 * Lấy danh sách sản phẩm kèm tồn kho theo branch inventory.
 */
export async function fetchProducts({ storeId, branchId } = {}) {
    const basePath = storeId ? `/api/products/store/${storeId}` : '/api/products/getAll';
    let apiProducts = [];

    try {
        apiProducts = await requestJson(basePath, { method: 'GET', useAuth: true });
    } catch {
        apiProducts = await requestJson('/api/products/getAll', { method: 'GET', useAuth: false });
    }

    const products = (apiProducts ?? []).map(normalizeProduct);

    if (!branchId) {
        return products.map((product) => ({ ...product, stock: 0, inventoryId: null }));
    }

    let inventories = [];
    try {
        inventories = await requestJson(`/api/inventories/branch/${branchId}`, {
            method: 'GET',
            useAuth: true,
        });
    } catch {
        inventories = [];
    }

    const inventoryByProductId = new Map(
        (inventories ?? []).map((inventory) => [
            inventory?.product?.id,
            {
                stock: Number(inventory?.quantity ?? 0),
                inventoryId: inventory?.id ?? null,
            },
        ])
    );

    return products.map((product) => {
        const inv = inventoryByProductId.get(product.id);
        return {
            ...product,
            stock: inv?.stock ?? 0,
            inventoryId: inv?.inventoryId ?? null,
        };
    });
}

/**
 * Cập nhật stock của 1 sản phẩm.
 */
export async function updateProductStock(productId, stock, branchId) {
    if (!branchId) {
        throw new Error('branchId is required to update inventory stock.');
    }

    const safeStock = Math.max(0, Number(stock ?? 0));

    try {
        const existing = await requestJson(`/api/inventories/product/${productId}/branch/${branchId}`, {
            method: 'GET',
            useAuth: true,
        });

        return requestJson(`/api/inventories/update/${existing.id}`, {
            method: 'PUT',
            body: {
                ...toInventoryPayload(productId, branchId, safeStock),
                id: existing.id,
            },
            useAuth: true,
        });
    } catch {
        return requestJson('/api/inventories/create', {
            method: 'POST',
            body: toInventoryPayload(productId, branchId, safeStock),
            useAuth: true,
        });
    }
}

/**
 * Sync sales side effects được tính từ backend order/refund, không mutate in-memory local state.
 */
export async function applyOrderSale() {
    return null;
}

/**
 * CRUD product cho màn Production / Stock.
 */
export function createProduct(payload) {
    return requestJson('/api/products/create', {
        method: 'POST',
        body: payload,
        useAuth: true,
    });
}

export function updateProduct(productId, payload) {
    return requestJson(`/api/products/${productId}`, {
        method: 'PUT',
        body: payload,
        useAuth: true,
    });
}

export function deleteProduct(productId) {
    return requestJson(`/api/products/${productId}`, {
        method: 'DELETE',
        useAuth: true,
    });
}

export async function fetchCategoriesByStore(storeId) {
    if (!storeId) return [];
    const categories = await requestJson(`/api/categories/store/${storeId}`, {
        method: 'GET',
        useAuth: true,
    });
    return (categories ?? []).map(normalizeCategory);
}

/**
 * Tính tổng sales theo sản phẩm từ DB order items.
 */
export async function fetchTotalSales({ storeId, branchId, cashierId } = {}) {
    const [products, orders] = await Promise.all([
        fetchProducts({ storeId, branchId }),
        branchId
            ? requestJson(`/api/orders/branch/${branchId}/filter`, { method: 'GET', useAuth: true })
            : cashierId
                ? requestJson(`/api/orders/cashier/${cashierId}`, { method: 'GET', useAuth: true })
                : [],
    ]);

    const soldMap = new Map();
    const revenueMap = new Map();

    (orders ?? []).forEach((order) => {
        (order.orderItems ?? []).forEach((item) => {
            const productId = Number(item.productId ?? item.product?.id);
            if (!productId) return;

            const qty = Number(item.quantiy ?? 0);
            const rowRevenue = Number(item.price ?? 0) * qty;

            soldMap.set(productId, (soldMap.get(productId) ?? 0) + qty);
            revenueMap.set(productId, (revenueMap.get(productId) ?? 0) + rowRevenue);
        });
    });

    return products.map((product) => ({
        ...product,
        totalSold: soldMap.get(product.id) ?? 0,
        totalRevenue: revenueMap.get(product.id) ?? 0,
    }));
}
