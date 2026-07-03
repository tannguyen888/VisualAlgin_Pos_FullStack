import { AccessDocumentLayout } from '@/components/firstPage';

const fqaSections = [
    {
        heading: 'How Do I Place An Order?',
        body: 'Browse products, add items to your cart, and proceed to checkout when ready. You can review all selected items before confirming payment.',
    },
    {
        heading: 'Do I Need To Login Before Shopping?',
        body: 'No. You can browse and add products to cart without login. Authentication is required only when you perform purchase confirmation and payment.',
    },
    {
        heading: 'Can I Cancel Or Edit My Order?',
        body: 'Order changes may be possible before processing starts. Once fulfillment or settlement begins, cancellation depends on operational status and payment workflow.',
    },
    {
        heading: 'Which Payment Methods Are Supported?',
        body: 'Supported methods include cash, card, and e-transfer depending on branch configuration and checkout context.',
    },
    {
        heading: 'How Long Do Refunds Take?',
        body: 'Approved refunds are returned to the original payment method. Processing times vary by payment provider, typically from 3 to 10 business days.',
    },
    {
        heading: 'Is Google Login Supported?',
        body: 'Yes. Google OAuth login is available from the login page. Once authorized, your session is created and you are redirected to your role-specific workspace.',
    },
    {
        heading: 'How Can I Reach Support?',
        body: 'Use official support channels listed on the contact page. For fastest handling, provide order ID, date, payment method, and a concise issue description.',
    },
];

function FqaPage() {
    return (
        <AccessDocumentLayout
            title="FQA"
            activeKey="fqa"
            sections={fqaSections}
        />
    );
}

export default FqaPage;
