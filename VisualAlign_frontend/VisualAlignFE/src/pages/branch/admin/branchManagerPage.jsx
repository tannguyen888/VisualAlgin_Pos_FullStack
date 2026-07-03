import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import { getBranchesByStoreId } from '@/services/branchService';
import { getCurrentUser } from '@/lib/authSession';

function BranchManagerPage() {
    const currentUser = getCurrentUser();
    const storeId = currentUser?.storeId;
    const [branches, setBranches] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editManager, setEditManager] = useState('');

    const { isLoading } = useQuery({
        queryKey: ['branches', storeId],
        queryFn: async () => {
            if (!storeId) return [];
            const data = await getBranchesByStoreId(storeId);
            const mapped = (data ?? []).map((branch) => ({
                id: branch.id,
                name: branch.name,
                location: branch.address ?? '-',
                manager: branch.manager?.fullName ?? 'Unassigned',
            }));
            setBranches(mapped);
            return mapped;
        },
        enabled: Boolean(storeId),
    });

    const showEmptyStoreWarning = useMemo(() => !storeId, [storeId]);

    const handleStartEdit = (branch) => {
        setEditingId(branch.id);
        setEditName(branch.name);
        setEditLocation(branch.location);
        setEditManager(branch.manager);
    };

    const handleSaveEdit = (id) => {
        // TODO: call API PUT /api/branches/:id
        setBranches(prev =>
            prev.map(branch => branch.id === id ? { ...branch, name: editName, location: editLocation, manager: editManager } : branch)
        );
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this branch?')) return;
        // TODO: call API DELETE /api/branches/:id
        setBranches(prev => prev.filter(b => b.id !== id));
    };
  // TODO: replace with actual auth check
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Branch Manager</h1>
            {showEmptyStoreWarning && (
                <p className="text-sm text-red-500">Current account does not have storeId in session.</p>
            )}
            {isLoading && <p className="text-sm text-muted-foreground">Loading branches...</p>}
           

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Branch Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {branches.map((branch) => (
                        <TableRow key={branch.id}>
                            <TableCell>
                                {editingId === branch.id ? (
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    branch.name
                                )}
                            </TableCell>
                            <TableCell>{editingId === branch.id ? (
                                <Input
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                />
                            ) : (
                                branch.location
                            )}</TableCell>
                            <TableCell>{editingId === branch.id ? (
                                <Input
                                    value={editManager}
                                    onChange={(e) => setEditManager(e.target.value)}
                                />
                            ) : (
                                branch.manager
                            )}</TableCell>
                            <TableCell className="flex gap-2">
                                {editingId === branch.id ? (
                                    <Button size="sm" onClick={() => handleSaveEdit(branch.id)}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleStartEdit(branch)}>
                                        Edit
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(branch.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default BranchManagerPage;
