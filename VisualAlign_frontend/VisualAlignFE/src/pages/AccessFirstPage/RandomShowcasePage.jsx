import { Link } from 'react-router-dom';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';

const galleryItems = [
    { title: 'Street Session 01', image: 'https://picsum.photos/seed/visualalign-1/600/380' },
    { title: 'Downtown Night Drive', image: 'https://picsum.photos/seed/visualalign-2/600/380' },
    { title: 'Concrete Motion', image: 'https://picsum.photos/seed/visualalign-3/600/380' },
    { title: 'Garage Stories', image: 'https://picsum.photos/seed/visualalign-4/600/380' },
    { title: 'Local Circuit', image: 'https://picsum.photos/seed/visualalign-5/600/380' },
    { title: 'Project Dream Crew', image: 'https://picsum.photos/seed/visualalign-6/600/380' },
    { title: 'After Hours', image: 'https://picsum.photos/seed/visualalign-7/600/380' },
    { title: 'Archive Frame', image: 'https://picsum.photos/seed/visualalign-8/600/380' },
    { title: 'Urban Test Run', image: 'https://picsum.photos/seed/visualalign-9/600/380' },
    { title: 'Nightline Edit', image: 'https://picsum.photos/seed/visualalign-10/600/380' },
    { title: 'Street Portrait', image: 'https://picsum.photos/seed/visualalign-11/600/380' },
    { title: 'Visual Loop', image: 'https://picsum.photos/seed/visualalign-12/600/380' },
    { title: 'Chromed Story', image: 'https://picsum.photos/seed/visualalign-13/600/380' },
    { title: 'Side Lane', image: 'https://picsum.photos/seed/visualalign-14/600/380' },
    { title: 'Night Shift', image: 'https://picsum.photos/seed/visualalign-15/600/380' },
    { title: 'Final Cut', image: 'https://picsum.photos/seed/visualalign-16/600/380' },
];

function RandomShowcasePage() {
    return (
        <div className="h-screen overflow-hidden flex flex-col items-center bg-zinc-200 text-black font-mono">
            <LogoAndCurrentTime timeClassName="text-black" />

            <div className="mt-8 w-full max-w-6xl px-6 flex-1 flex flex-col">
                <div className="mx-auto w-full max-w-5xl flex items-center justify-between text-[11px] lowercase mb-2">
                    <span className="text-zinc-700">random archives</span>
                    <span className="text-zinc-700">project dream selection</span>
                </div>

                <div className="mx-auto w-full max-w-5xl border border-zinc-300 bg-zinc-200 p-2 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {galleryItems.map((item) => (
                                <article key={item.title} className="bg-zinc-100 border border-zinc-300">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-28 md:h-32 object-cover"
                                        loading="lazy"
                                    />
                                    <p className="text-[10px] px-1.5 py-1 truncate">{item.title}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-6 text-xs text-black flex justify-between gap-6 lowercase">
                    <div className="flex gap-4">
                        <Link to="/store" className="px-2 py-1 bg-red-600 text-white hover:bg-red-700">shop</Link>
                    </div>
                    <div className="flex gap-4 text-right">
                        <Link to="/access/category/spring-summer-2026-preview-deals" className="px-2 py-1 bg-red-600 text-white hover:bg-red-700">spring/summer 2026 preview</Link>
                        <Link to="/access/category/spring-summer-2026-lookbook" className="px-2 py-1 bg-red-600 text-white hover:bg-red-700">lookbook</Link>
                        <Link to="/access/category/news" className="px-2 py-1 bg-red-600 text-white hover:bg-red-700">news</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RandomShowcasePage;
