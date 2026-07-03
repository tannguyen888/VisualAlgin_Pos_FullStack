
import {
    LogoAndCurrentTime,
    StoreListingInfo,
    SocialMediaPlatform,
    TermAndPrivacy,
} from '@/components/firstPage';
import Button from '@/components/Button';

function AccessTitlePage() {
    return (
        <div className="h-screen overflow-hidden flex flex-col items-center bg-black">
            <div className="w-full max-w-5xl px-6 pt-5 flex justify-end gap-2">
                <Button
                    to="/user/login"
                    size="sm"
                    className="bg-zinc-900 border border-zinc-600 text-white hover:bg-zinc-800"
                >
                    user login
                </Button>
                <Button
                    to="/staff/login"
                    size="sm"
                    className="bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                >
                    staff login
                </Button>
            </div>
            <LogoAndCurrentTime />
            <div className="mt-24 flex flex-col items-center justify-center gap-6 w-full px-[1.6rem]">
                <StoreListingInfo />
                <SocialMediaPlatform />

                <TermAndPrivacy />
            </div>
        </div>

    );
}

export default AccessTitlePage;