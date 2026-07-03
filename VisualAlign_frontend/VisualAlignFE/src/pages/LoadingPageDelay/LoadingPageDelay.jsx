import './LoadingAnimation.css';
import LoadingAnimation from './LoadingAnimation';

function LoadingPageDelay() {
    return (
        <div className="h-screen w-full overflow-hidden bg-black flex items-center justify-center">
            <LoadingAnimation />
        </div>
    );
}

export default LoadingPageDelay;
