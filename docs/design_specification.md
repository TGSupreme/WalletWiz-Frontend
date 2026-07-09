# 📐 WalletWiz Frontend Design Specification

This document serves as the official design blueprint for the **WalletWiz** frontend application. It aligns all planning decisions, visual design structures, access controls, page layouts, and API integration paths.

---

## 🎯 Project Overview
**WalletWiz** is a mobile-first, AI-native personal finance application. It integrates with a Python/FastAPI backend to enable natural language expense logging and data query powered by Google Gemini, alongside traditional manual tracking and visual analytics.

---

## 📁 Folder Structure
We organize the project using a highly modular directory layout:

```text
src/
├── assets/             # Static files (logos, local SVGs, images)
├── components/         # Reusable UI components
│   ├── ui/             # Core UI atoms (Button, Input, Card, Modal, Toast)
│   ├── layout/         # Shell components (Header, FABNavigation, ProtectedRoute)
│   └── chat/           # Chat-specific elements (ChatMessage, ChatInput, InlineCard)
├── context/            # React Context providers for global state
│   ├── ThemeContext.jsx      # Theme state (Dark/Light toggle, System theme)
│   ├── AuthContext.jsx       # User authentication, token, Google sign-in
│   ├── TransactionContext.jsx# Transaction lists, filtering, pagination state
│   └── ChatContext.jsx       # Conversational feed history memory
├── pages/              # Page view components
│   ├── Auth.jsx        # Login & Register views (Auth Wall)
│   ├── Chat.jsx        # Main AI Chat console (Landing Page)
│   ├── Analytics.jsx   # Metrics, category distributions, daily trend charts
│   └── Transactions.jsx# Detailed transaction list, filters, manual entry modal
├── services/           # External API integration
│   └── api.js          # Unified API requests with token headers & interceptors
├── App.jsx             # React router setup and root layouts
├── App.css             # Component-level layout overrides
├── index.css           # Tailwind v4 configuration, font imports, mobile-shell base variables
└── main.jsx            # Application entrypoint
```

---

## 🔒 Authentication & Access Control
* **Guest Flow:** The application enforces a strict auth wall. If no valid JWT token is stored in the client browser, all routes automatically redirect to the **Login/Register** page. Guests have zero access to the app shell, pages, or backend queries.
* **Token Lifetime:** The JWT token is persisted in local storage and is valid for **7 days** (10,080 minutes).
* **API Wrapper Interceptors:** 
  * If a request returns `401 Unauthorized`, the client session is cleared and the user is redirected to the login screen.
  * If a request returns `429 Too Many Requests` (from the conversational chat rate limit of 20 RPM), a notification toast warns the user to slow down.

---

## 📱 Visual Shell & Theme Configuration
* **Responsive Architecture:** Mobile-centric layout.
  * **On Mobile viewports:** Takes up 100% of the viewport (PWA-style).
  * **On Desktop viewports:** Centered inside a modern mobile phone container mockup with glassmorphic shadows.
* **Dual Theme:**
  * **Default state:** Automatically reads and matches the user's system preferences (`prefers-color-scheme`).
  * **Manual Override:** A switch button in the navigation enables users to manually toggle between high-fidelity **Dark Mode** and clean **Light Mode**.
* **Framework:** Tailwind CSS v4.
* **Theme Colors Palette:**
  
  | Element | 🌑 Dark Mode | ☀️ Light Mode | Usage |
  | :--- | :--- | :--- | :--- |
  | **App Background** | `#0B0F19` (Deep Slate Navy) | `#F8FAFC` (Slate-50) | Overall viewport background |
  | **Card Background** | `#161F30` (Glassy Slate) | `#FFFFFF` (Pure White) | Container boxes, lists, chat bubbles |
  | **Borders** | `#223047` (Navy Slate) | `#E2E8F0` (Slate-200) | Card boundaries, dividers, inputs |
  | **Primary / Accent** | `#8B5CF6` (Neon Purple) | `#6D28D9` (Vibrant Indigo) | Active states, FAB navigation buttons |
  | **Success (Income)** | `#10B981` (Mint Emerald) | `#059669` (Deep Emerald) | Tool successes, positive numbers |
  | **Danger (Expense)** | `#F43F5E` (Rose Pink) | `#DC2626` (Crimson Red) | Deletion indicators, negative numbers |
  | **Text (Primary)** | `#F8FAFC` (Slate-50) | `#0F172A` (Slate-900) | Titles, headings, active text |
  | **Text (Secondary)**| `#94A3B8` (Slate-400) | `#475569` (Slate-600) | Descriptions, timestamps, helpers |

