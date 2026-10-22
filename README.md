# CampusCare — Smart Campus Complaint & Maintenance Management System

**Portfolio project by Debraj**

A full-stack campus maintenance portal built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

Students can report campus issues, track progress, search/filter complaints, and see a live dashboard. Maintenance staff can update complaint status and priority.

## Features
- Dashboard with total, pending, in-progress, and resolved complaint counts
- Submit complaints with category, location, priority, reporter name, and description
- Search complaints and filter by status/category
- Update complaint status and priority
- Delete a complaint
- Server-side validation and consistent error responses
- MongoDB persistence through Mongoose
- Responsive layout for desktop and mobile
- Seed script for sample complaints

## Tech stack
- Frontend: React, Vite, plain CSS
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Community Server or MongoDB Atlas

## Requirements
Install Node.js (LTS) and MongoDB. You can use MongoDB Atlas instead of installing MongoDB locally.

## Run locally

### 1. Start MongoDB
Make sure your local MongoDB service is running, or create a MongoDB Atlas connection string.

### 2. Start the backend
Open a terminal in `backend`:

```bash
npm install
```

Create `backend/.env` by copying `.env.example`, then set `MONGODB_URI`.

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 3. Start the frontend
Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Add sample data (optional)
With the backend running, open a terminal in `backend` and run:

```bash
npm run seed
```

This adds sample complaints to the configured database. If you run it more than once, it may add the same sample records again.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/complaints` | List complaints; supports `?status=Pending&category=Electrical&search=light` |
| GET | `/api/complaints/:id` | Get one complaint |
| POST | `/api/complaints` | Create a complaint |
| PATCH | `/api/complaints/:id` | Update status and/or priority |
| DELETE | `/api/complaints/:id` | Delete a complaint |
| GET | `/api/health` | API health check |

## Project structure

```text
CampusCare/
├── backend/
│   ├── config/db.js
│   ├── models/Complaint.js
│   ├── routes/complaints.js
│   ├── scripts/seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## GitHub upload
1. Extract this ZIP.
2. Open the `CampusCare` folder in VS Code.
3. Test the app locally using the steps above.
4. In the VS Code terminal, run:

```bash
git init
git add .
git commit -m "Build CampusCare full-stack maintenance portal"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Create an empty GitHub repository first, then replace `YOUR_GITHUB_REPOSITORY_URL` with its URL.

## Security note
Do not commit your real `.env` file, database credentials, or secrets. `.gitignore` excludes `.env` files by default.
