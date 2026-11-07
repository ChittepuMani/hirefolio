# Hirefolio — Employee Portfolio & Recruiter Resume Website

A full-stack MERN starter project for an employee's public professional profile. Recruiters can review a resume-style website, explore skills, work experience, projects, achievements, education and certifications, then send an enquiry. The employee has a private admin workspace to edit the portfolio and review enquiries.

> The included profile is intentionally placeholder content. Replace it with accurate employee information before sharing the site with recruiters. Do not publish invented job history, skills, awards or credentials.

## Features

- Public, responsive, resume-style portfolio.
- Profile summary, location, contact details and social links.
- Skills grouped by category.
- Work experience with dates and highlights.
- Projects with technology stack, highlights, live demo and repository links.
- Achievements, education and certifications.
- Print / Save as PDF using the browser print dialog.
- Public contact form. Enquiries are saved to MongoDB.
- Protected admin login and dashboard.
- Admin JSON editor for updating the portfolio content.
- Admin inbox for viewing, marking read and deleting recruiter enquiries.
- Password hashing, JWT-protected admin routes, Helmet headers and rate limits on login/contact endpoints.

## Technology

- Frontend: React, Vite, React Router, Lucide icons.
- Backend: Node.js, Express.
- Database: MongoDB with Mongoose.
- Authentication: bcryptjs + JSON Web Tokens.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended).
- npm.
- A running MongoDB server, either local MongoDB Community Server or MongoDB Atlas.
- VS Code (recommended).

## Run locally

### 1. Open this folder in VS Code

Open the extracted `hirefolio` folder. It contains separate `backend` and `frontend` applications.

### 2. Configure the backend

Open a terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS / Linux:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hirefolio
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

- For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.
- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` before first startup. Use a unique password of at least 12 characters.
- Use a long, random `JWT_SECRET` of at least 32 characters.
- Keep `.env` private; it is ignored by Git.

Start the backend:

```bash
npm run dev
```

The first start creates the `hirefolio` database collections/documents and the admin account if they do not already exist. The server runs at `http://localhost:5000`.

Health check: `http://localhost:5000/api/health`

### 3. Configure and start the frontend

Open a second terminal in VS Code:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### 4. Edit the employee profile

- Public website: `http://localhost:5173`
- Admin sign-in: `http://localhost:5173/admin`
- Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `backend/.env`.
- In **Portfolio content**, edit the JSON and click **Save portfolio**.
- In **Enquiries**, read messages sent from the public contact form.

The admin editor stores the portfolio data in MongoDB. Refresh the public website to see saved changes.

## Portfolio JSON shape

The admin editor shows the complete current document. Keep the overall JSON structure and edit values/arrays. Example content for the arrays:

```json
{
  "skills": [
    { "category": "Programming", "items": ["JavaScript", "Java", "Python"] },
    { "category": "Frontend", "items": ["React", "HTML", "CSS"] }
  ],
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "location": "City",
      "startDate": "Jan 2024",
      "endDate": "Present",
      "current": true,
      "summary": "A short, factual role summary.",
      "highlights": ["Describe a measurable contribution.", "Describe another responsibility or result."]
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "What problem does it solve?",
      "role": "Your contribution",
      "techStack": ["React", "Node.js", "MongoDB"],
      "highlights": ["Important feature or result"],
      "liveUrl": "https://example.com",
      "repoUrl": "https://github.com/yourname/project",
      "featured": true
    }
  ],
  "achievements": [
    {
      "title": "Award or achievement",
      "issuer": "Organization",
      "date": "2025",
      "description": "A brief factual description."
    }
  ],
  "education": [
    {
      "degree": "Degree or qualification",
      "institution": "Institution name",
      "year": "2024",
      "details": "Optional details"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "2025",
      "url": "https://example.com/credential"
    }
  ]
}
```

The `profile` object contains: `fullName`, `headline`, `location`, `email`, `phone`, `summary`, `availability`, `linkedin`, `github`, `website`, `resumeUrl`, and `photoUrl`.

Only include links and claims that are accurate and that you are comfortable making public. The `photoUrl` should be a publicly accessible image URL. The `resumeUrl` is available for storing a link; the current public page includes a print-to-PDF control.

## API endpoints

### Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/portfolio` | Read public portfolio data |
| POST | `/api/contact` | Submit a recruiter enquiry |
| GET | `/api/health` | Check API/database health |

### Admin

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Admin login; returns JWT |
| GET | `/api/admin/portfolio` | Read portfolio (Bearer token required) |
| PUT | `/api/admin/portfolio` | Update portfolio (Bearer token required) |
| GET | `/api/admin/messages` | List enquiries (Bearer token required) |
| PATCH | `/api/admin/messages/:id/read` | Mark enquiry as read |
| DELETE | `/api/admin/messages/:id` | Delete enquiry |

## How files communicate

1. `frontend/src/main.jsx` starts React and renders `App.jsx`.
2. `App.jsx` displays the public portfolio or admin pages.
3. `frontend/src/api.js` sends HTTP requests to the backend and attaches the admin JWT when present.
4. `backend/server.js` connects to MongoDB and mounts the route files.
5. Public requests are handled by `routes/publicRoutes.js`.
6. Login requests are handled by `routes/authRoutes.js`.
7. Private admin requests pass through `middleware/requireAdmin.js` and are handled by `routes/adminRoutes.js`.
8. Mongoose models in `models/` read/write MongoDB documents.

## Stop the servers

In each VS Code terminal, press `Ctrl + C`. Stop the frontend and backend separately. MongoDB runs as a separate service.

## Before deploying publicly

- Replace every placeholder with verified, accurate employee information.
- Change admin email/password and JWT secret; never use sample credentials in production.
- Use HTTPS and secure production environment variables.
- Restrict CORS to the actual deployed frontend domain.
- Use a secure production token/session strategy (prefer secure, HTTP-only cookies), add monitoring/backups, and review privacy and data-retention requirements for contact messages.
- Add a real file upload/storage flow before accepting profile photos or resume files; this starter accepts URLs only.
