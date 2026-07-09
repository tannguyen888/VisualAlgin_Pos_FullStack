# VisualAlign Project Memory

## Purpose
- Keep a compact, high-signal map of the backend and auth flow so future agents can continue without re-scanning the whole project.
- Update this file whenever auth flow, entity contracts, or project conventions change.

## Current Stack
- Spring Boot backend with Spring Security, OAuth2 client, JWT, JPA, and MySQL.
- Main package root: `com.VisualAlign.VisualAlign`.

## Auth Flow
- Password login uses `AuthServiceimplement` -> `CustomerUserImplementation` -> JWT generation.
- Google login uses `CustomOAuth2UserService` -> `CustomOAuth2User` -> `SecurityConfig` success handler -> `UserService.processOAuthPostLogin()` -> JWT generation.
- OAuth users must not be reloaded through the password-only path to build the JWT.

## User Entity Rules
- `User.password` is nullable for OAuth accounts.
- OAuth users default to `Provider.GOOGLE`, `ROLE_USER`, and no password.
- If `fullName` is missing from the provider, use the email as a fallback.
- `lastLogin` should be updated on successful OAuth login the same way as password login.

## OAuth Runtime Compatibility Note
- Some existing MySQL schemas still enforce `user.password` as `NOT NULL`.
- `UserServiceimplement.processOAuthPostLogin()` now sets an encoded placeholder password for OAuth-created accounts to avoid insert failures (`Column 'password' cannot be null`).
- Existing OAuth users with blank/null passwords are also backfilled with placeholder hash on login.
- Circular dependency note: avoid injecting `PasswordEncoder` bean into `UserServiceimplement` because `SecurityConfig` depends on `UserService`, which can create a bean cycle (`SecurityConfig <-> UserServiceimplement`). Current implementation uses local `BCryptPasswordEncoder` for OAuth placeholder hashing.

## Important Files
- Security config: `src/main/java/com/VisualAlign/VisualAlign/configuration/SecurityConfig.java`
- OAuth principal wrapper: `src/main/java/com/VisualAlign/VisualAlign/service/CustomOAuth2User.java`
- OAuth user service: `src/main/java/com/VisualAlign/VisualAlign/service/impl/CustomOAuth2UserService.java`
- Password user loader: `src/main/java/com/VisualAlign/VisualAlign/service/impl/CustomerUserImplementation.java`
- User entity: `src/main/java/com/VisualAlign/VisualAlign/modal/User.java`
- User service contract and implementation: `src/main/java/com/VisualAlign/VisualAlign/service/UserService.java` and `src/main/java/com/VisualAlign/VisualAlign/service/impl/UserServiceimplement.java`

## Notes for Future Changes
- Keep one canonical OAuth post-login method in `UserService`.
- Prefer building JWTs from the authenticated app role, not from password-login user details, for OAuth accounts.
- Keep nullable entity columns documented here whenever a field becomes optional.

## Frontend Integration Snapshot (2026-07-01)
- Frontend login is integrated with backend `POST /auth/login` and stores `{ jwt, user, role }` in session key `visualalign.auth`.
- Frontend reads products from backend `GET /api/products/getAll` with mock fallback when API is unavailable.
- Frontend checkout confirmation submits order to backend `POST /api/orders/create`.
- Backend CORS includes both local frontend origins: `http://localhost:3000` and `http://localhost:5173`.
- Frontend Google OAuth integration:
	- Start URL: `/oauth2/authorization/google`
	- Success redirect target expected by frontend: `/oauth-success?token=...`
	- Frontend then calls `/auth/me` with bearer token to resolve user profile and role.
- CORS allowed headers were expanded to include `Authorization`, `Content-Type`, `Accept`, `Origin`, and `X-Requested-With` to support frontend login/OAuth flows reliably.
- Important config pitfall: root-level `application.yml` can override `src/main/resources/application.properties` when running from project root.
	- If it contains placeholder OAuth values (`YOUR_GOOGLE_CLIENT_ID`), Google login fails with `401 invalid_client`.
	- Keep root `application.yml` Google OAuth values valid or env-backed.
