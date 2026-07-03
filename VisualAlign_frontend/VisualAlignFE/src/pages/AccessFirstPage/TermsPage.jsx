import { AccessDocumentLayout } from '@/components/firstPage';

const termsSections = [
    {
        heading: 'Effective Date',
        body: 'Effective July 1, 2026, these terms govern access to the VisualAlign website and related online services. By visiting or using any section of the site, you accept these terms and all applicable local regulations.',
    },
    {
        heading: 'Terms Of Use',
        body: 'You may browse, compare, and add products to cart as a guest user. Checkout and payment actions require account authentication. You agree not to misuse, disrupt, disable, or attempt to bypass site controls and security mechanisms.',
    },
    {
        heading: 'Product Information And Availability',
        body: 'Pricing, product descriptions, stock quantities, and campaign windows may change without prior notice. While we aim for high accuracy, temporary mismatches can occur. VisualAlign reserves the right to correct errors and update product data at any time.',
    },
    {
        heading: 'Orders And Purchase Limits',
        body: 'All orders are subject to verification, inventory checks, and fraud prevention controls. We may limit quantities per customer, per day, or per campaign where needed to ensure fair access.',
    },
    {
        heading: 'Cancellation And Refusal',
        body: 'VisualAlign may refuse, cancel, or hold an order for review when billing data is invalid, payment cannot be verified, fraud indicators are detected, or campaign conditions are violated. If payment was captured, refund handling follows the payment provider timeline.',
    },
    {
        heading: 'Unlawful Or Prohibited Activities',
        body: 'You may not use this site for unlawful purposes, unauthorized automation, scraping of private data, reverse engineering, or attempts to gain access to restricted resources. Violations may result in suspended access and legal escalation.',
    },
    {
        heading: 'Limitation Of Liability',
        body: 'The service is provided on an as-available basis. To the extent permitted by law, VisualAlign is not liable for indirect losses, business interruption, or data-related issues resulting from temporary downtime or external third-party service failures.',
    },
    {
        heading: 'Contact And Updates',
        body: 'These terms may be revised over time. Material updates are posted on this page. For clarification, contact the support channels listed on the contact page and include relevant order references when available.',
    },
];

function TermsPage() {
    return (
        <AccessDocumentLayout
            title="Terms"
            activeKey="terms"
            sections={termsSections}
        />
    );
}

export default TermsPage;
