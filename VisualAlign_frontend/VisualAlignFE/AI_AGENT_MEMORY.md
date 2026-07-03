# VisualAlign Frontend Agent Memory

## Purpose
- Fast handoff doc for any AI coding agent working in VisualAlign frontend.
- Keep this file updated whenever routes, auth flow, or service integration changes.

## Stack and Conventions
- React + Vite + React Router + TanStack Query + Tailwind/shadcn.
- Path alias `@/` points to `src/`.
- Use service files under `src/services` for API calls.
- Session auth state is centralized in `src/lib/authSession.js`.

## Current Auth Flow
- User login page: `/user/login` (`src/pages/Login/loginPage.jsx`) calls backend `POST /auth/login`.
- Staff login page: `/staff/login` (`src/pages/Login/StaffLoginPage.jsx`) calls backend `POST /auth/login` and only accepts `admin`/`cashier` normalized roles.
- Register page calls backend `POST /auth/register` via `src/services/authService.js` with role `ROLE_USER`.
- Successful response shape expected: `{ jwt, message, user }`.
- Session payload stored in `sessionStorage` key `visualalign.auth`:
  - `token` (jwt)
  - `user` (UserDto)
  - `role` (normalized: `user` | `cashier` | `admin`)
  - `rawRole` (backend enum role)
- Google OAuth frontend flow:
  - Start: redirect user to backend `${API_BASE_URL}/oauth2/authorization/google`
  - Backend callback redirects to frontend `/oauth-success?token=...`
  - Frontend page `src/pages/Login/OAuthSuccessPage.jsx` calls `/auth/me`, then stores session and redirects by role.
- API client no longer forces `Content-Type` on GET requests; this reduces unnecessary preflight and avoids OAuth callback fetch issues.

## Role Rules
- `user`:
  - Allowed pages: `/store`, `/shopslider`, `/store/cart`, `/store/checkout`
  - No cashier or admin dashboard access
- `cashier`:
  - Allowed pages: `/cashier/**`
  - No admin dashboard access
- `admin`:
  - Allowed pages: `/admin/**`
  - Also allowed `/cashier/**`

## Route Defaults
- Root path `/` redirects to `/access`.
- Access title page (`/access`) now has separate actions for `user login` and `staff login`.
- Role protection is enforced by `src/components/auth/RoleGuard.jsx`.
- Store browsing is public: `/store`, `/shopslider`, `/store/cart`, `/store/checkout`.
- User purchase security is enforced at checkout action time: `/store/checkout` redirects to `/user/login` if no JWT.
- Staff protected routes redirect unauthenticated access to `/staff/login` and preserve destination state.
- After successful login, if `location.state.redirectTo` exists and role is `user`, login page navigates back to the pending checkout route.
- Frontend has explicit register route: `/register` (`src/pages/Login/SignUpPage.jsx`).

## Cart and Checkout State
- New shared cart state provider: `src/context/CartContext.jsx`.
- Two independent scopes are persisted in session storage:
  - `user` cart for storefront routes (`/store/cart`, `/store/checkout`).
  - `staff` cart for POS routes (`/cashier/cart`, `/admin/cart`, payment pages).
- Staff cart/payment no longer use hard-coded initial items or customer data.
- `Cancel Order` actions now clear relevant cart state and navigate predictably.
- User checkout supports Stripe initiation through `src/services/stripeService.js` using backend endpoint `POST /api/payments/stripe/checkout-session`.

## Access Page Design Notes
- `AccessDocumentLayout` currently follows the user's original access-title legal style:
  - Gray page background
  - Compact top legal nav (`terms/privacy/faq/accessibility`)
  - Center legal box with internal vertical scroll
  - Functional bottom link row (`shop/view all/preview/lookbook/news`)
- Legal content pages (`Terms`, `Privacy`, `FAQ`, `Accessibility`) now contain longer generated editorial copy for realistic content density.
- Random category has a dedicated page `RandomShowcasePage` with a Supreme-inspired grid gallery blended with Project Dream styling.
- Front-page action buttons use red background styling (`bg-red-600` / hover `bg-red-700`) per user preference.
- Shared logo component (`LogoAndCurrentTime`) links to `/access`, so clicking logo on pages using this component always returns to Access Title page.

## Backend Integration
- Generic API helper: `src/services/apiClient.js` (adds Bearer token automatically when available).
- Product fetch in `src/services/productionService.js`:
  - Primary: `GET /api/products/getAll`
  - Fallback: in-memory mock data if API fails
- Payment confirm in `src/pages/cashier/CustomerPaymentSection/PaymentDialog.jsx`:
  - Primary: `POST /api/orders/create` via `src/services/orderService.js`
  - Keeps local `applyOrderSale` update to preserve current inventory/sales UI behavior.

## Shop Product Detail Behavior
- In `src/pages/store/productListingStore.jsx`, clicking a product card opens a detail modal with full product info (name, sku, brand, category, stock, price, mrp, description).
- Modal includes `add to cart` which routes to `/store/cart` and passes `preselectedProduct` in route state.
- `src/pages/cashier/CartSection/CartPage.jsx` consumes `preselectedProduct` and upserts the item into cart.

