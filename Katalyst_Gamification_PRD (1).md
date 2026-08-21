# Product Requirements Document

## Katalyst Learning Experience — Gamification Platform

**Status:** Draft v2.0 — revised against Phase 1 Requirement Analysis (SRS)
**Owner:** Product Analyst (team role) **Last updated:** August 21, 2026

---

## 1. Overview

Katalyst is a four-year learning programme. Student engagement today is tracked
across disconnected tools (Katalyst Konnect, email, WhatsApp) and kept alive
mostly through manual reminders from programme staff. This PRD defines a
gamification layer on top of Katalyst that turns programme activity — sessions,
courses, mentoring, assignments, projects, and milestones — into a tracked,
rewarding, and socially visible experience, with an AI Coach as the primary
interface students interact with.

## 2. Problem Statement

- Engagement is manual and staff-intensive: programme staff spend time chasing
  students through emails, WhatsApp, and follow-ups.
- Progress data exists (in Katalyst Konnect) but is not surfaced in a way that
  motivates continued participation or competition.
- There is no unified system for recognizing achievement, tracking streaks, or
  creating peer-based motivation across the four-year journey.

## 3. Goals & Success Metrics

| Goal                                       | Target |
| ------------------------------------------ | ------ |
| Increase active student participation      | +25%   |
| Improve activity completion rates          | +20%   |
| Monthly engagement among enrolled students | ≥80%   |

These targets imply the system must be able to **measure** participation rate,
completion rate, and monthly engagement — this is a reporting/data requirement
in its own right (see FR030), not something the system achieves passively.

## 4. Stakeholders / Actors

Revised to four actors — split out per the source document's own distinction
(previous draft incorrectly merged the last two):

| Actor                           | Role                                                   | Explicit permissions                                                                                                  |
| ------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Student / Participant**       | The learner whose journey is gamified                  | Enroll, complete, submit, view own yearly XP                                                                          |
| **Katalyst Management (Admin)** | Runs the programme day-to-day                          | Create/configure activities, review submissions, score, generate filtered reports                                     |
| **Higher Management**           | Programme-level oversight, above day-to-day Management | Receive notifications/escalations, view a dashboard — **no scoring or creation authority** (recipient/oversight only) |
| **AI Coach**                    | The primary student-facing interface (system actor)    | Review, give feedback, score, nudge/remind, give progress updates, present challenges                                 |

_Correction from v1: Higher Management was previously folded into
"Admin/Management." Point O names it as a separate destination for escalations
and dashboards, distinct from Katalyst Management — it has visibility only,
never edit/score/create rights._

## 5. Scope & Prioritization

Three tiers, matching the source document's own structure rather than a flat
must-have/nice-to-have split:

**P0 — Must Have** (source's own "MUST HAVES," A–L)

- A/D: Admin creates activities across all 6 types (sessions, courses,
  mentoring, projects, assignments, other milestones)
- B/I/J: Student enrolls, completes, submits for acknowledgment
- C/G: Management scores submissions as XP
- E: Activities classified Mandatory (due date) / Optional (self-driven) /
  Certificate-based
- F: Review of submitted work
- H: Filtered report generation
- K: Student views yearly XP
- L: AI Coach reviews, gives feedback, scores, nudges/reminds

**P1 — Important** (source's own "GOOD TO HAVES," M–O, plus Expectation-level
duties explicitly named)

- M/N: Individual and team-based contributions and scoring
- O: Notification/escalation delivery to Higher Management and Katalyst
  Dashboards
- AI Coach's Expectation-level duties: progress updates, challenges (named in
  the Expectation paragraph, not just point L)
- Both dashboards (Higher Management, Katalyst Management)
- Engagement metric tracking (participation rate, completion rate, monthly
  engagement — needed to prove the 25/20/80% targets)

