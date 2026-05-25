# Bharat AI Olympiad (BAIO) Platform

## 📖 Overview
The **BAIO Platform** is a full‑stack, production‑grade solution for managing the **Bharat AI Olympiad**. It provides:
- A **public‑facing website** for students, schools, and participants.
- An **admin portal** for Olympiad organisers to manage announcements, olympiads, registrations, and results.
- A **RESTful backend API** handling authentication, CRUD operations, file uploads, email notifications, and analytics.

The platform follows modern best‑practice architecture, is containerised with Docker, and is ready for CI/CD pipelines.

---

## 🏗️ High‑Level Design (HLD)
```mermaid
flowchart TB
    subgraph Frontend [Public Frontend (Vite + React)]
        direction TB
        FE[React SPA] -->|API Calls| BE
    end
    subgraph AdminPortal [Admin Portal (Vite + React)]
        direction TB
        Admin[React SPA] -->|API Calls| BE
    end
    subgraph Backend [Backend (Node.js + Express)]
        direction TB
        BE[Express Server] -->|DB Queries| DB[(MongoDB)]
        BE -->|Email| SMTP[(SMTP Service)]
        BE -->|File Storage| Cloud[(Cloudinary)]
    end
    subgraph DevOps [DevOps]
        direction LR
        Docker[Docker Compose] --> FE
        Docker --> Admin
        Docker --> BE
    end
    style Frontend fill:#E0F7FA,stroke:#006064,stroke-width:2px
    style AdminPortal fill:#FFF3E0,stroke:#E65100,stroke-width:2px
    style Backend fill:#F1F8E9,stroke:#33691E,stroke-width:2px
    style DevOps fill:#ECEFF1,stroke:#37474F,stroke-width:2px
``` 

The diagram depicts the three main logical components (frontend, admin, backend) and their interactions with external services (MongoDB, SMTP, Cloudinary) and the Docker‑Compose orchestration layer.

---

## 🛠️ Low‑Level Design (LLD)
### 1️⃣ Frontend (`/frontend`)
| Folder | Responsibility |
|-------|-----------------|
| `src/pages` | Page‑level components (Home, Olympiads, Register, Dashboard, etc.) |
| `src/components` | Re‑usable UI blocks (Navbar, Footer, Hero, Cards, Forms) |
| `src/layouts` | Layout wrappers implementing the 5‑column glass‑morphism sidebar and responsive design |
| `src/services/api.js` | Centralised Axios instance with JWT interceptor and error handling |
| `src/store/authStore.js` | Zustand store for auth state, token refresh, and user profile |
| `vite.config.js` | Vite configuration with Tailwind, aliasing, and environment loading |

### 2️⃣ Admin Portal (`/admin`)
| Folder | Responsibility |
|-------|-----------------|
| `src/pages` | Admin‑only pages (Dashboard, ManageAnnouncements, ManageOlympiads, ManageStudents) |
| `src/components` | CRUD modals, data tables, filters, and admin UI widgets |
| `src/services/api.js` | Separate Axios instance with admin JWT token |
| `src/store/adminAuthStore.js` | Zustand store for admin authentication |
| `src/layouts/AdminLayout.jsx` | Layout with right‑hand vertical navigation (5‑column) |

### 3️⃣ Backend (`/backend`)
| Layer | Files / Modules |
|-------|-----------------|
| **Entry** | `server.js` – Express app bootstrap, global middlewares, error handling |
| **Routes** | `src/routes/*.js` – REST endpoints for auth, announcements, olympiads, students, results |
| **Controllers** | `src/controllers/*.js` – Business logic, validation, service orchestration |
| **Services** | `src/services/*.js` – Email (SMTP), Cloudinary upload, JWT token handling |
| **Models** | `src/models/*.js` – Mongoose schemas (User, Admin, Olympiad, Result, etc.) |
| **Middleware** | Auth, error, rate‑limiting, swagger docs |
| **Utils** | Logger (winston), async wrapper, response helpers |

### 4️⃣ Infrastructure (`docker-compose.yml`)
- **mongo** – Official MongoDB container with persistence volume.
- **backend** – Node.js app built from `backend/Dockerfile`, depends on `mongo`.
- **frontend** – Vite dev server built from `frontend/Dockerfile` (for production you can serve static files via Nginx).
- **admin** – Same as frontend but runs on a different port.

