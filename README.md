# CreatorHub Studio

CreatorHub Studio is a full-stack creator platform project with an Express/MongoDB
API and a professional React + Tailwind dashboard frontend.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT auth, Cloudinary uploads
- Frontend: React, Vite, Tailwind CSS, lucide-react
- Deployment target: Vercel frontend + Render backend

## Local Development

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Run the backend:

```bash
npm run dev
```

Run the frontend:

```bash
npm run dev --prefix client
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to
`http://localhost:8000`.

## Environment

Use `.env.sample` as the backend reference. For deployment, set `CORS_ORIGIN`
to your frontend URL:

```bash
CORS_ORIGIN=https://your-frontend.vercel.app
```

For Vercel, set this frontend environment variable:

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Deployment

### Backend on Render

- Root directory: project root
- Build command: `npm install`
- Start command: `npm start`
- Required env vars: MongoDB URI, JWT secrets, Cloudinary keys, `CORS_ORIGIN`

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Required env var: `VITE_API_BASE_URL`

## API Health

The backend exposes:

```text
GET /api/v1/health
```

Use it to confirm the Render service is online.
