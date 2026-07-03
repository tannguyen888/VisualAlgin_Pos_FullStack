import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productionService';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { createCartActionId } from '@/lib/cartRouteState';
import { getCurrentUser } from '@/lib/authSession';

const formatCurrency = (value) => `${value.toLocaleString('vi-VN')} VND`;

function ProductListingStore() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['products', currentUser?.storeId, currentUser?.branchId],
        queryFn: () => fetchProducts({ storeId: currentUser?.storeId, branchId: currentUser?.branchId }),
    });

    const categories = useMemo(() => {
        const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
        return ['all', ...unique];
    }, [products]);

    const visibleProducts = useMemo(() => {
        if (activeCategory === 'all') return products;
        return products.filter((p) => p.category === activeCategory);
    }, [products, activeCategory]);

    const handleShop = () => {
        navigate('/shopslider');
    };

    const handleViewAll = () => {
        setActiveCategory('all');
    };

    const handlePreviewDeals = () => {
        navigate('/access/category/spring-summer-2026-preview-deals');
    };

    const handleLookbook = () => {
        navigate('/access/category/spring-summer-2026-lookbook');
    };

    const handleNews = () => {
        navigate('/access/category/news');
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
    };

    const closeProductDetail = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        navigate('/store/cart', {
            state: {
                preselectedProduct: selectedProduct,
                cartActionId: createCartActionId(selectedProduct.id),
            },
        });
    };

    return (
        <div className="bg-zinc-200 text-black font-mono rounded-sm border border-zinc-300 p-4">
            <div className="grid grid-cols-[120px_1fr] gap-4">
                <aside>
                    <ul className="text-xs lowercase leading-5">
                        {categories.map((category) => (
                            <li key={category}>
                                <button
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`text-left hover:underline ${activeCategory === category ? 'font-semibold underline' : ''}`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className="max-h-[480px] overflow-y-auto pr-2">
                    {isLoading && <p className="text-xs">loading products...</p>}
                    {isError && <p className="text-xs text-red-600">failed to load products.</p>}

                    {!isLoading && !isError && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {visibleProducts.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSelectProduct(product)}
                                    className="text-left bg-zinc-100 border border-zinc-300 p-2 hover:border-red-500 transition-colors"
                                >
                                    <div className="w-full aspect-square bg-zinc-300 mb-2" />
                                    <p className="text-[11px] leading-4 font-semibold line-clamp-2">{product.name}</p>
                                    <p className="text-[10px] text-zinc-600">{product.sku}</p>
                                    <p className="text-[10px]">{formatCurrency(product.sellingPrice)}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-5 text-xs lowercase flex justify-between">
                <div className="flex gap-4">
                    <span><Button className="bg-none hover:bg-red-500" onClick={handleShop}>shop</Button></span>
                    <span><Button className="bg-none hover:bg-red-500" onClick={handleViewAll}>view all</Button></span>
                </div>
                <div className="flex gap-4">
                    <span><Button className="bg-none hover:bg-red-500" onClick={handlePreviewDeals}>spring/summer 2026 preview</Button></span>
                    <span><Button className="bg-none hover:bg-red-500" onClick={handleLookbook}>lookbook</Button></span>
                    <span><Button className="bg-none hover:bg-red-500" onClick={handleNews}>news</Button></span>
                </div>
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={closeProductDetail}>
                    <div className="w-full max-w-3xl bg-white border border-zinc-300 p-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-zinc-200 h-64 md:h-full flex items-center justify-center overflow-hidden">
                            {selectedProduct.image ? (
                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-300" />
                            )}
                        </div>

                        <div className="flex flex-col gap-3 text-xs">
                            <h3 className="text-lg font-semibold lowercase">{selectedProduct.name}</h3>
                            <p><span className="font-semibold">sku:</span> {selectedProduct.sku}</p>
                            <p><span className="font-semibold">brand:</span> {selectedProduct.brand || 'n/a'}</p>
                            <p><span className="font-semibold">category:</span> {selectedProduct.category}</p>
                            <p><span className="font-semibold">stock:</span> {selectedProduct.stock ?? 0}</p>
                            <p><span className="font-semibold">price:</span> {formatCurrency(selectedProduct.sellingPrice)}</p>
                            <p><span className="font-semibold">mrp:</span> {formatCurrency(selectedProduct.mrp ?? selectedProduct.sellingPrice)}</p>

                            <div className="mt-1 border-t pt-3">
                                <p className="font-semibold mb-1 lowercase">description</p>
                                <p className="leading-5 text-zinc-700">
                                    {selectedProduct.description || 'No additional product description available for this item.'}
                                </p>
                            </div>

                            <div className="mt-auto flex gap-2">
                                <Button className="bg-zinc-900 text-white hover:bg-black" onClick={handleAddToCart}>add to cart</Button>
                                <Button variant="outline" onClick={closeProductDetail}>close</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductListingStore;