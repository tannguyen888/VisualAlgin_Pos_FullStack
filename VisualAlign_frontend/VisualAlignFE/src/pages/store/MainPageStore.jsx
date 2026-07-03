import { useLocation } from 'react-router-dom';
import StorePageHeader from '@/pages/Header/storePageHeader';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';
import ProductListingStore from '@/pages/store/productListingStore';
import { getCurrentUser } from '@/lib/authSession';


const FALLBACK_USER = { fullName: 'Visitor' };

function MainPageStore() {
	const { state } = useLocation();

	const sessionUser = getCurrentUser();

	const user = state?.user ?? sessionUser ?? FALLBACK_USER;

	return (
		<div className="min-h-screen bg-black text-foreground p-6">
			<StorePageHeader userName={user.fullName ?? user.name} />
			<div className="mt-8 rounded-lg border p-6 bg-card-black">
				<LogoAndCurrentTime />
				<div className="mt-6">
					<ProductListingStore />
				</div>
			</div>
		</div>
	);
}

export default MainPageStore;
