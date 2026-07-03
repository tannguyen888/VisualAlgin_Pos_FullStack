Project Dream No.1

Project Dream No.1 is a modern web platform for eyewear and retail operations, built to support both customer shopping and in-store team workflows in one product experience.

This public repository focuses on the frontend application, including store browsing, role-based login flows, checkout, and operational dashboards. The backend is currently private to protect production-sensitive business logic and internal data structures.

Overview

Project Dream No.1 is designed around three user journeys:

Customer journey
Public product browsing
Account-based checkout
Stripe payment flow
Order visibility and account-driven purchasing
Cashier journey
Shift-oriented dashboard
Cart and payment tools
Customer lookup and order history
Refund support
Admin journey
Branch-level operations view
Employee management
Product and inventory management
Sales and operational reports
Why the backend is private right now

The backend is intentionally not public at this stage for data protection and system integrity reasons.

This includes:

Sensitive database schema and operational workflows
Internal business rules for employee and order processing
Security controls and service integrations
Environment-specific deployment and credential handling
A public API contract and sanitized backend samples may be published later as the platform hardens for open collaboration.

Tech stack

Frontend

React 19
Vite
React Router
TanStack Query
Tailwind CSS
shadcn UI components
Stripe JS SDK
Backend (private)

Java Spring Boot
Spring Security with JWT and OAuth2
MySQL
Stripe server-side integration
Key features in the current frontend

Role-based access and routing for user, cashier, and admin
Public storefront with guarded checkout
Cart and checkout flows
Stripe redirect checkout integration
Customer manager and order history views
Shift summary and cashier operation screens
Admin production and employee management pages
Authentication model

User login for shopping and checkout
Staff login for cashier and admin workflows
OAuth success handoff flow supported in frontend routes
Session-based role normalization and protected route guards
Environment setup

Frontend environment variables

VITE_API_BASE_URL
VITE_STRIPE_PUBLISHABLE_KEY
Example local values:

VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here

Run locally

Install dependencies
npm install

Start development server
npm run dev

Build production assets
npm run build

Run unit tests
npm run test:unit

Route highlights

Public and account

/access
/store
/store/cart
/store/checkout
/user/login
/register
Staff and operations

/staff/login
/cashier
/admin
Project status

The frontend is under active development and aligned with a private backend used for real data operations. Interfaces and flows may continue to evolve as reporting, checkout confirmation handling, and deployment hardening are finalized.

Contributing

At this stage, contributions are focused on frontend quality, usability, and architecture consistency. If you want to collaborate, open an issue with:

Context
Proposed change
Expected behavior
Screenshots or reproduction steps when relevant
License

License terms are not finalized yet. A formal license file will be added before broader public release.
