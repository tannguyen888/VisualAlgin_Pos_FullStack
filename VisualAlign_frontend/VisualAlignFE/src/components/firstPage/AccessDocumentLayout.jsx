import { Link } from 'react-router-dom';
import LogoAndCurrentTime from './LogoAndCurrentTime';

const topLinks = [
    { key: 'terms', to: '/access/terms', label: 'Terms' },
    { key: 'privacy', to: '/access/privacy', label: 'Privacy' },
    { key: 'fqa', to: '/access/fqa', label: 'FAQ' },
    { key: 'accessibility', to: '/access/accessibility', label: 'Accessibility' },
];

function AccessDocumentLayout({ title, activeKey, sections }) {
    return (
        <div className="h-screen overflow-hidden flex flex-col items-center bg-zinc-200 text-black font-mono">
            <LogoAndCurrentTime timeClassName="text-black" />

            <div className="mt-10 w-full max-w-6xl px-6 flex-1 flex flex-col">
                <div className="flex justify-center gap-4 text-xs text-zinc-700 mb-4 lowercase">
                    {topLinks.map((link) => (
                        <Link
                            key={link.key}
                            to={link.to}
                            className={activeKey === link.key ? 'underline text-black' : 'hover:text-black'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="mx-auto w-full max-w-3xl border border-zinc-300 rounded-sm bg-zinc-200 p-5 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto pr-2 text-xs leading-5 text-black space-y-4">
                        <h1 className="text-sm font-semibold text-black">{title}</h1>
                        {sections.map((section, index) => (
                            <section key={section.heading + '-' + index} className="space-y-1.5">
                                <h2 className="text-[11px] uppercase tracking-wide text-black">
                                    {section.heading}
                                </h2>
                                <p>{section.body}</p>
                            </section>
                        ))}
                    </div>
                </div>

                <div className="py-6 text-xs text-black flex justify-between gap-6 lowercase">
                    <div className="flex gap-4">
                        <Link to="/store" className="hover:underline">shop</Link>
                        <Link to="/store" className="hover:underline">view all</Link>
                    </div>
                    <div className="flex gap-4 text-right">
                        <Link to="/access/category/spring-summer-2026-preview-deals" className="hover:underline">spring/summer 2026 preview</Link>
                        <Link to="/access/category/spring-summer-2026-lookbook" className="hover:underline">lookbook</Link>
                        <Link to="/access/category/news" className="hover:underline">news</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccessDocumentLayout;
