import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'news', to: '/access/category/news' },
  { label: 'spring/summer 2026 preview deals', to: '/access/category/spring-summer-2026-preview-deals' },
  { label: 'spring/summer 2026 lookbook', to: '/access/category/spring-summer-2026-lookbook' },
  { label: 'shop', to: '/store' },
  { label: 'random', to: '/access/category/random' },
  { label: 'about', to: '/access/category/about' },
  { label: 'stores location', to: '/access/category/stores-location' },
  { label: 'contact', to: '/access/category/contact' },
];

function StoreListingInfo() {
  const [hoveredItem, setHoveredItem] = useState('');

  const handleHover = (item) => {
    setHoveredItem(item || '');
  };

  const getHoverClass = (label) => {
    return hoveredItem === label ? 'bg-red-600 text-white' : '';
  };

  return (
    <ul className="flex flex-col items-center justify-center gap-4 flex-wrap text-white text-center">
      {menuItems.map((item) => (
        <li
          key={item.label}
          onMouseEnter={() => handleHover(item.label)}
          onMouseLeave={() => handleHover('')}
          className={getHoverClass(item.label)}
        >
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `block px-2 py-0.5 ${isActive ? 'underline underline-offset-4 text-red-400' : ''}`
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default StoreListingInfo;