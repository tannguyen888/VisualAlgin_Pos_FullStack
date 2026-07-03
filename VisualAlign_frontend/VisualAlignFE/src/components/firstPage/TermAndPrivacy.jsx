
import { NavLink } from 'react-router-dom';

const menuItems = [
    { label: 'terms', to: '/access/terms' },
    { label: 'privacy', to: '/access/privacy' },
    { label: 'faq', to: '/access/fqa' },
    { label: 'accessibility', to: '/access/accessibility' },
];

function TermAndPrivacy() {
    return (
        <div className="flex items-center justify-center p-40">
        <ul className="flex gap-4 text-sm text-white lowercase">
            {menuItems.map((item) => (
                <li key={item.label}>
                    <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                            isActive
                                ? 'underline underline-offset-2 text-red-500'
                                : 'hover:text-red-400'
                        }
                    >
                        {item.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    </div>
    );
}

export default TermAndPrivacy;