**P2 — Good to Have** (only introduced via "the solution _could also include_"
wording — the source's own softest tier)

- Individual and team leaderboards
- Streaks, achievements, missions
- Gamified milestone recognition (distinct from "milestone" as an activity type
  — see Section 11)
- General social/peer interaction features

Build P0 completely before touching P1, and P1 before P2. A working "boring"
loop beats a flashy leaderboard with no scoring underneath it.

## 6. Functional Requirements (summary)

| ID        | Requirement                                               | Actor                         | Priority |
| --------- | --------------------------------------------------------- | ----------------------------- | -------- |
| FR001     | Create activities (6 types)                               | Katalyst Management           | P0       |
| FR002     | Classify activity as Mandatory/Optional/Certificate-based | Katalyst Management           | P0       |
| FR003     | Student enrollment/registration                           | Student                       | P0       |
| FR004     | Mark activity complete                                    | Student                       | P0       |
| FR005     | Submit work for acknowledgment                            | Student                       | P0       |
| FR006     | Review submitted work                                     | Katalyst Management           | P0       |
| FR007     | Score reviewed work                                       | Katalyst Management           | P0       |
| FR008     | Convert score into XP credited to student                 | System                        | P0       |
| FR009     | View yearly XP total                                      | Student                       | P0       |
| FR010     | Generate filtered reports                                 | Katalyst Management           | P0       |
| FR011–014 | AI Coach: review, feedback, scoring, nudges/reminders     | AI Coach                      | P0       |
| FR015     | Tag work as individual or team contribution               | Student, Management           | P1       |
| FR016     | Score accounting for team + individual effort             | Management, AI Coach          | P1       |
| FR017     | Notification/escalation delivery (scoring, due dates)     | System                        | P1       |
| FR025     | AI Coach presents challenges                              | AI Coach                      | P1       |
| FR026     | AI Coach delivers progress updates                        | AI Coach                      | P1       |
| FR027     | Student centralized progress dashboard                    | Student                       | P1       |
| FR028     | Higher Management dashboard                               | Higher Management             | P1       |
| FR029     | Katalyst Management dashboard                             | Katalyst Management           | P1       |
| FR030     | Track participation/completion/engagement rate            | Management, Higher Management | P1       |
| FR018–019 | Individual & team leaderboards                            | Student                       | P2       |
| FR020     | Streaks                                                   | Student                       | P2       |
| FR021     | Achievements                                              | Student                       | P2       |
| FR022     | Missions                                                  | Student                       | P2       |
| FR023     | Gamified milestone recognition                            | Student                       | P2       |
| FR024     | Social/peer interaction features                          | Student                       | P2       |

## 7. User Flow

**Core loop (P0):**

1. **Katalyst Management** creates a module
   (session/course/mentoring/assignment/project/milestone) and classifies it
   Mandatory (with due date), Optional, or Certificate-based.
2. **Student** enrolls, completes the unit, and submits for acknowledgment.
3. **AI Coach** does a first-pass review, generates feedback, and — per the
   decision in Section 10 — either scores directly or routes to Management.
4. **Katalyst Management** performs final scoring (XP awarded) for anything not
   confidently auto-scored.
5. **Student dashboard** updates: yearly XP, progress.

**Extended loop (P1):**

6. Contributions can be tagged individual or team (M), and scoring can weight
   team + individual effort (N).
7. Scoring/due-date events generate **notifications/escalations** to Higher
   Management's dashboard and the Katalyst Management dashboard (O).
8. The AI Coach's nudges specifically target students showing reduced
   participation — the system's answer to "students losing momentum" from the
   Current Challenges narrative.

**Aspirational loop (P2):** leaderboards, streaks, achievements, missions, and
social features layer on top once P0/P1 are solid.

## 8. Tech Stack

| Layer    | Choice     |
| -------- | ---------- |
| Frontend | React      |
| Backend  | Node.js    |
| Database | PostgreSQL |

This is the first architecture decision layered on top of the Phase 1
requirement analysis (which was intentionally tech-agnostic). It shapes a few
things worth calling out:

- **API shape:** a Node backend naturally exposes REST (or GraphQL) endpoints
  per resource — enrollments, submissions, reviews, scores, notifications. Keep
  the AI Coach behind its own service boundary (e.g.
  `POST /submissions/:id/ai-review`) so Option A vs. Option B (Section 9) is a
  routing decision, not a rewrite.
- **Postgres fits the data well:** the domain is relational (users → enrollments
  → submissions → scores), XP needs to be summed/aggregated reliably (SQL
  aggregates), and auditability (Section 12) benefits from foreign-key integrity
  and transactional writes — a submission being reviewed and scored should
  happen in one transaction so XP is never credited without a recorded review.
- **Real-time-ish needs:** nudges/notifications (FR014, FR017) don't need a full
  real-time layer for a hackathon — polling or a simple job (e.g. `node-cron`)
  checking due dates/inactivity on an interval is enough to demo. Reserve
  WebSockets/queues for later if the team has time.
- **Team-role mapping:** Frontend Developer → React app (student portal, admin
  panel, both dashboards); Backend Developer → Node API + AI Coach integration;
  Database Developer → Postgres schema, migrations, and the XP ledger; QA
  Engineer → API/integration tests against the Node layer; Product Analyst →
  acceptance testing against the running stack.

## 9. Data Model (Postgres schema, high level)

Relational tables, matching the stack above. Keep `xp_ledger` as an append-only
table (never update/delete a row) so every award is auditable per NFR
"auditability."

```sql
users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student','katalyst_management','higher_management')),
  cohort_year INT
);

modules (
  id UUID PRIMARY KEY,
  type TEXT CHECK (type IN ('session','course','mentoring','project','assignment','milestone')),
  classification TEXT CHECK (classification IN ('mandatory','optional','certificate')),
  due_date TIMESTAMP,           -- required when classification = 'mandatory'
  created_by UUID REFERENCES users(id)
);

enrollments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  status TEXT CHECK (status IN ('enrolled','completed'))
);

submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  submitted_at TIMESTAMP DEFAULT now(),
  content_ref TEXT,
  status TEXT CHECK (status IN ('pending','reviewed','scored')),
  team_id UUID REFERENCES teams(id)   -- nullable; P1
);

reviews (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id),
  reviewer_type TEXT CHECK (reviewer_type IN ('management','ai_coach')),
  reviewer_id UUID REFERENCES users(id),  -- null if ai_coach
  outcome TEXT,
  feedback_text TEXT,
  reviewed_at TIMESTAMP DEFAULT now()
);

xp_ledger (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id),
  scored_by TEXT CHECK (scored_by IN ('management','ai_coach')),
  xp_awarded INT NOT NULL,
  individual_component INT,
  team_component INT,
  created_at TIMESTAMP DEFAULT now()
);

teams (            -- P1
  id UUID PRIMARY KEY,
  name TEXT
);

team_members (      -- P1
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id)
);

notifications (      -- P1
  id UUID PRIMARY KEY,
  target_user_id UUID REFERENCES users(id),  -- null if role-targeted
  target_role TEXT,                          -- e.g. 'higher_management'
  type TEXT CHECK (type IN ('nudge','escalation')),
  trigger TEXT,
  sent_at TIMESTAMP DEFAULT now()
);
```

## 10. AI Coach — Open Decision (scoring authority)

Point **C** states scoring is a Management responsibility; point **L.c** states
the AI Coach performs scoring. The source text does not define precedence.
Decide one of:

- **Option A — Assist mode:** AI Coach scores as a suggestion; Management
  approves/overrides before XP is finalized. Safer, slower.
- **Option B — Autonomous mode (recommended for a hackathon build):** AI Coach
  auto-scores objective/well-defined activities (e.g., quiz-based courses,
  attendance); Management reviews only subjective/high-stakes submissions
  (projects, mentoring). Easier to demo convincingly than a full approval
  workflow. In the Node backend, this is naturally a branch in the
  review-handling route rather than a separate service.

## 11. Ambiguities / Open Questions

Carried over and expanded from the requirement analysis — these should be
resolved by the team before backend logic is finalized, not assumed silently:

1. **Scoring authority** — does AI Coach scoring finalize XP, or does Management
   always confirm? (Section 10)
2. **XP calculation method** — fixed value per activity type, or
   reviewer/AI-assigned on a scale?
3. **Scoring rubric** — what distinguishes a high vs. low score for a given
   submission?
4. **"Losing momentum" definition** — what inactivity pattern or threshold
   triggers a re-engagement nudge?
5. **Notification/escalation thresholds** — what specific scoring or due-date
   condition escalates vs. just notifies?
6. **Leaderboard metric** — ranked purely by XP, or a composite metric? Over
   what time window?
7. **Team formation** — are teams assigned by Management, self-formed by
   students, or tied to an existing cohort/group?
8. **"Milestone" double meaning** — is a gamification "milestone" (recognition
   event, e.g. "reached 500 XP") the same object as the "milestone" activity
   type from point D, or a separate concept?
9. **Report filter fields** — which fields must filtered reports (H) support:
   student, activity type, date range, team, score range?
10. **Dashboard content differentiation** — do the Higher Management dashboard
    and Katalyst Management dashboard show the same data at different
    aggregation levels, or genuinely different content?

## 12. Non-Functional Requirements

- **Transparency:** students can see their own progress/standing at any time.
- **Auditability:** every XP award records who/what scored it and when.
- **Timeliness:** nudges/escalations fire close to the triggering event (a due
  date, a completed review).
- **Reduces staff load:** the system should measurably cut manual
  reminder/follow-up work, not add to it.
- **Healthy competition:** competitive features must read as friendly, not
  discouraging — a presentation constraint as much as a technical one.
- **Multi-year integrity:** progress data must stay consistent and unbroken
  across the full four-year journey.
- **Scale:** must support the full enrolled student population for the
  programme's duration.

## 13. Team Roles & Ownership

_Note: this is delivery-team structure for building the hackathon solution — not
a system requirement or capability, consistent with the source document's own
exclusion of this list from its requirement analysis._

| Role                   | Primary ownership                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Developer** | React app: student portal (enroll, submit, view XP, AI Coach chat UI), admin panel (add modules, review queue, report filters), both dashboards                     |
| **Backend Developer**  | Node API: enrollment/submission/review/scoring endpoints, XP calculation, AI Coach integration, notification/escalation logic                                       |
| **Database Developer** | Postgres schema (Section 9), migrations, XP ledger integrity, team/individual data model                                                                            |
| **QA Engineer**        | End-to-end loop testing across the React/Node/Postgres stack, edge cases (late/duplicate submissions, resubmission after feedback), notification trigger validation |
| **Product Analyst**    | Acceptance criteria against A–L, demo script, KPI framing, resolving Sections 10–11 decisions                                                                       |

## 14. Milestones (suggested hackathon build order)

1. Data model + admin module creation (FR001, FR002)
2. Student enroll + submit flow (FR003–FR005)
3. Review + scoring, Management path (FR006–FR008)
4. AI Coach review/feedback/nudge layer (FR011–FR014)
5. Student XP view + reports (FR009, FR010)
6. P1: teams, team scoring, dashboards, escalation notifications (FR015–FR017,
   FR025–FR030)
7. P2 (time permitting): leaderboards, streaks, achievements, missions, social
   features (FR018–FR024)
