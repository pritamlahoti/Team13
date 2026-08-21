-- ============================================================
-- KATALYST LEARNING EXPERIENCE — POSTGRESQL SCHEMA (CORRECTED)
-- TABLES ONLY — functions/procedures/triggers come next
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 0. ENUM TYPES
-- ============================================================
CREATE TYPE user_role          AS ENUM ('student','admin','mentor','ai_coach');
CREATE TYPE user_status        AS ENUM ('active','inactive','graduated');
CREATE TYPE cohort_status      AS ENUM ('active','completed','archived');
CREATE TYPE activity_status    AS ENUM ('draft','published','closed','archived');
CREATE TYPE submission_status  AS ENUM ('pending','acknowledged','rejected','scored');
CREATE TYPE xp_source          AS ENUM ('activity','achievement','mission','manual_admin','ai_coach_bonus');
CREATE TYPE mission_status     AS ENUM ('in_progress','completed');
CREATE TYPE leaderboard_scope  AS ENUM ('individual','team');
CREATE TYPE leaderboard_period AS ENUM ('weekly','monthly','alltime');
CREATE TYPE nudge_type         AS ENUM ('reminder','encouragement','challenge','re_engagement');
CREATE TYPE notification_type  AS ENUM ('score_released','achievement_unlocked','mission_complete',
                                         'nudge','streak_risk','submission_acknowledged');

-- ============================================================
-- 1. IDENTITY & ORG STRUCTURE
-- ============================================================

CREATE TABLE cohorts (
  cohort_id     BIGSERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  status        cohort_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date > start_date)
);

CREATE TABLE users (
  user_id       BIGSERIAL PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash TEXT,
  role          user_role NOT NULL,
  cohort_id     BIGINT REFERENCES cohorts(cohort_id),
  status        user_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (role <> 'student' OR cohort_id IS NOT NULL)
);
CREATE INDEX idx_users_role_cohort ON users(role, cohort_id);
CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);

CREATE TABLE mentor_assignments (
  mentor_id     BIGINT NOT NULL REFERENCES users(user_id),
  student_id    BIGINT NOT NULL REFERENCES users(user_id),
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (mentor_id, student_id)
);

CREATE TABLE teams (
  team_id       BIGSERIAL PRIMARY KEY,
  cohort_id     BIGINT NOT NULL REFERENCES cohorts(cohort_id),
  team_name     VARCHAR(100) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, team_name)
);

