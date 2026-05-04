# 📄 DocMage

**DocMage** is a premium, high-performance PDF management and extraction platform built with the MERN stack. It allows users to upload, reorder, and extract specific pages from PDF documents with a sleek, modern interface.

![Version](https://img.shields.io/badge/version-1.0.0-indigo)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)

---

## ✨ Features

- 🚀 **Smart PDF Upload**: Fast, drag-and-drop PDF processing.
- 🔄 **Visual Reordering**: Intuitive drag-and-drop page sorting using `@dnd-kit`.
- ✂️ **Precise Extraction**: Select and extract specific pages into a new PDF.
- 🔐 **Secure Authentication**: Robust Auth system with OTP verification and Google OAuth.
- 📂 **Personal Dashboard**: Manage, search, and track your extracted documents.
- 📱 **Fully Responsive**: Optimized for desktop and mobile (2x2 grid view).
- 💎 **Premium UI**: Modern design with glassmorphism, smooth animations, and a minimalist aesthetic.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite**
- **Redux Toolkit** (Global State Management)
- **Framer Motion** (Premium Animations)
- **Tailwind CSS** (Modern Styling)
- **Lucide React** (Beautiful Iconography)
- **React-PDF** (In-browser Rendering)

### Backend
- **Node.js** & **Express**
- **MongoDB** (Database)
- **AWS S3** (Scalable Storage)
- **Nodemailer** (OTP Email Delivery)
- **JWT** (Secure Session Management)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- AWS S3 Bucket
- Google Cloud Console Project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shamnxd/Docmage.git
   cd Docmage
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your credentials (see `.env.example`).

3. **Client Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Running the App

1. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm run dev
   ```

---

## 📐 Project Structure

```
Docmage/
├── client/              # Frontend React Application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── store/       # Redux Toolkit slices
│   │   ├── pages/       # Page views
│   │   └── services/    # API integration
├── server/              # Backend Express API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database schemas
│   │   └── routes/      # API endpoints
└── .gitignore           # Root git ignore
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Developed with ❤️ by [Shamnxd](https://github.com/shamnxd)
