import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getCurrentUser } from '@/lib/authSession';
import {
    createStoreEmployee,
    getCashierShiftReports,
    getStoreEmployees,
    updateEmployee,
} from '@/services/employeeService';

const ROLE_OPTIONS = [
    'ROLE_BRANCH_CASHIER',
    'ROLE_BRANCH_MANAGER',
    'ROLE_MANAGER',
    'ROLE_STORE_MANAGER',
    'ROLE_ADMIN',
];

function getLatestShift(shifts = []) {
    if (!Array.isArray(shifts) || shifts.length === 0) return null;
    return [...shifts]
        .sort((a, b) => new Date(b.shiftStart ?? 0).getTime() - new Date(a.shiftStart ?? 0).getTime())[0];
}

function formatDateTime(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('en-GB');
}

function calcDuration(start, end) {
    if (!start || !end) return 'In progress';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms <= 0) return '-';

    const totalMins = Math.floor(ms / 60000);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours}h ${mins}m`;
}

function EmployeeManager() {
    const currentUser = getCurrentUser();
    const storeId = currentUser?.storeId;
    const queryClient = useQueryClient();

    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'ROLE_BRANCH_CASHIER',
    });
    const [error, setError] = useState('');

    const { data: employees = [], isLoading } = useQuery({
        queryKey: ['employees', storeId],
        queryFn: () => getStoreEmployees(storeId),
        enabled: Boolean(storeId),
    });

    const { data: shiftsByEmployee = {} } = useQuery({
        queryKey: ['employee-shifts', storeId, employees.map((e) => e.id).join('-')],
        queryFn: async () => {
            if (!employees.length) return {};

            const pairs = await Promise.all(
                employees.map(async (employee) => {
                    try {
                        const shifts = await getCashierShiftReports(employee.id);
                        return [employee.id, shifts ?? []];
                    } catch {
                        return [employee.id, []];
                    }
                })
            );

            return Object.fromEntries(pairs);
        },
        enabled: Boolean(storeId) && employees.length > 0,
    });

    const createEmployeeMutation = useMutation({
        mutationFn: (payload) => createStoreEmployee(storeId, payload),
        onSuccess: () => {
            setNewEmployee({
                fullName: '',
                email: '',
                phone: '',
                password: '',
                role: 'ROLE_BRANCH_CASHIER',
            });
            setError('');
            queryClient.invalidateQueries({ queryKey: ['employees', storeId] });
        },
        onError: (mutationError) => setError(mutationError?.message ?? 'Create employee failed'),
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ employeeId, role, employee }) =>
            updateEmployee(employeeId, {
                fullName: employee.fullName,
                email: employee.email,
                phone: employee.phone,
                role,
                storeId: employee.storeId,
                branchId: employee.branchId,
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', storeId] }),
    });

    const enrichedRows = useMemo(
        () =>
            employees.map((employee) => {
                const latestShift = getLatestShift(shiftsByEmployee[employee.id]);
                return {
                    ...employee,
                    lastShiftStart: latestShift?.shiftStart ?? null,
                    lastShiftEnd: latestShift?.shiftEnd ?? null,
                    shiftDuration: calcDuration(latestShift?.shiftStart, latestShift?.shiftEnd),
                };
            }),
        [employees, shiftsByEmployee]
    );

    const handleCreateEmployee = () => {
        if (!newEmployee.fullName.trim() || !newEmployee.email.trim() || !newEmployee.password.trim()) {
            setError('Full name, email and password are required.');
            return;
        }

        createEmployeeMutation.mutate({
            ...newEmployee,
            fullName: newEmployee.fullName.trim(),
            email: newEmployee.email.trim(),
            phone: newEmployee.phone.trim(),
            storeId,
        });
    };

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold">Employee Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Add employees, update role, and monitor latest login/logout shift duration.
                </p>
            </div>

            {!storeId && (
                <p className="text-sm text-red-500">Current user session does not have storeId.</p>
            )}

            <div className="border rounded-lg p-4 bg-card space-y-3">
                <h2 className="font-semibold">Add Employee</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                        placeholder="Full name"
                        value={newEmployee.fullName}
                        onChange={(e) => setNewEmployee((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                    <Input
                        placeholder="Email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                        placeholder="Phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee((prev) => ({ ...prev, role: e.target.value }))}
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleCreateEmployee}>
                    Add Employee
                </Button>
            </div>

            <div className="border rounded-lg bg-card p-4">
                <h2 className="font-semibold mb-3">Employees</h2>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading employees...</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead>Last Shift Start</TableHead>
                                <TableHead>Last Shift End</TableHead>
                                <TableHead>Shift Duration</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrichedRows.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{employee.role}</Badge>
                                    </TableCell>
                                    <TableCell>{formatDateTime(employee.lastLogin)}</TableCell>
                                    <TableCell>{formatDateTime(employee.lastShiftStart)}</TableCell>
                                    <TableCell>{formatDateTime(employee.lastShiftEnd)}</TableCell>
                                    <TableCell>{employee.shiftDuration}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                                                defaultValue={employee.role}
                                                onChange={(e) =>
                                                    updateRoleMutation.mutate({
                                                        employeeId: employee.id,
                                                        role: e.target.value,
                                                        employee,
                                                    })
                                                }
                                            >
                                                {ROLE_OPTIONS.map((role) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

export default EmployeeManager;