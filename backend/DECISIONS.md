# Decision Log

Plain-language log of defaults baked into the backend that the *team*, not
just the engineer who wrote the code, should sign off on. None of these are
bugs — the code works as written — but each one picked a specific number or
policy where the PRD left the question open, and nobody outside the code has
explicitly agreed to it yet.

**How to read this:** "Needs sign-off" = a real decision is hiding in the
code as a default value; it works today but the team should consciously
agree to it (or change it) before it's treated as final, especially before a
demo where someone might ask "wait, why 3 days?"

---

## A. Pre-existing decisions (not touched this round, flagged by the audit)

| # | Decision | Where in code | Status |
|---|----------|----------------|--------|
| A1 | Signup is **admin-only** — only an already-authenticated Katalyst Management user can create accounts. Backend PRD §3 flags this exact choice as something to "confirm with the team before building," but that confirmation never happened; the code shipped with the safer default anyway. | `src/features/auth/auth.routes.js`, lines 11-23 (`POST /auth/signup` behind `requireAuth` + `requireRole(ROLES.KATALYST_MANAGEMENT)`) | **Needs sign-off.** The outcome (admin-only) is the PRD's own recommended safer default, so this is low-risk to ratify — but it was never actually asked, so it isn't a standing decision yet. |
| A2 | Fixed XP point values per module type: session 10, course 20, mentoring 15, project 40, assignment 25, milestone 15. This is the answer to main PRD open question #2 ("XP calculation method") — but these exact numbers appear in neither PRD document. Someone picked them without a written source. | `src/features/aiCoach/aiCoach.service.js`, lines 8-15 (`XP_RULES` object) | **Needs sign-off.** Works fine as a default; the team should confirm these are the intended point values (or replace them) before treating XP totals as final. |

---

## B. New defaults introduced in this remediation round

| # | Decision | Where in code | Status |
|---|----------|----------------|--------|
| B1 | A nudge counts as "already sent" for **24 hours** — a student won't be nudged again inside that window even if they're still inactive. | `src/features/notifications/notifications.service.js`, line 7 (`NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000`) | **Needs sign-off.** PRD §8 leaves the exact cooldown window undecided; 24h was picked as a reasonable default (also flagged in code with a `ponytail:` comment). |
| B2 | "Reduced activity" (the trigger for a nudge) means **no submission in 7 days**. | `src/jobs/nudgeScheduler.js`, line 10 (`INACTIVITY_THRESHOLD_DAYS = 7`) | **Needs sign-off.** PRD open question #4 never defines "reduced activity" numerically; 7 days was chosen as a default (flagged with a `ponytail:` comment in code). |
| B3 | A submission escalates to higher management once it's **3 days past its module's due date** and still not scored. This is the answer to main PRD open question #5. | `src/features/notifications/notifications.service.js`, line 11 (`ESCALATION_OVERDUE_MS = 3 * 24 * 60 * 60 * 1000`) | **Needs sign-off.** One specific number chosen out of several plausible options (also flagged with a `ponytail:` comment in code). |
| B4 | Escalation dedup: each submission gets a unique trigger string (`escalation:submission:<id>`), and the job skips creating a new escalation notification if one with that trigger already exists — so a given submission escalates **at most once, ever**, no matter how many days it stays overdue. | `src/features/notifications/notifications.service.js`, lines 56-57 and 69-77 (`raiseOverdueEscalations`) | **Needs sign-off.** This wasn't asked for anywhere — it's the implementing agent's own addition to avoid spamming a daily duplicate escalation for the same submission. Reasonable, but the team hasn't agreed "once ever" is the right policy versus, say, a repeat/nag escalation. |
| B5 | Report filters (main PRD open question #9) are now **fully resolved**: all five candidate filters — student (`userId`), activity type (`moduleType`), date range (`dateFrom`/`dateTo`), team (`teamId`), and score range (`xpMin`/`xpMax`) — are implemented and wired into the query. | `src/features/reports/reports.schema.js` (validation, lines 6-12) and `src/features/reports/reports.repo.js` (query logic, lines 6-21) | **Resolved-by-implementation, same flag as above, but arguably fine to just ratify.** Nobody explicitly chose "implement all five" as policy — it just happened during remediation — but unlike B1-B4 this picked the maximal/inclusive option rather than one specific number out of several plausible choices, so there's less to actually disagree with here. Worth a quick nod from the team rather than a real debate. |

---

## Suggested next step

Walk A1, A2, B1, B2, B3, and B4 past the team explicitly (five short yes/no
questions); B5 can likely be rubber-stamped in the same conversation without
much discussion.
