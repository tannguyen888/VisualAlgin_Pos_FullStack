import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CART_STORAGE_KEY = 'visualalign.carts';

const DEFAULT_CARTS = {
    user: {
        items: [],
        customer: null,
        discount: 0,
        note: '',
    },
    staff: {
        items: [],
        customer: null,
        discount: 0,
        note: '',
    },
};

const CartContext = createContext(null);

function createOrderId(scope) {
    const prefix = scope === 'staff' ? 'POS' : 'WEB';
    const stamp = Date.now().toString().slice(-8);
    return `${prefix}-${stamp}`;
}

function normalizeProduct(product) {
    return {
        id: Number(product.id),
        productId: Number(product.id),
        name: product.name,
        sku: product.sku,
        quantity: 1,
        price: Number(product.sellingPrice ?? product.price ?? 0),
    };
}

function loadStoredCarts() {
    try {
        const raw = sessionStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return DEFAULT_CARTS;

        const parsed = JSON.parse(raw);
        return {
            user: {
                ...DEFAULT_CARTS.user,
                ...(parsed.user ?? {}),
                items: Array.isArray(parsed.user?.items) ? parsed.user.items : [],
            },
            staff: {
                ...DEFAULT_CARTS.staff,
                ...(parsed.staff ?? {}),
                items: Array.isArray(parsed.staff?.items) ? parsed.staff.items : [],
            },
        };
    } catch {
        return DEFAULT_CARTS;
    }
}

function persist(carts) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carts));
}

export function CartProvider({ children }) {
    const [carts, setCarts] = useState(loadStoredCarts);

    const updateScope = useCallback((scope, updater) => {
        setCarts((prev) => {
            const current = prev[scope] ?? DEFAULT_CARTS[scope];
            const nextScope = updater(current);
            const next = { ...prev, [scope]: nextScope };
            persist(next);
            return next;
        });
    }, []);

    const addProduct = useCallback((scope, product) => {
        if (!product) return;

        updateScope(scope, (cart) => {
            const existing = cart.items.find((item) => item.productId === Number(product.id));
            if (existing) {
                return {
                    ...cart,
                    items: cart.items.map((item) =>
                        item.productId === Number(product.id)
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                ...cart,
                items: [...cart.items, normalizeProduct(product)],
            };
        });
    }, [updateScope]);

    const updateQuantity = useCallback((scope, itemId, delta) => {
        updateScope(scope, (cart) => ({
            ...cart,
            items: cart.items
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0),
        }));
    }, [updateScope]);

    const removeItem = useCallback((scope, itemId) => {
        updateScope(scope, (cart) => ({
            ...cart,
            items: cart.items.filter((item) => item.id !== itemId),
        }));
    }, [updateScope]);

    const clearCart = useCallback((scope) => {
        updateScope(scope, (cart) => ({
            ...cart,
            items: [],
            discount: 0,
            note: '',
        }));
    }, [updateScope]);

    const setCustomer = useCallback((scope, customer) => {
        updateScope(scope, (cart) => ({ ...cart, customer: customer ?? null }));
    }, [updateScope]);

    const setDiscount = useCallback((scope, discount) => {
        updateScope(scope, (cart) => ({ ...cart, discount: Math.max(0, Number(discount ?? 0)) }));
    }, [updateScope]);

    const setNote = useCallback((scope, note) => {
        updateScope(scope, (cart) => ({ ...cart, note: note ?? '' }));
    }, [updateScope]);

    const getOrderDraft = useCallback((scope, meta = {}) => {
        const cart = carts[scope] ?? DEFAULT_CARTS[scope];
        return {
            id: createOrderId(scope),
            items: cart.items,
            meta,
        };
    }, [carts]);

    const value = useMemo(() => ({
        carts,
        addProduct,
        updateQuantity,
        removeItem,
        clearCart,
        setCustomer,
        setDiscount,
        setNote,
        getOrderDraft,
    }), [
        carts,
        addProduct,
        updateQuantity,
        removeItem,
        clearCart,
        setCustomer,
        setDiscount,
        setNote,
        getOrderDraft,
    ]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartScope(scope) {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartScope must be used inside CartProvider');
    }

    const cart = context.carts[scope] ?? DEFAULT_CARTS[scope];

    return {
        ...cart,
        addProduct: (product) => context.addProduct(scope, product),
        updateQuantity: (itemId, delta) => context.updateQuantity(scope, itemId, delta),
        removeItem: (itemId) => context.removeItem(scope, itemId),
        clearCart: () => context.clearCart(scope),
        setCustomer: (customer) => context.setCustomer(scope, customer),
        setDiscount: (discount) => context.setDiscount(scope, discount),
        setNote: (note) => context.setNote(scope, note),
        createDraftOrder: (meta) => context.getOrderDraft(scope, meta),
    };
}