- Role mapping used by frontend:
	- `ROLE_USER` -> `user` -> routes under `/store`
	- `ROLE_BRANCH_CASHIER` -> `cashier` -> routes under `/cashier`
	- `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_BRANCH_MANAGER`, `ROLE_STORE_MANAGER`, `ROLE_STORE_ADMIN` -> `admin` -> routes under `/admin`

## Frontend UX/Auth Routing Update (2026-07-01)
- Login flow is split:
	- User login: `/user/login` (checkout/public user flow)
	- Staff login: `/staff/login` (cashier/admin portal only)
- RoleGuard now redirects unauthenticated staff routes to `/staff/login` instead of shared `/login`.
- Storefront now uses dedicated user cart and checkout pages:
	- `/store/cart`
	- `/store/checkout`
- Stripe checkout integration was added on frontend (client SDK + API call to `POST /api/payments/stripe/checkout-session`), requiring `VITE_STRIPE_PUBLISHABLE_KEY`.

## SQL Mock Seed Added
- File: `src/main/resources/sql/mock_car_products.sql`
- Purpose: insert car-related mock products into `product` table.
- Requires setting `@STORE_ID` and `@CATEGORY_ID` before executing.

## Frontend Files Added/Updated (for role routing + backend login)
- Added:
	- `VisualAlign_frontend/VisualAlignFE/src/lib/authSession.js`
	- `VisualAlign_frontend/VisualAlignFE/src/components/auth/RoleGuard.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/services/apiClient.js`
	- `VisualAlign_frontend/VisualAlignFE/src/services/authService.js`
	- `VisualAlign_frontend/VisualAlignFE/src/services/orderService.js`
- Updated:
	- `VisualAlign_frontend/VisualAlignFE/src/pages/Login/loginPage.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/pages/AccessFirstPage/AccessTitlePage.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/pages/Header/storePageHeader.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/pages/store/MainPageStore.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/pages/cashier/CartSection/CartPage.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/routes/index.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/routes/accessRoutes.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/routes/cashierRoutes.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/routes/adminRoutes.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/App.jsx`
	- `VisualAlign_frontend/VisualAlignFE/src/services/productionService.js`

## Integration Update (2026-07-03)
- Shift lifecycle is now integrated into staff auth UX:
	- On staff login success, frontend immediately calls `POST /api/shift-reports/start?cashierId=...&branchId=...`.
	- On logout confirm, frontend resolves active shift via `GET /api/shift-reports/cashier/{cashierId}/active` and closes it with `PUT /api/shift-reports/{shiftReportId}/end`.
- Cashier/admin order history no longer uses mock arrays:
	- Cashier route uses `GET /api/orders/cashier/{id}`.
	- Admin branch view uses `GET /api/orders/branch/{branchId}/filter`.
- Shift dashboard cards now compute from DB data instead of hardcoded numbers:
	- Orders: `GET /api/orders/branch/{branchId}/filter`, `GET /api/orders/recent/{branchId}`
	- Refunds: `GET /api/refunds/branch/{branchId}`
	- Shift meta: `GET /api/shift-reports/cashier/{cashierId}/active` or latest cashier shift fallback.
- Production/Stock admin screen now uses real CRUD:
	- Product CRUD: `/api/products/create`, `/api/products/{id}` (PUT/DELETE)
	- Stock per branch via inventory endpoints: `/api/inventories/branch/{branchId}`, `/api/inventories/product/{productId}/branch/{branchId}`, `/api/inventories/update/{id}`, `/api/inventories/create`
	- Categories from `/api/categories/store/{storeId}`.

## Stripe Checkout Integration (2026-07-03)
- Added backend endpoint: `POST /api/payments/stripe/checkout-session`.
- Controller file: `src/main/java/com/VisualAlign/VisualAlign/controller/StripePaymentController.java`.
- Request DTOs:
	- `StripeCheckoutSessionRequest`
	- `StripeCheckoutItemRequest`
- Response DTO:
	- `StripeCheckoutSessionResponse` (`sessionId`, `url`).
- Backend config key:
	- `stripe.secret-key=${STRIPE_SECRET_KEY:}` in `src/main/resources/application.properties`.
- Frontend checkout page (`/store/checkout`) already calls this endpoint through `src/services/stripeService.js`.