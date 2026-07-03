import { useState } from 'react';
import Button from '@/components/Button';

function CustomerForm({ onSubmit, onCancel }) {
    const [form, setForm] = useState({ firstName: '', phone: '', email: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = () => {
        if (!form.firstName.trim()) { setError('Name is required'); return; }
        if (!form.phone.trim()) { setError('Phone is required'); return; }
        onSubmit({ id: Date.now(), ...form });
    };

    return (
        <div className="space-y-3 text-sm">
            <div>
                <label className="block text-muted-foreground mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                    name="firstName"
                    className="w-full border rounded px-3 py-2 bg-background outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Enter full name"
                    value={form.firstName}
                    onChange={handleChange}
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-muted-foreground mb-1">Phone <span className="text-red-500">*</span></label>
                <input
                    name="phone"
                    className="w-full border rounded px-3 py-2 bg-background outline-none focus:ring-1 focus:ring-ring"
                    placeholder="e.g. 0901234567"
                    value={form.phone}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-muted-foreground mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    className="w-full border rounded px-3 py-2 bg-background outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Optional"
                    value={form.email}
                    onChange={handleChange}
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>Back</Button>
                {/* Important — red */}
                <Button
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleSubmit}
                >
                    Add Customer
                </Button>
            </div>
        </div>
    );
}

export default CustomerForm;
