# QuickStoreMobile

**Stack:** Expo SDK ~56.0, React Native 0.85, React 19, TypeScript 6 (strict)

**Commands:** `npm start` (dev server), `npm run ios/android/web`

**No lint, format, or test tooling configured.**

## Expo SDK 56
Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.


# QuickStore Mobile App — AGENTS.md

## Project Overview

QuickStore Mobile is a React Native + Expo mobile application for the QuickStore premium
e-commerce platform. This app connects to the existing FastAPI backend deployed on Render.
No new backend or database setup is required — the mobile app only makes API calls to the
existing server.

- **Web App (Reference)**: https://quick-store-qdo4.vercel.app
- **Backend API**: https://quick-store-omf3.onrender.com
- **GitHub Repo**: https://github.com/HusbanTech12/quick_store

---

## Backend Info

| Property        | Value                                        |
|-----------------|----------------------------------------------|
| Framework       | FastAPI (Python)                             |
| Database        | PostgreSQL (Neon) — already connected        |
| Auth            | JWT (python-jose + passlib bcrypt)           |
| Login Format    | OAuth2 form-data (username + password)       |
| Token Type      | Bearer token in Authorization header         |
| Render Note     | Free tier — first request may be slow (cold start), handle gracefully |

---

## Mobile Tech Stack

| Layer            | Technology                          | Purpose                            |
|------------------|-------------------------------------|------------------------------------|
| Framework        | React Native + Expo (SDK 56)        | Cross-platform mobile development  |
| Navigation       | Expo Router (file-based)            | Same as Next.js App Router         |
| Styling          | NativeWind v4 (Tailwind syntax)     | Utility-first styling for RN       |
| State            | Zustand                             | Same as web app                    |
| Data Fetching    | TanStack React Query + Axios        | API calls + caching                |
| Auth Storage     | expo-secure-store                   | Secure JWT token storage           |
| Payments         | @stripe/stripe-react-native         | Stripe card payments               |
| Language         | TypeScript (strict)                 | Type safety                        |
| Icons            | lucide-react-native                 | Same icon set as web               |
| Images           | expo-image                          | Better performance + caching       |

---

## Design System

Copied from the web app — same brand identity, different layout.

### Color Tokens (tailwind.config.js extend.colors)

```javascript
colors: {
  brand:      '#0066ff',   // Primary actions, buttons, links
  accent:     '#00a86b',   // Secondary actions
  success:    '#10b981',   // Success states, in-stock badge
  warning:    '#f59e0b',   // Warning states, low-stock badge
  error:      '#ef4444',   // Error states
  background: '#09090b',   // Dark mode page background
  card:       '#18181b',   // Card backgrounds
  foreground: '#fafafa',   // Primary text
  muted:      '#71717a',   // Secondary text
  border:     '#27272a',   // Borders, dividers
}
```

### Typography
- Font: System default (or Inter via expo-google-fonts)
- Headings: font-bold, text-foreground
- Body: font-normal, text-foreground
- Muted: text-muted