---

## 🧭 Page Map & View Specifications

### 1. Authentication View (`/login` & `/register`)
* **Design:** Clean, minimalist card interface.
* **Features:**
  * Toggle between Login and Registration forms.
  * Form fields: Email, Password, First Name (registration only).
  * Google OAuth Sign-In button:
    * Loads the Google Identity Services SDK `<script src="https://accounts.google.com/gsi/client" async defer></script>` in `index.html`.
    * Renders Google's official Sign-In button component.
    * Exchanges the Google `id_token` for the backend's JWT access token via POST `/api/v1/auth/google`.

### 2. Conversational AI Chat View (Main / Root Landing Page `/`)
* **Design:** Immersive messaging window.
* **Features:**
  * Displays chat message feed with automatic scroll-to-bottom.
  * Inputs: Chat field, submit button.
  * **Interactive Inline Cards:** When the AI registers or lists data, it embeds structured components:
    * *Transaction Log Card:* Renders merchant name, amount, category, payment method, and date with inline "Edit" and "Delete" actions.
    * *Inline Charts:* Mini visualizations rendered directly in the chat bubble when the user asks for budget reports.

### 3. Analytics Dashboard View (`/analytics`)
* **Design:** Dynamic card-based dashboard layout.
* **Features:**
  * Timeframe selector: `"this-month"`, `"last-30-days"`, `"this-year"`.
  * KPI summary cards (Total Spent, Daily Average).
  * Category breakdown distribution chart (Donut/Pie).
  * Payment method distribution chart (Horizontal progress bars or Pie).
  * Daily spending trend graph (Area/Line chart).

### 4. Transactions View (`/transactions`)
* **Design:** Clean table/list component.
* **Features:**
  * Advanced filter bar: Date ranges, Category selectors, Payment method selectors.
  * Server-side pagination controls (Page numbers, Next/Prev).
  * List actions: Edit and Delete buttons for each transaction item.

---

## 🛠️ FAB (Floating Action Button) Navigation Menu
To keep the screen clean, navigation is controlled by an active FAB floating at the bottom center of the application:
* **Default state:** A circular floating button hovering above the viewport.
* **Expanded state:** Clicking the FAB expands a smooth overlay displaying the following action items:
  1. 💬 **AI Chat** (Navigates to Chat View)
  2. 📊 **Analytics** (Navigates to Dashboard View)
  3. 💸 **Transactions** (Navigates to Transactions List View)
  4. ➕ **Add Expense** (Triggers the manual entry modal globally)
  5. 🌗 **Theme Switcher** (Switches Dark/Light theme override)
  6. 🚪 **Log Out** (Clears session data and redirects to login)

---

## 🗄️ Validation Rules & Predefined Enums

When validating manual transaction creation/updates, the frontend strictly enforces the following validation checks before calling the backend:

1. **Amount:** Must be a valid positive decimal number ($> 0$).
2. **Merchant:** Required string field.
3. **Category Enum Validation:**
   * `"Food & Dining"`
   * `"Shopping"`
   * `"Travel & Transport"`
   * `"Bills & Utilities"`
   * `"Entertainment"`
   * `"Health & Medical"`
   * `"Others"`
4. **Payment Method Enum Validation:**
   * `"Cash"`
   * `"Card"`
   * `"UPI"`
