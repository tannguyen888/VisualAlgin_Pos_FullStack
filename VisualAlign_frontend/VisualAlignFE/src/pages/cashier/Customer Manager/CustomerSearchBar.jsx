function CustomerSearchBar({ search, onSearch }) {
    return (
        <div className="w-full">
            <input
                className="w-full border rounded px-4 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
                placeholder="Search customer by name, phone or email..."
                value={search}
                onChange={e => onSearch(e.target.value)}
            />
        </div>
    );
}

export default CustomerSearchBar;
