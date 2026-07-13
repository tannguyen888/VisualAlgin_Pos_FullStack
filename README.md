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

## CI/CD Pipeline

Dự án sử dụng **GitHub Actions** để tự động build và deploy lên server production mỗi khi có code mới được push lên nhánh `main`.

### Luồng hoạt động

```
Push code lên main
       ↓
GitHub Actions chạy CI (backend + frontend)
       ↓
Build Docker image → Push lên GHCR
       ↓
SSH vào VPS → docker compose pull → docker compose up -d
       ↓
Production cập nhật tự động
```

### Các job trong workflow

| Job | Mô tả |
|-----|-------|
| `backend-ci` | Compile Spring Boot (Java 17) |
| `frontend-ci` | Build Vite + chạy unit tests |
| `docker-cd` | Build & push Docker image lên GHCR |
| `deploy-vps` | SSH vào VPS và deploy container mới |

> ⚠️ **Lưu ý:** Workflow chỉ trigger khi có thay đổi trong thư mục `VisualAlign/VisualAlign/**`, `VisualAlign_frontend/VisualAlignFE/**`, hoặc file workflow.

### GitHub Secrets cần thiết

Cần thiết lập các secrets sau trong **Repository → Settings → Secrets and variables → Actions**:

| Secret | Mô tả |
|--------|-------|
| `VPS_HOST` | IP hoặc domain của VPS |
| `VPS_USER` | User SSH trên VPS (ví dụ: `ubuntu`) |
| `VPS_SSH_KEY` | Private key SSH (bắt đầu bằng `-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `VPS_PORT` | Cổng SSH (mặc định: `22`) |
| `VPS_DEPLOY_PATH` | Thư mục deploy trên VPS (ví dụ: `/opt/visualalign`) |
| `GHCR_USERNAME` | GitHub username có quyền pull image |
| `GHCR_TOKEN` | Personal Access Token với quyền `read:packages` |

> 📄 Xem hướng dẫn chi tiết tại [`README_DEPLOY_PRODUCTION.md`](./README_DEPLOY_PRODUCTION.md)

---

## Environment Setup

### Yêu cầu

- Node.js >= 20
- npm >= 9
- Java 17 (cho backend)
- Docker & Docker Compose (cho production)

### Chạy Frontend (Development)

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường dev
npm run dev

# Build production
npm run build

# Chạy unit tests
npm run test:unit
```

### Biến môi trường

Tạo file `.env` trong thư mục `VisualAlign_frontend/VisualAlignFE/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
```

| Biến | Mô tả |
|------|-------|
| `VITE_API_BASE_URL` | URL của backend API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (lấy từ [Stripe Dashboard](https://dashboard.stripe.com)) |

---

## License

- **Frontend:** MIT License
- **Backend:** Private (proprietary business logic & data protection)
