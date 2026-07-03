import Button from '../Button';
function NotFound() {
    const handleGoHome = ()=>{
        window.location.href = '/';
    }
    return ( 
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 class="text-red-900 text-3xl font-bold">404 Not Found</h1>
        <p class='text-2Xl font-bold'>Visual Align Team didnot expect this issues</p>
        <Button class='bg-blue-500 text-white px-4 py-2 rounded mt-4' onClick={handleGoHome}>Go to Home</Button>
        </div>
     );
}

export default NotFound;