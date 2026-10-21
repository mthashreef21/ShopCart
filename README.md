# 🛒 ShopCart

A modern, responsive e-commerce frontend built with React.js, designed to provide a smooth online shopping experience.

## 🚀 Live Demo

Coming Soon!

## 📸 Screenshots

Add screenshots of your homepage, product listings, shopping cart, and checkout here.

## ✨ Features

### 🛍️ Shopping Experience
- Responsive navigation bar
- Hero banner and product categories
- Flash deals section
- Product listings and product details
- Product search and filtering
- Shopping cart with quantity management
- Wishlist functionality
- INR price display

### 👤 User Account
- User registration and login
- Protected routes
- User dashboard
- Profile page
- Account Settings page

### 📦 Checkout & Orders
- Checkout form with delivery address
- Cash on Delivery selection
- Order history
- Order tracking with a simulated five-minute delivery timeline

### 📱 Responsive Design
- Modern user interface
- Tailwind CSS styling
- Responsive layouts for desktop and mobile

## 🛠️ Technologies Used

- React.js
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Router
- Lucide React
- Vite
- DummyJSON API
- Browser localStorage for demo cart, authentication, and order data

## 📡 Product API

ShopCart uses the DummyJSON API to fetch product information.

**API Endpoint:**

https://dummyjson.com/products?limit=0

API documentation: https://dummyjson.com/docs/products

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/mthashreef21/ShopCart.git
```

### 2. Navigate to the project directory

```bash
cd ShopCart
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to view ShopCart in your browser.

## 📂 Project Structure

```text
ShopCart/
├── public/
│   └── ShopCart.png
│
├── src/
│   ├── app/
│   │   └── store.js
│   │
│   ├── assets/
│   │   └── Banners/
│   │       ├── clothing.png
│   │       ├── headphone.png
│   │       ├── laptop.png
│   │       └── phone.png
│   │
│   ├── Features/
│   │   ├── auth/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── authService.js
│   │   │   └── ProtectedRoute.jsx
│   │   ├── cart/
│   │   │   └── cartSlice.js
│   │   ├── home/
│   │   │   ├── BenefitsSection.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── FlashDeals.jsx
│   │   │   └── HeroBanner.jsx
│   │   ├── orders/
│   │   │   └── orderService.js
│   │   └── wishlist/
│   │       └── wishlistSlice.js
│   │
│   ├── Layouts/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── Pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── AccountSettings.jsx
│   │   ├── Orders.jsx
│   │   └── OrderTracking.jsx
│   │
│   ├── utils/
│   │   └── price.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── README.md
```

*The structure above is representative; your actual folders may contain additional files.*

## ⚠️ Development Notes

- Authentication currently uses frontend demo logic.
- Cart and order information are stored in browser localStorage.
- Order tracking simulates delivery progress; it is not connected to a real shipping service.
- Online payment selection is for demonstration only. No real payment is processed.
- Account Settings options marked "Coming Soon" are not yet implemented.
- A production deployment should use a backend, database, secure authentication, and a payment gateway.

## 👨‍💻 Built By:

**Muhammed Thashreef
  Komal Jasapara
  Anuj
  Pranav
**

GitHub: [@mthashreef21](https://github.com/mthashreef21)

---

Built with ❤️ using React.js and Tailwind CSS.