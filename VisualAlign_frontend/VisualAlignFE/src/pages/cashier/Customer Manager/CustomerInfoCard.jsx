import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function CustomerInfoCard({ customer }) {
    if (!customer) return null;

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Customer Details</CardTitle>
                    <Badge variant="outline">ID: {customer.id}</Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Full Name</span>
                    <span className="font-medium">{customer.firstName}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{customer.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email</span>
                    <span>{customer.email}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Created At</span>
                    <span>{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{formatDate(customer.updatedAt)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default CustomerInfoCard;
