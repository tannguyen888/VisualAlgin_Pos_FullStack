import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';
import AccessTitlePage from '@/pages/AccessFirstPage/AccessTitlePage';
import RandomShowcasePage from '@/pages/AccessFirstPage/RandomShowcasePage';
import heroImage from '@/assets/hero.png';

const CATEGORY_CONTENT = {
    news: {
        title: 'News',
        body: 'Latest updates from VisualAlign are collected here. New campaigns and store changes will be posted soon.',
    },
    'spring-summer-2026-preview-deals': {
        title: 'Spring/Summer 2026 Preview Deals',
        body: 'Discover limited seasonal offers for selected automotive products and services. This preview section highlights early release bundles, branch-level discount windows, and a curated set of featured products before full launch week.\n\nExpect rolling updates by week, region, and product line. Offer windows and quantities may vary by branch location and stock availability.\n\nMembers and signed-in users will receive early notices when a campaign changes from preview to active checkout-ready state.',
    },
    'spring-summer-2026-lookbook': {
        title: 'Spring/Summer 2026 Lookbook',
        body: 'A curated lookbook featuring highlighted products and setups for this season. This page is used to present styling references, bundle combinations, and visual pairings that align with seasonal campaigns.\n\nEach lookbook entry includes quick notes on compatibility, suggested service intervals, and maintenance-friendly alternatives.\n\nMore editorial cards and media entries will be added progressively by release phase.',
    },
    shop: {
        title: 'Shop',
        body: 'Browse products, compare categories, and add items to your cart without signing in.\n\nFor checkout and order confirmation, login is required to secure customer and payment actions.\n\nUse the navigation links below to continue to lookbook, deals preview, or return to the access page.',
    },
    random: {
        title: 'Random',
        body: 'A rotating section for featured picks and experimental content. Random includes temporary showcases, short-run ideas, and exploratory drops that may appear only for a limited time.\n\nItems shown here can move into preview campaigns, lookbook collections, or archived references depending on user feedback and store performance.',
    },
    about: {
        title: 'About',
        body: 'VisualAlign focuses on modern POS operations and clean branch-level workflows.\n\nThe platform aims to keep cashier actions fast, branch management clear, and product circulation transparent across store systems.\n\nDesign direction follows an editorial minimalist style: structured content, high readability, and controlled motion.',
    },
    'stores-location': {
        title: 'Stores Location',
        body: 'Branch and store location details are organized by region and service capacity.\n\nEach location card includes operation hours, service type focus, and contact channels for pre-order support.\n\nLive branch metadata and maps will be connected in upcoming iterations.',
    },
    contact: {
        title: 'Contact',
        body: 'For support, please reach the team through official contact channels.\n\nUse contact for account help, branch issues, and campaign clarification requests.\n\nResponse windows are prioritized by request type and branch urgency.',
    },
};

function AccessCategoryPage() {
    const { categoryKey } = useParams();

    if (categoryKey === 'news') {
        return <AccessTitlePage />;
    }

    if (categoryKey === 'random') {
        return <RandomShowcasePage />;
    }

    const category = useMemo(() => {
        return CATEGORY_CONTENT[categoryKey] ?? {
            title: 'Category',
            body: 'This category is being prepared. Please check back shortly.',
        };
    }, [categoryKey]);

    return (
        <div className="min-h-screen bg-zinc-100 text-black px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <LogoAndCurrentTime containerClassName="pt-2" timeClassName="text-black" />

                <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
                    <div className="bg-zinc-200 p-4">
                        <img
                            src={heroImage}
                            alt={category.title}
                            className="w-full h-[420px] object-cover"
                        />
                    </div>

                    <div className="bg-white border border-zinc-300 p-5 h-[420px] overflow-y-auto">
                        <h1 className="text-2xl font-semibold">{category.title}</h1>
                        <p className="mt-4 text-[13px] leading-6 whitespace-pre-line">{category.body}</p>

                        <div className="mt-8 flex gap-3">
                            <Button
                                to="/access"
                                size="sm"
                                className="bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                            >
                                back to access
                            </Button>
                            <Button
                                to="/user/login"
                                size="sm"
                                className="bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                            >
                                user login
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between text-xs lowercase">
                    <Button to="/store" className="bg-red-600 text-white hover:bg-red-700">shop</Button>
                    <div className="flex items-center gap-4">
                        <Button to="/access/category/spring-summer-2026-preview-deals" className="bg-red-600 text-white hover:bg-red-700">spring/summer 2026 preview</Button>
                        <Button to="/access/category/spring-summer-2026-lookbook" className="bg-red-600 text-white hover:bg-red-700">lookbook</Button>
                        <Button to="/access/category/news" className="bg-red-600 text-white hover:bg-red-700">news</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccessCategoryPage;
