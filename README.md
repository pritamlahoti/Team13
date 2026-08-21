# Katalyst — Gamification Platform

Front end URL: https://katalyst-frontend1.onrender.com/ Gamification layer for
the Katalyst learning programme. It turns programme activity — sessions,
courses, mentoring, assignments, projects, and milestones — into a tracked,
XP-driven, and socially visible experience, with an AI Coach as the primary
student-facing interface.

Built for a four-year programme where engagement is currently manual and
staff-intensive (chased via email/WhatsApp) with no unified way to recognize
achievement or track momentum. See
[`Katalyst_Gamification_PRD (1).md`](<./Katalyst_Gamification_PRD%20(1).md>) for
the full product requirements.

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Running tests](#running-tests)
- [API overview](#api-overview)
- [Roles & permissions](#roles--permissions)
- [Core data model](#core-data-model)
- [Open product decisions](#open-product-decisions)

## Architecture

A standard client/server split: a React SPA talks to an Express REST API backed
by PostgreSQL via Prisma.

```
frontend (Vite + React 19)  --HTTP-->  backend (Express 5 + Prisma)  -->  PostgreSQL
                                              |
                                              +--> Gemini (AI Coach review/feedback)
                                              +--> Resend (transactional email)
                                              +--> Vercel Blob (submission uploads)
                                              +--> node-cron (nudge/escalation jobs)
```

## Tech stack

**Backend** — Node.js, Express 5, Prisma ORM (PostgreSQL), JWT auth
(`jsonwebtoken` + `bcryptjs`), Zod validation, `express-rate-limit`, `node-cron`
for scheduled jobs, Resend for email, Vercel Blob for file storage.

**Frontend** — React 19, Vite, React Router 7, Tailwind CSS 4, Framer Motion,
React Three Fiber / Drei (3D), `canvas-confetti`, `lucide-react`.

## Project structure

```
.
├── backend/
│   ├── server.js                # entrypoint
│   ├── src/
│   │   ├── app.js               # express app + route mounting
│   │   ├── config/               # env/config loading
│   │   ├── constants/            # roles, XP rules, etc.
│   │   ├── db/                   # prisma client, seed script
│   │   ├── middleware/           # auth, error handling, validation
│   │   ├── jobs/                 # cron jobs (nudges, escalations)
│   │   └── features/             # one folder per domain module (see below)
│   ├── prisma/schema.prisma      # data model + migrations
│   ├── tests/                    # endpoint test suites
│   ├── DECISIONS.md              # log of defaults picked where the PRD is silent
│   └── PRD.md                    # backend-specific requirement notes
└── frontend/
    ├── src/
    │   ├── pages/                # route-level views (incl. pages/admin)
    │   ├── components/           # dashboard, coach, leaderboard, challenges, etc.
    │   ├── routes/                # router config
    │   ├── contexts/              # auth/app state
    │   ├── services/              # API client layer
    │   └── hooks/, lib/, utils/, config/, data/
    └── vite.config.js
```

Each backend `features/<name>` folder follows the same shape: `*.routes.js`,
`*.controller.js` (or inline handlers), `*.service.js`, `*.repo.js`,
`*.schema.js`. Current feature modules: `auth`, `modules`, `enrollments`,
`submissions`, `reviews`, `aiCoach`, `xp`, `reports`, `admin`, `teams`,
`dashboard`, `leaderboard`, `achievements`, `notifications`.

## Getting started

Prerequisites: Node.js 18+, a PostgreSQL database (a Prisma Accelerate
connection string works too), and API keys for Gemini, Resend, and Vercel Blob
if you want those integrations live.

```bash
# 1. Backend
cd backend
cp .env.example .env        # then fill in the values (see below)
npm install                 # also runs `prisma generate` via postinstall
npm run prisma:migrate      # apply migrations to your database
node seedAdmin.js           # create the first admin/management account
npm start                   # http://localhost:4000

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The backend enables CORS only for `FRONTEND_URL`, so keep it pointed at wherever
the frontend is actually running.

## Environment variables

Set these in `backend/.env` (see `backend/.env.example`):

| Variable                | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`          | Pooled Postgres/Prisma Accelerate connection string used at runtime |
| `DIRECT_URL`            | Direct Postgres connection, used for migrations                     |
| `JWT_SECRET`            | Secret used to sign auth tokens                                     |
| `JWT_EXPIRY`            | Token lifetime (e.g. `24h`)                                         |
| `GEMINI_API_KEY`        | Google Gemini key for AI Coach review/feedback/scoring              |
| `PORT`                  | Backend HTTP port (default `4000`)                                  |
| `RESEND_API_KEY`        | Resend key for transactional email (nudges/escalations)             |
| `EMAIL_FROM`            | From-address used when sending email                                |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for submission file/video uploads                 |
| `FRONTEND_URL`          | Origin allowed by CORS                                              |

Never commit a populated `.env` — it's already git-ignored.

## Database

Schema lives in `backend/prisma/schema.prisma`. Core models: `User`, `Team`,
`TeamMember`, `Module`, `Enrollment`, `Submission`, `Review`, `XpLedger`,
`Notification`, `MentorAssignment`.

```bash
cd backend
npm run prisma:migrate     # create/apply a migration in dev
npm run db:seed            # seed sample data
npm run verify:prisma      # sanity-check the Prisma client/schema
```

## Running tests

```bash
cd backend
npm test                   # runs tests/runAll.js against auth, modules, enrollments,
                            # submissions, reviews/xp, reports and the AI Coach
```

## API overview

All routes are mounted directly on the Express app (`backend/src/app.js`); most
require a `Bearer` JWT via `requireAuth`, and role-gated ones use `requireRole`.

| Area         | Base path                                               | Notes                                                                                                                            |
| ------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Health       | `GET /health`                                           | Liveness check                                                                                                                   |
| Auth         | `/auth/*`                                               | `POST /auth/login`, `GET /auth/me`; signup is admin-only                                                                         |
| Modules      | `/modules*`                                             | Browse/enroll-eligible activities                                                                                                |
| Enrollments  | `/enrollments*`                                         | Student enroll + mark complete                                                                                                   |
| Submissions  | `/submissions*`                                         | Submit work, request upload tokens                                                                                               |
| Reviews      | `/reviews*`                                             | Management/AI Coach review workflow                                                                                              |
| AI Coach     | `/ai-coach/*`                                           | Review, feedback, scoring, challenges                                                                                            |
| XP           | `/xp*`                                                  | Yearly XP totals                                                                                                                 |
| Reports      | `/reports*`                                             | Filtered reporting (student, type, date range, team, score)                                                                      |
| Teams        | `/teams*`                                               | Team membership                                                                                                                  |
| Leaderboard  | `/leaderboard`                                          | Individual/team rankings                                                                                                         |
| Achievements | `/achievements*`                                        | Gamified milestone recognition                                                                                                   |
| Dashboard    | `/dashboard/management`, `/dashboard/higher-management` | Role-specific dashboards                                                                                                         |
| Admin        | `/api/admin/*`                                          | Activity CRUD, students, mentors, analytics, at-risk engagement, reports — restricted to Katalyst Management / Higher Management |

## Roles & permissions

| Role                        | Can do                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Student**                 | Enroll, complete, submit work, view own yearly XP and progress                                             |
| **Katalyst Management**     | Create/configure activities, review and score submissions, generate filtered reports, manage teams         |
| **Higher Management**       | View dashboards and receive escalations only — no scoring or creation authority                            |
| **AI Coach** (system actor) | Reviews submissions, gives feedback, scores well-defined work, sends nudges/reminders, presents challenges |

## Core data model

- **User** — id, name, role, cohort/year
- **Module** — activity (session/course/mentoring/assignment/project/milestone),
  classification (mandatory/optional/certificate), due date
- **Enrollment** — links a user to a module with a status
- **Submission** — a student's submitted work and its review status
- **Review** — outcome + feedback, attributed to Management or the AI Coach
- **XpLedger** — every XP award, who/what scored it, individual vs. team
  component, timestamp
- **Team / TeamMember** — team-based contribution grouping
- **Notification** — nudges and escalations, targeted at a user or role

## Open product decisions

The PRD deliberately leaves several policy questions open (scoring authority, XP
calculation, nudge/escalation thresholds, team formation, report filters, etc.)
— see
[Section 10 of the PRD](<./Katalyst_Gamification_PRD%20(1).md#10-ambiguities--open-questions>).
Defaults already baked into the backend to unblock development, and which still
need explicit team sign-off, are tracked in
[`backend/DECISIONS.md`](./backend/DECISIONS.md).
