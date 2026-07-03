import logo from '@/assets/logo.jpeg';
import { Link } from 'react-router-dom';

function LogoAndCurrentTime({ containerClassName = '', timeClassName = 'text-white' }) {
    const currentDateTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    return (
        <div className={`flex flex-col items-center gap-2 pt-14 ${containerClassName}`.trim()}>
            <Link to="/access" aria-label="Go to access title page" className="inline-block">
                <img
                    src={logo}
                    alt="Company Logo"
                    className="w-32 h-32 object-contain"
                />
            </Link>
            <h4 className={`text-2xl gap-2 flex items-center ${timeClassName}`.trim()}>
                {currentDateTime}
            </h4>
        </div>
    );
}

export default LogoAndCurrentTime;