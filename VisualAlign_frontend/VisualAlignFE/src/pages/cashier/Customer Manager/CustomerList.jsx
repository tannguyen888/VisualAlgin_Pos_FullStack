import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function CustomerList({ customers, selectedId, onSelect }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Customer List</CardTitle>
                    <Badge variant="secondary">{customers.length} customers</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 text-sm space-y-1 max-h-[480px] overflow-y-auto">
                {customers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No customers found</p>
                ) : (
                    customers.map((customer, index) => (
                        <div
                            key={customer.id + '-' + index}
                            onClick={() => onSelect(customer.id)}
                            className={`flex justify-between items-center px-3 py-2.5 rounded cursor-pointer border transition-colors ${
                                selectedId === customer.id
                                    ? 'bg-primary/10 border-primary'
                                    : 'border-transparent hover:bg-muted/50'
                            }`}
                        >
                            <div>
                                <div className="font-medium">{customer.firstName}</div>
                                <div className="text-xs text-muted-foreground">{customer.phone}</div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default CustomerList;
