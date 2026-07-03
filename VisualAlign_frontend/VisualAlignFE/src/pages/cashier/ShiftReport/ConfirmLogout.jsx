import { Badge, Button } from "@tremor/react";


const STAFF_ID = "12345"; // Example staff ID for validation

function ConfirmLogout() {
    const handleCloseTab = () => {
        window.close();
    };

    const handleLogout = (id) => {
        // Implement logout logic here (e.g., clear auth tokens, redirect to login page)
        if (id == STAFF_ID) {
            console.log("Shift ended and logged out");
            handleCloseTab();
        }
    }
    return ( 
        <Badge variant="outline" className="w-full p-8">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to end your shift and log out?</p>
            <p>Enter your staff ID</p>
            <input
                onChange={(e) => handleLogout(e.target.value)}
                type="text"
                placeholder="Staff ID"
                className="w-full mb-6 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4">
                <Button onClick={handleCloseTab} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</Button>
                <Button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">End Shift & Logout</Button>
            </div>
        </Badge>
     );
}

export default ConfirmLogout;