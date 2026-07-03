import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Button from '@/components/Button';
import CustomerDialog from './CustomerDialog';

function CustomerSection({ customer, onChangeCustomer }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Customer</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            Change
                        </Button>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-2 text-sm">
                    {customer ? (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">{customer.firstName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Phone</span>
                                <span>{customer.phone}</span>
                            </div>
                            {customer.email && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Email</span>
                                    <span>{customer.email}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Customer</span>
                            <Badge variant="outline">Walk-in</Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            {open && (
                <CustomerDialog
                    onSelect={(c) => { onChangeCustomer(c); setOpen(false); }}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

export default CustomerSection;