### Default Theme
- Always dark theme by default (background: #09090b)
- Same dark aesthetic as the web app

---

## Critical Code Generation Rules

> These rules must be followed for every single file generated.

1. **NO HTML tags ever** — never use `div`, `span`, `h1`, `h2`, `h3`, `p`, `button`, `input`, `img`, `a`
2. **Always use React Native components** — `View`, `Text`, `TextInput`, `TouchableOpacity`, `Pressable`, `Image`, `ScrollView`, `FlatList`, `SafeAreaView`
3. **Always NativeWind** — use `className` with Tailwind utility classes for all styling
4. **Always TypeScript** — no plain JavaScript, no `any` type, define proper interfaces
5. **Always Expo Router** — use `useRouter()`, `Link`, `useLocalSearchParams()` from `expo-router`
6. **API calls via lib/api.ts only** — never call `fetch()` or `axios` directly inside components
7. **Auth token via lib/auth.ts only** — never access `expo-secure-store` directly in components
8. **Always handle loading state** — show `Skeleton` or `ActivityIndicator` during API calls
9. **Always handle error state** — show error message + retry button on API failure
10. **Always handle empty state** — show `EmptyState` component when no data exists
11. **Pull-to-refresh on all list screens** — use `RefreshControl` in `ScrollView` or `FlatList`
12. **Dark theme always** — never use white backgrounds, always use `bg-background` or `bg-card`
13. **Render cold start** — show a friendly loading message on first app open, backend may take ~15s

---

## Project Folder Structure

```
QuickStoreMobile/
├── app/
│   ├── _layout.tsx                  ← Root layout: fonts, providers, auth guard
│   ├── index.tsx                    ← Entry: redirect to (tabs) or (auth)
│   ├── (auth)/
│   │   ├── _layout.tsx              ← Auth layout: no tab bar
│   │   ├── login.tsx                ← Login screen
│   │   └── register.tsx             ← Register screen
│   ├── (tabs)/
│   │   ├── _layout.tsx              ← Bottom tab bar layout
│   │   ├── index.tsx                ← Home screen (featured + categories)
│   │   ├── products.tsx             ← All products (search + filter)
│   │   ├── cart.tsx                 ← Cart screen
│   │   └── profile.tsx             ← User profile + logout
│   ├── product/
│   │   └── [id].tsx                 ← Product detail screen
│   ├── checkout.tsx                 ← 3-step checkout flow
│   ├── orders.tsx                   ← Order history list
│   └── order/
│       └── [id].tsx                 ← Single order detail
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx               ← Variants: primary, secondary, ghost, danger
│   │   ├── Input.tsx                ← Label + error + keyboard type support
│   │   ├── Badge.tsx                ← Status: In Stock, Low Stock, Out of Stock
│   │   ├── Skeleton.tsx             ← Loading placeholder blocks
│   │   ├── Toast.tsx                ← Notification: success, error, warning, info
│   │   └── EmptyState.tsx           ← Empty state with icon + message + CTA
│   ├── ProductCard.tsx              ← Image, name, price, stock badge, add to cart
│   ├── CartItem.tsx                 ← Cart row: image, name, qty controls, remove
│   ├── OrderCard.tsx                ← Order summary: ID, date, total, status
│   ├── Header.tsx                   ← Screen header with optional back button
│   └── CheckoutStepper.tsx          ← 3-step progress: Shipping → Payment → Review
│
├── lib/
│   ├── api.ts                       ← Axios instance + all API functions
│   ├── auth.ts                      ← Token save/get/remove via expo-secure-store
│   └── utils.ts                     ← formatPrice(), formatDate(), getInitials()
│
├── store/
│   ├── authStore.ts                 ← Zustand: user, token, login(), logout()
│   └── cartStore.ts                 ← Zustand: items, addToCart(), removeFromCart(), total
│
├── types/
│   └── index.ts                     ← All TypeScript interfaces
│
├── hooks/
│   ├── useProducts.ts               ← React Query hook for product list + detail
│   ├── useCart.ts                   ← Cart operations + optimistic updates
│   └── useOrders.ts                 ← React Query hook for orders
│
├── assets/
│   └── images/                      ← Logo, splash, app icon
│
├── .env                             ← Environment variables (never commit)
├── app.json                         ← Expo app configuration
├── tailwind.config.js               ← NativeWind config with brand colors
├── tsconfig.json                    ← TypeScript config
└── AGENTS.md                        ← This file
```

---

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://quick-store-omf3.onrender.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

> Note: All Expo env variables must start with `EXPO_PUBLIC_` to be accessible in the app.

---

## API Endpoints Reference

### Authentication

| Method | Endpoint          | Auth Required | Request Body                              | Response                         |
|--------|-------------------|---------------|-------------------------------------------|----------------------------------|
| POST   | `/auth/register`  | No            | `{ email, username, password }`           | `{ access_token, token_type }`   |
| POST   | `/auth/login`     | No            | FormData: `username`, `password`          | `{ access_token, token_type }`   |
| GET    | `/auth/me`        | Yes (Bearer)  | —                                         | User object                      |

> **Important**: Login uses OAuth2 multipart/form-data format, NOT JSON.

### Products

| Method | Endpoint                | Auth Required | Description                    |
|--------|-------------------------|---------------|--------------------------------|
| GET    | `/products/`            | No            | List products (filterable)     |
| GET    | `/products/categories`  | No            | Get all category names         |
| GET    | `/products/{id}`        | No            | Get single product by ID       |

**Query Parameters for GET `/products/`:**

| Param          | Type    | Default | Description                        |
|----------------|---------|---------|------------------------------------|
| `skip`         | int     | 0       | Pagination offset                  |
| `limit`        | int     | 20      | Items per page                     |
| `category`     | string  | —       | Filter by category name            |
| `min_price`    | float   | —       | Minimum price filter               |
| `max_price`    | float   | —       | Maximum price filter               |
| `search`       | string  | —       | Search in name and description     |
| `sort_by`      | string  | —       | `price`, `name`, or `created_at`   |
| `sort_order`   | string  | —       | `asc` or `desc`                    |
| `featured_only`| bool    | false   | Only return featured products      |

### Orders

| Method | Endpoint       | Auth Required | Description                      |
|--------|----------------|---------------|----------------------------------|
| POST   | `/orders/`     | Yes           | Create a new order               |
| GET    | `/orders/`     | Yes           | Get all orders for current user  |
| GET    | `/orders/{id}` | Yes           | Get single order by ID           |

---

## TypeScript Interfaces (types/index.ts)

```typescript
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface ApiError {
  detail: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
```

---

## lib/api.ts Template

```typescript
import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s for Render cold starts
});

// Auto-attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = (data: {
  email: string;
  username: string;
  password: string;
}) => api.post('/auth/register', data);

export const loginUser = (username: string, password: string) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  return api.post('/auth/login', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCurrentUser = () => api.get('/auth/me');

// ── Products ─────────────────────────────────────────────────────────────────

export const getProducts = (params?: {
  skip?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  featured_only?: boolean;
}) => api.get('/products/', { params });

export const getCategories = () => api.get('/products/categories');

export const getProductById = (id: number) => api.get(`/products/${id}`);

// ── Orders ───────────────────────────────────────────────────────────────────

export const createOrder = (data: {
  items: { product_id: number; quantity: number }[];
  total_amount: number;
}) => api.post('/orders/', data);

export const getOrders = () => api.get('/orders/');

export const getOrderById = (id: number) => api.get(`/orders/${id}`);

export default api;
```

---

## lib/auth.ts Template

```typescript
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'quickstore_auth_token';

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
```

---

## Web to Mobile Component Mapping

| Web (Next.js / HTML)   | Mobile (React Native)         |
|------------------------|-------------------------------|
| `<div>`                | `<View>`                      |
| `<p>`, `<h1>`–`<h6>`  | `<Text>`                      |
| `<img>`                | `<Image>` or `<ExpoImage>`    |
| `<button>`             | `<TouchableOpacity>` or `<Pressable>` |
| `<input>`              | `<TextInput>`                 |
| `<ul>` + `.map()`      | `<FlatList>`                  |
| `<div style={{overflow: scroll}}>` | `<ScrollView>`   |
| `className` (Tailwind) | `className` (NativeWind)      |
| `localStorage`         | `AsyncStorage`                |
| `localStorage` (auth)  | `expo-secure-store`           |
| `useRouter` (Next.js)  | `useRouter` (expo-router)     |
| `<Link>` (Next.js)     | `<Link>` (expo-router)        |
| Navbar (top)           | Bottom Tab Bar                |
| Sidebar                | Drawer Navigator              |
| CSS hover effects      | Pressable `onPressIn`/`onPressOut` |
| CSS Grid               | Flexbox (NativeWind)          |
| `window.alert()`       | `Alert.alert()`               |
| `console.log()`        | `console.log()` (same)        |

---

## UI Component Specs

### Button.tsx
```
Variants: primary | secondary | ghost | danger
Sizes:    sm | md | lg
Props:    title, onPress, variant, size, loading, disabled, fullWidth
Behavior: Show ActivityIndicator when loading=true, disable press
```

### Input.tsx
```
Props:    label, placeholder, value, onChangeText, secureTextEntry,
          error, keyboardType, autoCapitalize, multiline
Behavior: Show red border + error message below on error
```

### ProductCard.tsx
```
Props:    product (Product), onPress, onAddToCart
Shows:    Image (aspect 1:1), name (2 lines max), price, stock badge, add button
Layout:   Card with bg-card, rounded-xl, shadow
```

### Badge.tsx
```
Types:    success (In Stock), warning (Low Stock), error (Out of Stock)
Logic:    stock > 10 → success, stock 1–10 → warning, stock 0 → error
```

### Skeleton.tsx
```
Props:    width, height, borderRadius, className
Effect:   Animated shimmer using Animated API
```

### Toast.tsx
```
Types:    success | error | warning | info
Props:    message, type, duration (default 3000ms)
Position: Top of screen, safe area aware
Usage:    Global showToast() function
```

### EmptyState.tsx
```
Props:    icon, title, description, ctaLabel, onCtaPress
Usage:    Empty cart, no orders, no products found
```

---

## Phase-Wise Feature Plan

---

### PHASE 1 — Foundation & Authentication
**Goal**: App runs, user can register and login, auth is protected.
**Timeline**: Week 1

**Features:**
- [ ] Expo project setup (SDK 56, TypeScript, NativeWind)
- [ ] tailwind.config.js with brand color tokens
- [ ] Expo Router layout structure (auth + tabs)
- [ ] lib/api.ts — Axios instance with interceptors
- [ ] lib/auth.ts — expo-secure-store token management
- [ ] types/index.ts — all TypeScript interfaces
- [ ] Zustand authStore.ts
- [ ] Login screen — username + password, JWT, redirect to tabs
- [ ] Register screen — email, username, password
- [ ] Auth guard in app/_layout.tsx — redirect to login if no token
- [ ] Auto-logout on 401 response (interceptor)
- [ ] Splash screen and app icon with brand colors

**Screens:**
- `app/_layout.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/register.tsx`

**OpenCode Prompt for Phase 1:**
```
Build the Login screen for QuickStore Mobile at app/(auth)/login.tsx.
Follow AGENTS.md rules strictly.
Requirements:
- React Native + NativeWind, dark theme (bg-background #09090b)
- Username TextInput and Password TextInput (secureTextEntry)
- Login button (brand color #0066ff) with loading state
- Call loginUser() from lib/api.ts (OAuth2 FormData format)
- Save token using saveToken() from lib/auth.ts
- Update Zustand authStore with user data from getCurrentUser()
- On success: router.replace('/(tabs)/')
- On error: show error message below the form
- "Don't have an account? Register" link at bottom
- Handle Render cold start: show "Connecting to server..." on slow response
```

---

### PHASE 2 — Home Screen & Product Browsing
**Goal**: Users can browse products, search, filter, and view details.
**Timeline**: Week 1–2

**Features:**
- [ ] Home screen — featured products + categories horizontal scroll + hero banner
- [ ] Products listing screen
  - FlatList with 2-column grid layout
  - Search bar with 500ms debounce
  - Category filter chips (horizontal ScrollView)
  - Price range filter (min/max inputs)
  - Sort options: price asc/desc, name, newest
  - Skeleton loaders while loading
  - Pull-to-refresh (RefreshControl)
  - Pagination — load more on scroll end
  - Empty state when no results
- [ ] Product detail screen
  - Full-width product image
  - Name, price, category badge
  - Stock status badge (In Stock / Low Stock / Out of Stock)
  - Quantity selector (+/- buttons, min 1, max stock_quantity)
  - Add to Cart button
  - Full description
  - Related products (same category, FlatList horizontal)
- [ ] ProductCard component
- [ ] Skeleton components for product grid and detail

**Screens:**
- `app/(tabs)/index.tsx` (Home)
- `app/(tabs)/products.tsx` (Products listing)
- `app/product/[id].tsx` (Product detail)

**OpenCode Prompt for Phase 2:**
```
Build the Products listing screen at app/(tabs)/products.tsx.
Follow AGENTS.md rules strictly.
Requirements:
- FlatList with numColumns=2, ProductCard in each cell
- Search TextInput at top with 500ms debounce
- Category filter: horizontal ScrollView with filter chips below search
- Call getProducts() from lib/api.ts with search + category params
- Use useProducts hook with TanStack React Query
- Loading: show Skeleton grid (2x3 placeholder cards)
- Empty: show EmptyState component with "No products found"
- Error: show error text with "Retry" button
- Pull-to-refresh with RefreshControl
- Load more on FlatList onEndReached (pagination)
- Dark theme throughout
```

---

### PHASE 3 — Shopping Cart & Checkout
**Goal**: Users can manage cart and complete purchases.
**Timeline**: Week 2

**Features:**
- [ ] Zustand cartStore with AsyncStorage persistence
  - `addToCart(product, quantity)`
  - `removeFromCart(productId)`
  - `updateQuantity(productId, quantity)`
  - `clearCart()`
  - Computed: `cartTotal`, `cartCount`, `cartItems`
- [ ] Cart screen
  - CartItem list (FlatList)
  - Quantity +/- controls per item
  - Remove item button (swipe or trash icon)
  - Price breakdown (subtotal + tax 10% + total)
  - "Proceed to Checkout" button (disabled if cart empty)
  - Empty cart state with "Browse Products" CTA
- [ ] Cart badge on tab bar (item count indicator)
- [ ] Checkout screen — 3 steps
  - Step 1: Shipping Info (full name, address, city, phone)
  - Step 2: Payment (Stripe card input)
  - Step 3: Review order + "Place Order" button
  - CheckoutStepper progress bar
  - Inline form validation
- [ ] Order success screen
  - Order ID display
  - "View My Orders" button
  - "Continue Shopping" button
  - Clear cart after successful order
- [ ] Show Toast notification on "Add to Cart"

**Screens:**
- `app/(tabs)/cart.tsx`
- `app/checkout.tsx`

**OpenCode Prompt for Phase 3:**
```
Build the Cart screen at app/(tabs)/cart.tsx.
Follow AGENTS.md rules strictly.
Requirements:
- Get cart items from Zustand cartStore
- FlatList of CartItem components (image, name, price, qty +/-, remove)
- Bottom section: subtotal, tax (10%), total
- "Proceed to Checkout" button (disabled when cart is empty)
- Empty state: EmptyState component + "Browse Products" button → router to products
- Cart count badge on the tab bar icon
- Swipe-to-delete OR delete icon button to remove item
- Dark theme, bg-background
```

---

### PHASE 4 — Order History & User Profile
**Goal**: Users can view orders and manage their profile.
**Timeline**: Week 2–3

**Features:**
- [ ] Orders list screen
  - All orders for current user (React Query)
  - OrderCard per item (ID, date, total, status badge)
  - Pull-to-refresh
  - Empty state with "Start Shopping" CTA
- [ ] Order detail screen
  - Order items list (product name, qty, unit price)
  - Shipping info display
  - Order status with color-coded badge
  - Total amount breakdown
  - Created date
- [ ] Profile screen
  - User avatar (circle with initials, brand color bg)
  - Username and email display
  - Menu list: My Orders, Edit Profile
  - App version number
  - Logout button → clear token + authStore + redirect to login

**Screens:**
- `app/orders.tsx`
- `app/order/[id].tsx`
- `app/(tabs)/profile.tsx`

**OpenCode Prompt for Phase 4:**
```
Build the Profile screen at app/(tabs)/profile.tsx.
Follow AGENTS.md rules strictly.
Requirements:
- Get user from Zustand authStore
- Avatar circle: user initials from username, bg-brand, white text
- Display username (large, bold) and email (muted)
- Menu list items: "My Orders" (navigate to /orders), "Edit Profile"
- Logout button at bottom: call removeToken() from lib/auth.ts,
  call authStore.logout(), router.replace('/(auth)/login')
- App version from expo-constants at very bottom (muted text)
- Dark theme, bg-background
```

---

### PHASE 5 — Polish & Production
**Goal**: App is production-ready, performant, and deployable.
**Timeline**: Week 3

**Features:**
- [ ] Global Toast notification system (success, error, warning, info)
- [ ] Network error screen — no internet connection detected
- [ ] Render cold start handling — friendly loading on app open
- [ ] Image optimization — expo-image with caching on all product images
- [ ] FlatList performance — keyExtractor, getItemLayout, removeClippedSubviews
- [ ] App icon design — brand colors (#0066ff), QuickStore logo
- [ ] Splash screen — dark background, centered logo
- [ ] Deep linking configuration
- [ ] EAS Build setup (eas.json)
- [ ] Production environment variables
- [ ] Android APK/AAB production build
- [ ] Play Store listing (optional)

**Production Commands:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project for EAS
eas build:configure

# Build for Android (production APK)
eas build --platform android --profile production

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile production

# Submit to Play Store
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

**eas.json:**
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "android": { "buildType": "aab" }
    }
  }
}
```

---

## Standard OpenCode Prompts

### Create a new screen:
```
Create [ScreenName] screen at [file path] for QuickStore Mobile.
Follow AGENTS.md rules strictly.
Features: [list features]
API: call [function] from lib/api.ts
State: [Zustand store or React Query hook]
Navigation: [where it navigates to/from]
Dark theme, proper loading + error + empty states required.
```

### Create a component:
```
Create [ComponentName] component at components/[name].tsx for QuickStore Mobile.
Follow AGENTS.md rules strictly.
Props interface: [describe props]
Behavior: [describe behavior]
Styling: NativeWind, dark theme, brand colors.
```

### Fix a bug:
```
Fix this error in QuickStore Mobile:
Error: [paste error]
File: [file path]
Follow AGENTS.md rules strictly. Do not use HTML tags.
```

### Convert from web to mobile:
```
Convert this Next.js component to React Native for QuickStore Mobile.
Follow AGENTS.md rules strictly.
Replace all HTML tags with RN components.
Replace CSS with NativeWind className.
Keep the same logic and dark theme.
[paste web component code]
```

---

## Notes & Gotchas

1. **Render cold start**: Backend may take 10–15 seconds on first request (free tier). Always show a loading state and set `timeout: 15000` in Axios.
2. **Login format**: The `/auth/login` endpoint uses OAuth2 FormData, NOT JSON. Use `multipart/form-data` content type.
3. **JWT expiry**: If the API returns 401, auto-logout the user (handled in Axios interceptor).
4. **Android shadows**: CSS `box-shadow` does not work on Android — use `elevation` prop instead.
5. **Safe areas**: Always wrap root screens in `<SafeAreaView>` or use `useSafeAreaInsets()`.
6. **FlatList vs ScrollView**: Use `FlatList` for long lists (better performance). Use `ScrollView` only for short, static content.
7. **Image URLs**: Product `image_url` values are full URLs from the backend — pass directly to `<Image source={{ uri: product.image_url }} />`.
8. **Cart persistence**: Use Zustand with `AsyncStorage` middleware so cart survives app restarts.
9. **Ratings**: Product ratings are hardcoded on backend (not in DB) — display as-is.
10. **Admin features**: Admin-only product CRUD endpoints exist but are NOT included in this mobile app (customer-facing only).

---

## QuickStore Project Context

### Backend API
- Base URL: https://quick-store-omf3.onrender.com
- Framework: FastAPI (Python)
- Auth: JWT Bearer token
- Login format: OAuth2 multipart/form-data (username + password fields)
- Cold start: Render free tier — first request may take 15s, handle gracefully

### API Endpoints
Auth:
- POST /auth/register → body: { email, username, password }
- POST /auth/login    → FormData: username, password → { access_token, token_type }
- GET  /auth/me       → Bearer token → User object

Products:
- GET /products/             → query: skip, limit, category, search, sort_by, sort_order, featured_only
- GET /products/categories   → string array
- GET /products/{id}         → single product

Orders:
- POST /orders/    → create order (auth required)
- GET  /orders/    → user orders list (auth required)
- GET  /orders/{id} → order detail (auth required)

### Design Rules
- Always dark theme (background: #09090b, card: #18181b)
- Brand color: #0066ff (buttons, links, active states)
- Text: #fafafa (primary), #71717a (muted)

### Code Rules
- NEVER use HTML tags: div, span, p, h1, button, input, img
- ALWAYS use RN components: View, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView
- ALWAYS NativeWind className for styling
- ALWAYS TypeScript — no any type
- API calls: ONLY through lib/api.ts
- Token operations: ONLY through lib/auth.ts
- Loading state: always show on API calls
- Error state: always show with retry button
- Empty state: always show EmptyState component

### TypeScript Interfaces
interface User { id: number; email: string; username: string; is_active: boolean; is_admin: boolean; }
interface Product { id: number; name: string; description: string; price: number; category: string; image_url: string; stock_quantity: number; is_featured: boolean; rating: number; }
interface CartItem { product: Product; quantity: number; }
interface Order { id: number; user_id: number; total_amount: number; status: string; created_at: string; items: OrderItem[]; }
interface OrderItem { product_id: number; product_name: string; quantity: number; unit_price: number; }

### Phase Plan
Phase 1: Auth (Login + Register + JWT + Auth Guard)
Phase 2: Home + Products listing + Search + Filter + Product Detail
Phase 3: Cart (Zustand) + Checkout (3 steps) + Stripe
Phase 4: Orders history + Order detail + Profile + Logout
Phase 5: Polish + Toast + Skeleton + EAS Production Build