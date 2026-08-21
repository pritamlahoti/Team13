-- Katalyst Gamification schema.
-- Source: Katalyst_Gamification_PRD section 9, extended by backend PRD section 5.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'katalyst_management', 'higher_management')),
  cohort_year INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('session', 'course', 'mentoring', 'project', 'assignment', 'milestone')),
  classification TEXT NOT NULL CHECK (classification IN ('mandatory', 'optional', 'certificate')),
  scoring_mode TEXT NOT NULL CHECK (scoring_mode IN ('objective', 'subjective')) DEFAULT 'subjective',
  due_date TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  status TEXT NOT NULL CHECK (status IN ('enrolled', 'completed')) DEFAULT 'enrolled',
  UNIQUE (user_id, module_id)
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  submitted_at TIMESTAMP DEFAULT now(),
  content_ref TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'scored')) DEFAULT 'pending',
  team_id UUID REFERENCES teams(id)
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id),
  reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('management', 'ai_coach')),
  reviewer_id UUID REFERENCES users(id),
  outcome TEXT,
  feedback_text TEXT,
  reviewed_at TIMESTAMP DEFAULT now()
);

CREATE TABLE xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id),
  scored_by TEXT NOT NULL CHECK (scored_by IN ('management', 'ai_coach')),
  xp_awarded INT NOT NULL,
  individual_component INT,
  team_component INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID REFERENCES users(id),
  target_role TEXT,
  type TEXT NOT NULL CHECK (type IN ('nudge', 'escalation')),
  trigger TEXT,
  sent_at TIMESTAMP DEFAULT now()
);
