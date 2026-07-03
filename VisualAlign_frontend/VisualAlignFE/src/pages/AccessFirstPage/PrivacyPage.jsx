import { AccessDocumentLayout } from '@/components/firstPage';

const privacySections = [
    {
        heading: 'Information We Collect',
        body: 'We collect account information, transactional data, checkout metadata, and basic device/network information required for account security and order processing.',
    },
    {
        heading: 'How Data Is Used',
        body: 'Collected data is used to authenticate users, process orders, deliver receipts, support customer service, and improve reliability. Operational analytics may be used to monitor performance and detect suspicious behavior.',
    },
    {
        heading: 'Cookies And Session Data',
        body: 'Cookies and session storage are used for login continuity, preferences, and security checks. You can disable cookies in your browser, but some features may not function properly.',
    },
    {
        heading: 'Security Controls',
        body: 'We apply access control, role-based permissions, token validation, and monitoring mechanisms to reduce unauthorized access and misuse. Sensitive processing is restricted to authorized components and systems.',
    },
    {
        heading: 'Data Sharing',
        body: 'We do not sell personal data. Data may be shared with payment processors, hosting providers, and operational vendors strictly for service delivery, legal compliance, and fraud prevention.',
    },
    {
        heading: 'Retention And Rights',
        body: 'Data retention follows legal and operational requirements. Where permitted by law, users may request access, correction, or deletion of personal information subject to identity verification and mandatory retention exceptions.',
    },
    {
        heading: 'Policy Updates',
        body: 'This policy may be updated periodically as features evolve. Significant changes are posted here with an updated effective date so you can review and decide whether to continue using the service.',
    },
];

function PrivacyPage() {
    return (
        <AccessDocumentLayout
            title="Privacy"
            activeKey="privacy"
            sections={privacySections}
        />
    );
}

export default PrivacyPage;
