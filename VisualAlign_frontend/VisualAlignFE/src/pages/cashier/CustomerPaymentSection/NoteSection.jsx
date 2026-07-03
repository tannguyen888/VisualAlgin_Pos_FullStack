import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function NoteSection({ note, onNoteChange }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Note</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 text-sm">
                <textarea
                    className="w-full border rounded px-3 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring resize-none"
                    rows={3}
                    placeholder="Add a note for this order (optional)..."
                    value={note}
                    onChange={e => onNoteChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{note.length} / 200</p>
            </CardContent>
        </Card>
    );
}

export default NoteSection;
