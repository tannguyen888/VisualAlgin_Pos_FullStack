# Project Dream No.1

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=fff)

---

## Overview

**Project Dream No.1** is a modern web platform for eyewear retail operations, combining customer shopping and internal store workflows into a single unified system.

This repository contains the **frontend application**, including:
- Customer shopping experience
- Role-based authentication flows
- Checkout and payment integration
- Operational dashboards for staff and admin

The backend is currently **private** to protect sensitive business logic and production data.

---

## User Journeys

### 🛍 Customer Flow
- Public product browsing
- Account-based checkout
- Stripe payment integration
- Order history & account management

###  Cashier Flow
- Shift-based dashboard
- Cart & payment handling
- Customer lookup
- Order processing & refund support

###  Admin Flow
- Branch-level operational overview
- Employee management
- Product & inventory management
- Sales analytics & reporting

---

## Why the Backend is Private

The backend is not publicly available at this stage to ensure:

- Protection of sensitive database schemas
- Internal business rules and workflows
- Security and authentication mechanisms
- Environment-specific credentials and integrations

A sanitized API contract may be released in the future for collaboration purposes.

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Stripe JS SDK

### Backend (Private)
- Java Spring Boot
- Spring Security (JWT + OAuth2)
- MySQL
- Stripe Server-side Integration

---

## Key Features

- Role-based routing (User / Cashier / Admin)
- Secure authentication & session handling
- Public storefront with protected checkout
- Stripe payment integration
- Customer order history
- Cashier shift operations dashboard
- Admin management system

---

## Authentication Model

- Customer login for shopping & checkout
- Staff login for cashier/admin workflows
- OAuth2 success handoff flow
- Protected route guards with role normalization

---
## Routes

### Public
- /store
- /store/cart
- /store/checkout
- /user/login
- /register

### Staff
- /staff/login
- /cashier
- /admin

---
## Environment Setup
Run Project
---------------
npm install
---------------
npm run dev
---------------
npm run build
---------------
npm run test:unit
---------------
### Required Environment Variables

env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here

License

Frontend: MIT License
Backend: Private (proprietary business logic & data protection)
