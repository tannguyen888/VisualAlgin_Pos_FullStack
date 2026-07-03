
import { useEffect, useState } from 'react';

function DelayShow({ delay = 2000, children, fallback = null }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return show ? children : fallback;
}

export default DelayShow;