CREATE TABLE team_members (
  team_id       BIGINT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES users(user_id),
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- ============================================================
-- 2. ACTIVITIES / MODULES
-- ============================================================

CREATE TABLE activity_types (
  activity_type_id  SMALLSERIAL PRIMARY KEY,
  type_name         VARCHAR(30) NOT NULL UNIQUE,
  default_xp        INT NOT NULL DEFAULT 0
);
INSERT INTO activity_types (type_name, default_xp) VALUES
  ('session',10), ('course',50), ('mentoring',20),
  ('project',80), ('assignment',30), ('milestone',15);

CREATE TABLE activities (
  activity_id       BIGSERIAL PRIMARY KEY,
  activity_type_id  SMALLINT NOT NULL REFERENCES activity_types(activity_type_id),
  cohort_id         BIGINT REFERENCES cohorts(cohort_id),
  title             VARCHAR(200) NOT NULL,
  description       TEXT,
  xp_value          INT NOT NULL DEFAULT 0 CHECK (xp_value >= 0),
  start_date        TIMESTAMPTZ,
  due_date          TIMESTAMPTZ,
  status            activity_status NOT NULL DEFAULT 'draft',
  created_by        BIGINT NOT NULL REFERENCES users(user_id),
  details           JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
);
CREATE INDEX idx_activities_type_cohort_status ON activities(activity_type_id, cohort_id, status);
CREATE INDEX idx_activities_details_gin ON activities USING gin (details);

CREATE TABLE enrollments (
  enrollment_id     BIGSERIAL PRIMARY KEY,
  activity_id       BIGINT NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE,
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  enrolled_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (activity_id, user_id)
);

-- ============================================================
-- 3. SUBMISSIONS & SCORING
-- ============================================================
-- FIXED #1: no more UNIQUE(activity_id, user_id) — resubmission
--           after 'rejected' status is now possible.
-- FIXED #2: score is constrained to 0–100.

CREATE TABLE submissions (
  submission_id     BIGSERIAL PRIMARY KEY,
  activity_id       BIGINT NOT NULL REFERENCES activities(activity_id),
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  status            submission_status NOT NULL DEFAULT 'pending',
  score             DECIMAL(6,2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  reviewed_by       BIGINT REFERENCES users(user_id),
  reviewed_at       TIMESTAMPTZ,
  content           JSONB NOT NULL DEFAULT '{}',
  attachments       JSONB NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_activity_user_latest
  ON submissions(activity_id, user_id, submitted_at DESC);

-- ============================================================
-- 4. GAMIFICATION CORE
-- ============================================================
-- FIXED #3: xp_earned can no longer be negative.

CREATE TABLE xp_transactions (
  transaction_id    BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  activity_id       BIGINT REFERENCES activities(activity_id),
  xp_earned         INT NOT NULL CHECK (xp_earned >= 0),
  source            xp_source NOT NULL,
  reason            VARCHAR(255),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_xp_user_time ON xp_transactions(user_id, created_at);

CREATE TABLE user_stats (
  user_id            BIGINT PRIMARY KEY REFERENCES users(user_id),
  total_xp           BIGINT NOT NULL DEFAULT 0,
  current_streak     INT NOT NULL DEFAULT 0,
  longest_streak     INT NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE achievements (
  achievement_id    BIGSERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  description       VARCHAR(255),
  xp_bonus          INT NOT NULL DEFAULT 0,
  criteria          JSONB NOT NULL
);

CREATE TABLE user_achievements (
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  achievement_id    BIGINT NOT NULL REFERENCES achievements(achievement_id),
  earned_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE missions (
  mission_id        BIGSERIAL PRIMARY KEY,
  title             VARCHAR(150) NOT NULL,
  cohort_id         BIGINT REFERENCES cohorts(cohort_id),
  start_date        TIMESTAMPTZ,
  end_date          TIMESTAMPTZ,
  xp_reward         INT NOT NULL DEFAULT 0,
  criteria          JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE mission_progress (
  mission_id        BIGINT NOT NULL REFERENCES missions(mission_id),
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  progress_pct      DECIMAL(5,2) NOT NULL DEFAULT 0,
  status            mission_status NOT NULL DEFAULT 'in_progress',
  completed_at      TIMESTAMPTZ,
  PRIMARY KEY (mission_id, user_id)
);

-- ============================================================
-- 5. LEADERBOARD
-- ============================================================

CREATE TABLE leaderboard_snapshots (
  snapshot_id       BIGSERIAL PRIMARY KEY,
  scope             leaderboard_scope NOT NULL,
  period            leaderboard_period NOT NULL,
  cohort_id         BIGINT REFERENCES cohorts(cohort_id),
  ref_id            BIGINT NOT NULL,
  rank              INT NOT NULL,
  xp_total          BIGINT NOT NULL,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_leaderboard_lookup ON leaderboard_snapshots(cohort_id, scope, period, rank);

-- ============================================================
-- 6. AI COACH
-- ============================================================

CREATE TABLE ai_coach_conversations (
  conversation_id   BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  session_start     TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end       TIMESTAMPTZ
);

CREATE TABLE ai_coach_messages (
  message_id        BIGSERIAL PRIMARY KEY,
  conversation_id    BIGINT NOT NULL REFERENCES ai_coach_conversations(conversation_id) ON DELETE CASCADE,
  role              VARCHAR(20) NOT NULL CHECK (role IN ('ai_coach','student')),
  text              TEXT NOT NULL,
  intent            VARCHAR(50),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_messages_conv ON ai_coach_messages(conversation_id, created_at);

CREATE TABLE ai_coach_nudges (
  nudge_id          BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  type              nudge_type NOT NULL,
  trigger_rule      VARCHAR(100),
  content           TEXT NOT NULL,
  delivered_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at           TIMESTAMPTZ,
  action_taken      BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_nudges_user ON ai_coach_nudges(user_id, delivered_at);

-- ============================================================
-- 7. ENGAGEMENT EVENTS (partitioned by month)
-- ============================================================
-- FIXED #4: partitions extended through end of 2026 so inserts
--           don't start failing next month. A function to
--           auto-create future partitions comes with Section 10.

CREATE TABLE engagement_events (
  event_id      BIGSERIAL,
  user_id       BIGINT NOT NULL REFERENCES users(user_id),
  event_type    VARCHAR(50) NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}',
  ts            TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, ts)
) PARTITION BY RANGE (ts);

CREATE TABLE engagement_events_2026_08 PARTITION OF engagement_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE engagement_events_2026_09 PARTITION OF engagement_events
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE engagement_events_2026_10 PARTITION OF engagement_events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE engagement_events_2026_11 PARTITION OF engagement_events
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE engagement_events_2026_12 PARTITION OF engagement_events
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE INDEX idx_events_user_ts ON engagement_events(user_id, ts);

-- ============================================================
-- 8. SOCIAL / PEER INTERACTION
-- ============================================================

CREATE TABLE social_posts (
  post_id       BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(user_id),
  post_type     VARCHAR(30) NOT NULL,
  content       TEXT,
  ref_id        BIGINT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_comments (
  comment_id    BIGSERIAL PRIMARY KEY,
  post_id       BIGINT NOT NULL REFERENCES social_posts(post_id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES users(user_id),
  text          VARCHAR(500) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_likes (
  post_id       BIGINT NOT NULL REFERENCES social_posts(post_id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES users(user_id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  notification_id   BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(user_id),
  type              notification_type NOT NULL,
  payload           JSONB NOT NULL DEFAULT '{}',
  read              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read = FALSE;

-- ============================================================
-- End of tables. Run this whole file first on Neon.
-- Functions, procedures, and triggers come next.
-- ============================================================