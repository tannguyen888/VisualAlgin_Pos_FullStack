import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/Button';
import CustomerForm from './CustomerForm';
import { getAllCustomers } from '@/services/customerService';

function CustomerDialog({ onSelect, onClose }) {
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('search'); // 'search' | 'new'
    const { data: customers = [] } = useQuery({
        queryKey: ['customers', 'dialog'],
        queryFn: getAllCustomers,
    });

    const filtered = customers.filter((c) => {
        const name = String(c.firstName ?? '').toLowerCase();
        const phone = String(c.phone ?? '');
        return name.includes(search.toLowerCase()) || phone.includes(search);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Dialog header */}
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-base font-bold">Select Customer</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b px-5">
                    {['search', 'new'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
                                tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t === 'search' ? 'Search' : 'New Customer'}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {tab === 'search' ? (
                        <>
                            <input
                                className="w-full border rounded px-3 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring mb-3"
                                placeholder="Search by name or phone..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
                            />
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {/* Walk-in option */}
                                <div
                                    onClick={() => onSelect(null)}
                                    className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-muted/50 border border-transparent"
                                >
                                    <span className="font-medium text-sm">Walk-in Customer</span>
                                    <Badge variant="outline">No account</Badge>
                                </div>
                                <Separator className="my-1" />
                                {filtered.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => onSelect(c)}
                                        className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-muted/50 border border-transparent text-sm"
                                    >
                                        <div>
                                            <div className="font-medium">{c.firstName}</div>
                                            <div className="text-xs text-muted-foreground">{c.phone}</div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{c.email}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <CustomerForm onSubmit={onSelect} onCancel={() => setTab('search')} />
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t">
                    <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}

export default CustomerDialog;