## Files Updated in This Change
- Added:
  - `src/lib/authSession.js`
  - `src/components/auth/RoleGuard.jsx`
  - `src/services/apiClient.js`
  - `src/services/authService.js`
  - `src/services/orderService.js`
  - `src/pages/Login/OAuthSuccessPage.jsx`
- Updated:
  - `src/pages/Login/SignUpPage.jsx`
  - `src/pages/Login/loginPage.jsx`
  - `src/routes/index.jsx`
  - `src/services/authService.js`
  - `src/services/apiClient.js`
  - `src/services/authService.js`
  - `src/services/productionService.js`
  - `src/pages/store/productListingStore.jsx`
  - `src/pages/cashier/CartSection/CartPage.jsx`
  - `src/components/firstPage/AccessDocumentLayout.jsx`
  - `src/pages/AccessFirstPage/RandomShowcasePage.jsx`
  - `src/pages/AccessFirstPage/AccessCategoryPage.jsx`
  - `src/components/firstPage/TermAndPrivacy.jsx`
  - `src/pages/AccessFirstPage/TermsPage.jsx`
  - `src/pages/AccessFirstPage/PrivacyPage.jsx`
  - `src/pages/AccessFirstPage/FqaPage.jsx`
  - `src/pages/AccessFirstPage/AccessibilityPage.jsx`
  - `src/pages/store/productListingStore.jsx`
  - `src/pages/store/shopSlider.jsx`
  - `src/pages/Login/loginPage.jsx`
  - `src/pages/AccessFirstPage/AccessTitlePage.jsx`
  - `src/pages/Header/storePageHeader.jsx`
  - `src/pages/store/MainPageStore.jsx`
  - `src/pages/cashier/CartSection/CartPage.jsx`
  - `src/routes/index.jsx`
  - `src/pages/cashier/CustomerPaymentSection/CustomerPaymentSection.jsx`
  - `src/pages/AccessFirstPage/AccessCategoryPage.jsx`
  - `src/routes/accessRoutes.jsx`
  - `src/routes/cashierRoutes.jsx`
  - `src/routes/adminRoutes.jsx`
  - `src/App.jsx`
  - `src/services/productionService.js`

## Important Notes for Next Agents
- Do not re-introduce local mock login users in UI components.
- Keep role normalization in one place (`authSession.js`).
- If backend starts returning stock/category fields differently, update only `fetchProducts` mapper in `productionService.js`.
- If role names change in backend enum, update the sets in `authSession.js`.

## Latest Integration Update (2026-07-03)
- Shift login/logout is now DB-backed:
  - Staff login page (`src/pages/Login/StaffLoginPage.jsx`) calls `ensureShiftStartedForUser` after successful `/auth/login`.
  - Logout modal (`src/components/ConfirmLogout/ConfirmLogout.jsx`) calls `endActiveShiftForUser` before clearing session.
- Shift summary widgets are DB-backed through `src/services/shiftDashboardService.js` and no longer use hardcoded arrays:
  - `ShiftInformation`, `SalesSummaryCard`, `PaymentSummaryCard`, `TopSellingItem`, `RecentOrdersTable`, `RefundsTable`.
- Order history (`src/pages/cashier/OrderHistory/OrderHistory.jsx`) now fetches real orders:
  - Admin: branch orders (`/api/orders/branch/{branchId}/filter`)
  - Cashier: cashier orders (`/api/orders/cashier/{id}`)
- Production/Stock is DB-backed with product + inventory APIs:
  - Product CRUD: `/api/products/create`, `/api/products/{id}` (PUT/DELETE)
  - Inventory stock by branch: `/api/inventories/branch/{branchId}`, `/api/inventories/product/{productId}/branch/{branchId}`, `/api/inventories/update/{id}`, `/api/inventories/create`
  - Category source for forms: `/api/categories/store/{storeId}`
- New/updated frontend services:
  - Added: `src/services/shiftService.js`, `src/services/refundService.js`, `src/services/shiftDashboardService.js`
  - Expanded: `src/services/orderService.js`, `src/services/productionService.js`
- `TotalSalepage` is now read-only DB analytics; inline mock edit of sold units was removed.

## Stripe Integration Update (2026-07-03)
- Frontend Stripe checkout already calls `POST /api/payments/stripe/checkout-session` via `src/services/stripeService.js`.
- Backend endpoint is now implemented at `src/main/java/com/VisualAlign/VisualAlign/controller/StripePaymentController.java`.
- Request payload uses `items`, `customerEmail`, `successUrl`, `cancelUrl`.
- Response payload returns both `sessionId` and `url` so frontend can redirect reliably.
- Required keys:
  - Frontend: `VITE_STRIPE_PUBLISHABLE_KEY`
  - Backend: `stripe.secret-key` (mapped from `STRIPE_SECRET_KEY` env)