---

## 🔄 System Workflow
1. **User visits the public site** (`frontend`).
2. Browser loads the React SPA; initial data (Olympiads, Announcements) fetched via `GET /api/v1/olympiads` and `GET /api/v1/announcements`.
3. **Registration flow** – Student fills the registration form → POST `/api/v1/students` → Backend validates, creates a MongoDB document, sends a confirmation email via SMTP.
4. **Admin login** – Admin portal authenticates via `POST /api/v1/admin/login` → JWT returned → stored in Zustand store.
5. **Admin CRUD** – Admin UI calls protected endpoints (`/api/v1/admin/announcements`, `/api/v1/admin/olympiads`, etc.) → Backend verifies JWT → performs DB operation → returns updated list.
6. **File uploads** (e.g., Olympiad banner) → Admin UI sends multipart/form‑data → Backend uses `upload.service.js` to push to Cloudinary → URL stored in MongoDB.
7. **Result search** – Public page queries `/api/v1/results?roll=...` → Backend aggregates and returns JSON.
8. **Rate limiting** – All routes pass through `rate-limit` middleware (15 min window, 100 requests). 

---

## ⚙️ Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React, Vite, TailwindCSS, Zustand, Axios | 18.x, Vite 5, Tailwind 4, Zustand 4 |
| **Admin Portal** | React, Vite, TailwindCSS, Zustand, Axios | Same as Frontend |
| **Backend** | Node.js, Express, Mongoose, Winston, JWT, Nodemailer | Node 20, Express 4, Mongoose 8 |
| **Database** | MongoDB (Docker) | 7.0 |
| **File Storage** | Cloudinary (cloud service) |
| **Email** | Gmail SMTP (or any SMTP provider) |
| **Containerisation** | Docker, Docker‑Compose |
| **CI/CD (optional)** | GitHub Actions, Docker Hub |
| **Testing** | Jest (unit), React Testing Library, Supertest (API) |

---

## 📦 Deployment & DevOps
1. **Local Development**
   ```bash
   # clone repo
   git clone https://github.com/mohit4901/BAIO.git
   cd BAIO
   # start all services (Docker Compose)
   docker compose up -d
   # frontend & admin hot‑reload
   cd frontend && npm install && npm run dev
   cd ../admin && npm install && npm run dev
   # backend
   cd ../backend && npm install && npm run dev
   ```
2. **Production Build**
   ```bash
   # Build frontend & admin static assets
   cd frontend && npm run build   # outputs /dist
   cd ../admin && npm run build
   # Build Docker image for backend (already in compose)
   docker compose -f docker-compose.yml up -d --build
   ```
3. **CI (GitHub Actions) – example**
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Set up Node
           uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm ci
         - run: npm test
   ```
4. **Environment Variables** – listed in `.env.example`. Never commit real secrets; they are ignored by `.gitignore`.

---

## 🚀 Getting Started (Developer Quick‑Start)
1. **Prerequisites** – Docker Desktop, Node ≥ 20, npm ≥ 10.
2. **Clone & configure**
   ```bash
   git clone https://github.com/mohit4901/BAIO.git
   cd BAIO
   cp backend/.env.example backend/.env   # fill your credentials
   cp admin/.env.example admin/.env
   cp frontend/.env.example frontend/.env
   ```
3. **Run** `docker compose up -d` – brings up MongoDB and backend.
4. **Start UI** – `npm install && npm run dev` inside `frontend` and `admin`.
5. Open:
   - Public site → `http://localhost:5173`
   - Admin portal → `http://localhost:5174`
6. **Testing** – `npm test` in each workspace.

---

## 👥 Contributing
- Fork the repository.
- Create a feature branch (`git checkout -b feat/awesome-feature`).
- Follow the existing code style (Prettier, ESLint). Commit messages follow Conventional Commits.
- Open a Pull Request targeting `main`.
- Ensure tests pass and CI pipeline is green.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for details.

---

## 📞 Support & Contact
- **Maintainer:** Mohit Mudgil – <mailto:mohitmudgil@example.com>
- Open an issue on GitHub for bug reports or feature requests.

---

*This README is generated to serve as a professional, production‑ready documentation for developers, ops engineers, and stakeholders.*
