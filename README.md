# 🖥️ Zurum Stores – Frontend

This is the **frontend application** for **Zurum Stores**, a production-ready e-commerce platform.

The frontend is responsible for the user interface, routing, authentication handling, admin dashboard UI, and integration with backend APIs.

---

## 🔗 Live URL

* **Frontend (Vercel):** [https://zurum-stores-frontend.vercel.app](https://zurum-stores-frontend.vercel.app)

---

## ✨ Features

* Responsive user interface
* Product listing and product details pages
* Shopping cart functionality
* Order history and order tracking UI
* Secure authentication state handling
* Google OAuth login
* Role-based UI rendering (User vs Admin)
* Admin dashboard UI (products, orders, users)
* Paystack payment integration
* Protected routes using React Router

---

## 🧱 Tech Stack

* **React (Vite)**
* **JavaScript (ES6+)**
* **React Router**
* **Axios / Fetch API**
* **Tailwind CSS / CSS**

---

## 🍪 Authentication & Cookies

* Uses **HTTP-only cookies** for authentication
* Requests sent with `withCredentials: true`
* Works securely across domains (Vercel ↔ Render)

---

## 📸 Static Assets

* Product images are stored in the `public/` folder
* Referenced using root-relative paths:

```jsx
<img src="/images/products/product-name.jpg" />
```

---

## 🚀 Deployment

* Hosted on **Vercel**
* Automatic redeploy on every GitHub push
* SPA routing handled via `vercel.json`

---

## 🧪 Testing

* UI and auth flows tested in browser
* Payment flow tested using Paystack test mode

---

## 👨‍💻 Author

**Glory Emmanuel**
* *FullStack Developer*
