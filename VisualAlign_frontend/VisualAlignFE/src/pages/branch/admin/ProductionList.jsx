import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Package, ArrowRight, RefreshCw, Trash2, Plus } from 'lucide-react';
import {
    createProduct,
    deleteProduct,
    fetchCategoriesByStore,
    fetchProducts,
    updateProduct,
    updateProductStock,
} from '@/services/productionService';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import { getCurrentUser } from '@/lib/authSession';

const fmt = (v) => Number(v).toLocaleString('vi-VN') + ' VND';

// Badge màu theo stock
function StockBadge({ stock }) {
    if (stock === 0)  return <Badge variant="destructive">Out of stock</Badge>;
    if (stock < 20)   return <Badge variant="outline" className="text-orange-500 border-orange-400">Low ({stock})</Badge>;
    return <Badge variant="secondary">{stock}</Badge>;
}

function ProductionList() {
    const navigate     = useNavigate();
    const queryClient  = useQueryClient();
    const currentUser = getCurrentUser();
    const storeId = currentUser?.storeId;
    const branchId = currentUser?.branchId;

    const [editId, setEditId] = useState(null);
    const [addForm, setAddForm] = useState({
        name: '',
        sku: '',
        brand: '',
        categoryId: '',
        sellingPrice: '',
        mrp: '',
        stock: '',
        description: '',
    });
    const [editForm, setEditForm] = useState({
        name: '',
        sku: '',
        brand: '',
        categoryId: '',
        sellingPrice: '',
        mrp: '',
        stock: '',
        description: '',
    });
    const [formError, setFormError] = useState('');

    const { data: products = [], isLoading, isError, dataUpdatedAt } = useQuery({
        queryKey: ['products', storeId, branchId],
        queryFn: () => fetchProducts({ storeId, branchId }),
        enabled: Boolean(storeId),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['product-categories', storeId],
        queryFn: () => fetchCategoriesByStore(storeId),
        enabled: Boolean(storeId),
    });

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const created = await createProduct(payload.product);
            if (branchId) {
                await updateProductStock(created.id, payload.stock, branchId);
            }
            return created;
        },
        onSuccess: () => {
            setAddForm({
                name: '',
                sku: '',
                brand: '',
                categoryId: '',
                sellingPrice: '',
                mrp: '',
                stock: '',
                description: '',
            });
            setFormError('');
            queryClient.invalidateQueries({ queryKey: ['products', storeId, branchId] });
        },
        onError: (error) => {
            setFormError(error?.message ?? 'Failed to create product.');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload, stock }) => {
            const updated = await updateProduct(id, payload);
            if (branchId) {
                await updateProductStock(id, stock, branchId);
            }
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', storeId, branchId] });
            setEditId(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', storeId, branchId] });
        },
    });

    const handleStartEdit = (product) => {
        setEditId(product.id);
        setEditForm({
            name: product.name ?? '',
            sku: product.sku ?? '',
            brand: product.brand ?? '',
            categoryId: String(product.categoryId ?? ''),
            sellingPrice: String(product.sellingPrice ?? ''),
            mrp: String(product.mrp ?? ''),
            stock: String(product.stock ?? 0),
            description: product.description ?? '',
        });
    };

    const handleSaveProduct = (id) => {
        const stock = parseInt(editForm.stock, 10);
        const sellingPrice = Number(editForm.sellingPrice);
        const mrp = Number(editForm.mrp || editForm.sellingPrice);

        if (!editForm.name.trim() || !editForm.sku.trim()) return;
        if (!Number.isFinite(sellingPrice) || sellingPrice < 0) return;
        if (!Number.isFinite(stock) || stock < 0) return;

        updateMutation.mutate({
            id,
            payload: {
                name: editForm.name.trim(),
                sku: editForm.sku.trim(),
                brand: editForm.brand.trim(),
                description: editForm.description.trim(),
                sellingPrice,
                mrp,
                categoryId: editForm.categoryId ? Number(editForm.categoryId) : null,
                storeId,
            },
            stock,
        });
    };

    const handleCreateProduct = () => {
        const stock = parseInt(addForm.stock || '0', 10);
        const sellingPrice = Number(addForm.sellingPrice);
        const mrp = Number(addForm.mrp || addForm.sellingPrice);

        if (!addForm.name.trim() || !addForm.sku.trim()) {
            setFormError('Product name and SKU are required.');
            return;
        }

        if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
            setFormError('Selling price must be a valid number.');
            return;
        }

        if (!Number.isFinite(stock) || stock < 0) {
            setFormError('Stock must be a non-negative integer.');
            return;
        }

        createMutation.mutate({
            product: {
                name: addForm.name.trim(),
                sku: addForm.sku.trim(),
                brand: addForm.brand.trim(),
                description: addForm.description.trim(),
                sellingPrice,
                mrp,
                categoryId: addForm.categoryId ? Number(addForm.categoryId) : null,
                storeId,
            },
            stock,
        });
    };

    const handleViewSales = () => {
        navigate('/admin/total-sales');
    };

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Package size={20} className="text-muted-foreground" />
                    <h1 className="text-xl font-bold">Production / Stock List</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—'}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['products', storeId, branchId] })}
                    >
                        <RefreshCw size={14} className="mr-1" /> Refresh
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                        onClick={handleViewSales}
                        disabled={products.length === 0}
                    >
                        View Total Sales <ArrowRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border p-4 bg-card space-y-3">
                <h2 className="text-sm font-semibold">Add New Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} />
                    <Input placeholder="SKU" value={addForm.sku} onChange={(e) => setAddForm((p) => ({ ...p, sku: e.target.value }))} />
                    <Input placeholder="Brand" value={addForm.brand} onChange={(e) => setAddForm((p) => ({ ...p, brand: e.target.value }))} />
                    <Input placeholder="Selling Price" type="number" value={addForm.sellingPrice} onChange={(e) => setAddForm((p) => ({ ...p, sellingPrice: e.target.value }))} />
                    <Input placeholder="MRP" type="number" value={addForm.mrp} onChange={(e) => setAddForm((p) => ({ ...p, mrp: e.target.value }))} />
                    <Input placeholder="Initial Stock" type="number" value={addForm.stock} onChange={(e) => setAddForm((p) => ({ ...p, stock: e.target.value }))} />
                    <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        value={addForm.categoryId}
                        onChange={(e) => setAddForm((p) => ({ ...p, categoryId: e.target.value }))}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <Input placeholder="Description" value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                {formError && <p className="text-xs text-red-500">{formError}</p>}
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleCreateProduct}
                    disabled={createMutation.isPending}
                >
                    <Plus size={14} className="mr-1" />
                    {createMutation.isPending ? 'Creating...' : 'Add Product'}
                </Button>
            </div>

            {/* States */}
            {isLoading && <p className="text-sm text-muted-foreground py-8 text-center">Loading products…</p>}
            {isError   && <p className="text-sm text-red-500 py-8 text-center">Failed to load products.</p>}

            {/* Table */}
            {!isLoading && !isError && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {editId === product.id ? (
                                        <Input value={editForm.sku} onChange={(e) => setEditForm((p) => ({ ...p, sku: e.target.value }))} />
                                    ) : product.sku}
                                </TableCell>
                                <TableCell>
                                    {editId === product.id ? (
                                        <select
                                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={editForm.categoryId}
                                            onChange={(e) => setEditForm((p) => ({ ...p, categoryId: e.target.value }))}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    ) : product.category}
                                </TableCell>
                                <TableCell className="text-right">
                                    {editId === product.id ? (
                                        <Input
                                            type="number"
                                            value={editForm.sellingPrice}
                                            onChange={(e) => setEditForm((p) => ({ ...p, sellingPrice: e.target.value }))}
                                        />
                                    ) : fmt(product.sellingPrice)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {editId === product.id ? (
                                        <Input
                                            type="number"
                                            min="0"
                                            value={editForm.stock}
                                            onChange={(e) => setEditForm((p) => ({ ...p, stock: e.target.value }))}
                                            className="w-20 mx-auto text-center"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveProduct(product.id)}
                                        />
                                    ) : (
                                        <StockBadge stock={product.stock} />
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex gap-1 justify-center">
                                        {editId === product.id ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSaveProduct(product.id)}
                                                    disabled={updateMutation.isPending}
                                                >
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="outline" onClick={() => handleStartEdit(product)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                                    onClick={() => deleteMutation.mutate(product.id)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default ProductionList;
