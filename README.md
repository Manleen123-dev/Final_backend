<div align="center">
  <h1>🎬 VideoTube Studio</h1>
  <p><strong>A Premium Full-Stack Creator Platform</strong></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

VideoTube Studio is an industry-grade, full-stack video hosting and creator dashboard platform. It features a scalable Express/MongoDB backend API and a highly polished, responsive React frontend powered by Vite and Tailwind CSS. The platform embraces modern, Apple-inspired aesthetics with sophisticated dark mode support.

## ✨ Key Features

- **Robust Authentication:** Secure JWT-based access and refresh token rotation with `HttpOnly` cookies.
- **Creator Dashboard:** An intuitive dashboard for uploading, publishing, and managing video content.
- **Cloud Media Pipeline:** Seamless integration with **Cloudinary** for scalable image (thumbnails/avatars) and video hosting, including automatic duration extraction.
- **Dynamic Frontend:** Fast, responsive UI with optimistic updates, skeleton loaders, and Framer Motion animations.
- **Security First:** Includes a custom **Deployment Guard** middleware to password-protect the environment during staging.
- **RESTful API Architecture:** Standardized API responses and robust centralized error handling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, `lucide-react` icons
- **State & Data Fetching:** `@tanstack/react-query`, Context API
- **Routing:** `react-router-dom`

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ORM
- **Media Storage:** Cloudinary
- **Middleware:** `multer` (file handling), `cors`, `cookie-parser`, `bcrypt`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB URI](https://www.mongodb.com/atlas)
- [Cloudinary Account](https://cloudinary.com/)

### 1. Clone & Install
Install the dependencies for both the backend and frontend.

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 2. Environment Configuration
Create `.env` in the **root** directory (Backend). You can copy the provided `.env.sample`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.ajnvnhf.mongodb.net/?appName=Cluster0
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_super_secret_access_token
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DEPLOYMENT_PASSWORD=your_staging_password # Optional
```

Create `.env.local` in the **client** directory (Frontend):

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run the Development Servers

You will need two terminal windows to run both servers concurrently.

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 🏗️ Architecture Overview

### API Routes

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/health` | `GET` | System health check | No |
| `/api/v1/users/register` | `POST` | Register a new user | No |
| `/api/v1/users/login` | `POST` | Authenticate user & receive tokens | No |
| `/api/v1/users/logout` | `POST` | Clear HTTP cookies | Yes |
| `/api/v1/users/current-user` | `GET` | Retrieve authenticated user profile | Yes |
| `/api/v1/videos/` | `POST` | Upload a video & thumbnail | Yes |
| `/api/v1/videos/` | `GET` | Fetch videos belonging to the user | Yes |

*Note: All API routes conform to a standardized JSON schema via `ApiResponse` and `ApiError` utilities.*

---

## 🔒 Deployment Guard

This project includes a **Deployment Guard** feature to prevent unauthorized access to staging or production deployments. 
- Set `DEPLOYMENT_PASSWORD=yourpassword` in your backend `.env`.
- The frontend will automatically detect the lock and prompt users for the deployment password before they can view the site or log in.

---

## 🌍 Deployment

### Deploying the Backend (e.g., Render)
1. Set the Root Directory to the project root.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Make sure to add all your `.env` variables, and set `CORS_ORIGIN` to your deployed frontend URL (e.g., `https://your-frontend.vercel.app`).

### Deploying the Frontend (e.g., Vercel)
1. Set the Framework Preset to `Vite`.
2. Set the Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add `VITE_API_BASE_URL` pointing to your deployed backend URL.

---

## 📄 License
This project is licensed under the ISC License. 
