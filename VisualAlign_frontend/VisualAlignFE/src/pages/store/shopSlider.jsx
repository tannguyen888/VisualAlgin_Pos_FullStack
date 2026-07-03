import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/productionService';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import Button from '@/components/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/authSession';

function ShopSlider() {
    const [sliderIndex, setSliderIndex] = useState(0);
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
   const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['products', currentUser?.storeId, currentUser?.branchId],
        queryFn: () => fetchProducts({ storeId: currentUser?.storeId, branchId: currentUser?.branchId }),
    });
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading products</div>;

const handleShop = () => {
    navigate('/store');
    };

    const handleViewAll = () => {
        navigate('/store');
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

const handleNext = () => {
    if (products.length === 0) return;
    setSliderIndex((prevIndex) => (prevIndex + 1) % products.length);
};

const handlePrev = () => {
    if (products.length === 0) return;
    setSliderIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
};

const visibleProducts = Array.from({ length: Math.min(5, products.length) }, (_, i) =>
    products[(sliderIndex + i) % products.length]
);
    return ( 
        
        <div className="h-screen w-full  bg-white-100 flex items-center justify-center">
               <p className="ml-4 text-sm">some highlight product</p>

          <section className="w-[90%] h-[90%] bg-gray-200 rounded-lg flex items-center justify-center">
             <Button className="size-3 bg-none" onClick={handlePrev}><ArrowLeftIcon></ArrowLeftIcon></Button>
           {visibleProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 ml-2 shadow">
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{product.category}</p>
              
            </div>
          ))}
             <Button className="gap-2 size-3 bg-red-500" onClick={handleNext}><ArrowRightIcon></ArrowRightIcon></Button>
          </section>
          
<div className="flex flex-col ml-4 mt-5 text-xs lowercase flex justify-between">
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
        </div>
     );
}

export default ShopSlider;