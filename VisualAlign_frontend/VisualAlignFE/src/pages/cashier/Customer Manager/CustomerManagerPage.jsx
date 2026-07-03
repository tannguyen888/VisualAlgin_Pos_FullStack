import CustomerSearchBar from "./CustomerSearchBar";
import CustomerList from "./CustomerList";
import CustomerInfoCard from "./CustomerInfoCard";
import CustomerOrderHistory from "./CustomerOrderHistory";
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCustomers } from '@/services/customerService';

function CustomerManagerPage() {
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState("");

    const { data: customers = [], isLoading, isError, error } = useQuery({
        queryKey: ['customers'],
        queryFn: getAllCustomers,
    });

    const normalizedCustomers = useMemo(
        () => (customers ?? []).map((customer) => ({
            id: customer.id,
            firstName: customer.firstName ?? customer.fullName ?? 'Unknown Customer',
            email: customer.email ?? '',
            phone: customer.phone ?? '',
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        })),
        [customers]
    );

    const filtered = normalizedCustomers.filter(c =>
        String(c.firstName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        String(c.phone ?? '').includes(search) ||
        String(c.email ?? '').toLowerCase().includes(search.toLowerCase())
    );

    const selectedCustomer = normalizedCustomers.find(c => c.id === selectedId) ?? normalizedCustomers[0] ?? null;

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b bg-card">
                <h1 className="text-xl font-bold">Customer Manager</h1>
                <p className="text-sm text-muted-foreground">Search and select a customer for this order</p>
                {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading customers...</p>}
                {isError && <p className="text-xs text-red-500 mt-1">{error?.message ?? 'Failed to load customers.'}</p>}
            </div>
            <div className="flex-1 overflow-auto p-4">
                <CustomerSearchBar search={search} onSearch={setSearch} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <CustomerList
                        customers={filtered}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                    <div className="flex flex-col gap-4">
                        <CustomerInfoCard customer={selectedCustomer} />
                        <CustomerOrderHistory
                            customerId={selectedCustomer?.id ?? null}
                            customerName={selectedCustomer?.firstName ?? 'Customer'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerManagerPage;
