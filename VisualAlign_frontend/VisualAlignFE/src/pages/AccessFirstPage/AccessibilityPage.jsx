import { AccessDocumentLayout } from '@/components/firstPage';

const accessibilitySections = [
    {
        heading: 'Our Commitment',
        body: 'We are committed to making this service usable for all users, including people using assistive technologies such as screen readers, keyboard-only navigation, and magnification tools.',
    },
    {
        heading: 'Visual Design And Readability',
        body: 'Interfaces are designed with clear hierarchy, readable type, consistent spacing, and predictable interaction patterns. We aim to preserve contrast and clarity across common display sizes.',
    },
    {
        heading: 'Keyboard Support',
        body: 'Core workflows are intended to work with keyboard controls. Focus states and tab order are reviewed to ensure critical actions remain reachable without pointing devices.',
    },
    {
        heading: 'Screen Reader Semantics',
        body: 'We improve semantic structure and labeling of interactive elements to help screen reader users understand page context, action purpose, and status changes.',
    },
    {
        heading: 'Ongoing Improvements',
        body: 'Accessibility is a continuous process. We evaluate new pages and existing flows regularly, especially after major UI updates or route-level behavior changes.',
    },
    {
        heading: 'Feedback And Support',
        body: 'If you encounter accessibility barriers, please share page URL, device type, browser, and assistive tech details through support channels so we can investigate and prioritize improvements quickly.',
    },
];

function AccessibilityPage() {
    return (
        <AccessDocumentLayout
            title="Accessibility"
            activeKey="accessibility"
            sections={accessibilitySections}
        />
    );
}

export default AccessibilityPage;
