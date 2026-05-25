# ☕ Brown Sugar Coffee House

Welcome to **Brown Sugar Coffee House**, a beautiful, premium, and fully featured web application for a modern coffee shop.

This project is organized into two separate folders:
1. **`frontend`**: Built with Next.js (React, CSS modules, fully responsive design, custom light-brown warm cream theme).
2. **`backend`**: Built with Node.js, Express, TypeScript, and a simple local JSON file database.

---

## 📁 Project Structure

```text
brown-sugar-coffee-app/
├── backend/                  # Express.js API Server
│   ├── data/                 # Database storage (db.json)
│   ├── src/                  # Server source files (server.ts, db client)
│   ├── package.json          # Node server dependencies
│   ├── tsconfig.json         # TypeScript compiler config
│   └── .env.example          # Environment configuration template
│
└── frontend/                 # Next.js Client App
    ├── public/               # Static images & icons
    ├── src/                  # Client components, styles, state contexts
    ├── package.json          # Client dependencies
    ├── next.config.ts        # Next.js bundler and API proxy settings
    └── .env.example          # Client environment template
```

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have **Node.js (v18+)** installed.

---

### Step 1: Run the Backend Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   # or for Mac/Linux: cp .env.example .env
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```
   The backend will start on **`http://localhost:5000`**.

---

### Step 2: Run the Frontend Client
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   # or for Mac/Linux: cp .env.example .env.local
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in your browser to view the website.

---

## 🔑 Demo Access Credentials

To test the role-based functionality of the website, use these accounts:

*   **Store Manager (Admin Portal):**
    *   **Email:** `admin@brownsugar.com`
    *   **Password:** `admin123`
    *   *Features:* View and update orders, confirm table reservations, moderate/delete customer reviews, add/edit coffee menu items, and view registered user signups.
*   **Customer Portal:**
    *   **Email:** `customer@test.com`
    *   **Password:** `customer123`
    *   *Alternative:* Simply sign up with a new email on the **Sign Up** page. All new signups automatically sync to the admin dashboard database live!

---

## ✨ Features Implemented

*   **Premium Theme:** Exquisite warm-cream, caramel, and chocolate theme with micro-animations and typography.
*   **Menu Filtering:** Add coffees, cold brews, specialty drinks, and pastries directly to the cart, with prices in INR (₹).
*   **Online Checkout:** Complete order forms with delivery/takeaway choices.
*   **Table Reservations:** Book time slots, choose guest numbers, and add specific seating preferences.
*   **Authentication & Signup:** Toggle password visibility, secure authorization contexts, and create persistent credentials.
*   **Admin Dashboard:** Comprehensive business management center to fulfill orders, moderate reviews, handle bookings, edit menu listings, and monitor customer users.
