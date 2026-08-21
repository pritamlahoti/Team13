const db = require('../../config/db');

async function getDashboardStats() {
  const queries = {
    studentsTotal: db.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
    studentsActive: db.query("SELECT COUNT(*) FROM users WHERE role = 'student' AND status = 'active'"),
    studentsInactive: db.query("SELECT COUNT(*) FROM users WHERE role = 'student' AND status = 'inactive'"),
    mentorsTotal: db.query("SELECT COUNT(*) FROM users WHERE role = 'mentor'"),
    activitiesTotal: db.query("SELECT COUNT(*) FROM activities"),
    activitiesActive: db.query("SELECT COUNT(*) FROM activities WHERE status = 'published'"),
    activitiesOverdue: db.query("SELECT COUNT(*) FROM activities WHERE status = 'published' AND due_date < NOW()"),
    totalXp: db.query("SELECT SUM(xp_earned) FROM xp_transactions")
  };

  // Wait for all queries to resolve
  const keys = Object.keys(queries);
  const promises = Object.values(queries);
  const results = await Promise.all(promises);

  const stats = {};
  keys.forEach((key, index) => {
    // If it's the SUM query, it might return null if no rows, coalesce in code or SQL.
    const val = results[index].rows[0]?.count || results[index].rows[0]?.sum || 0;
    stats[key] = Number(val);
  });

  return stats;
}

// Phase 3 & 4: Activity CRUD
async function listActivities() {
  const res = await db.query(`
    SELECT a.*, at.type_name
    FROM activities a
    JOIN activity_types at ON a.activity_type_id = at.activity_type_id
    ORDER BY a.created_at DESC
  `);
  return res.rows;
}

async function getActivity(id) {
  const res = await db.query(`
    SELECT a.*, at.type_name
    FROM activities a
    JOIN activity_types at ON a.activity_type_id = at.activity_type_id
    WHERE a.activity_id = $1
  `, [id]);
  return res.rows[0];
}

async function createActivity(data, createdBy) {
  const { type_name, cohort_id, title, description, xp_value, start_date, due_date, status, details } = data;
  
  // Find type_id
  const typeRes = await db.query('SELECT activity_type_id, default_xp FROM activity_types WHERE type_name = $1', [type_name]);
  if (typeRes.rows.length === 0) throw new Error('Invalid activity type');
  const typeId = typeRes.rows[0].activity_type_id;
  const xp = xp_value !== undefined ? xp_value : typeRes.rows[0].default_xp;

  const res = await db.query(`
    INSERT INTO activities 
      (activity_type_id, cohort_id, title, description, xp_value, start_date, due_date, status, created_by, details)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `, [
    typeId,
    cohort_id || null,
    title,
    description || null,
    xp,
    start_date || null,
    due_date || null,
    status || 'draft',
    createdBy,
    details || {}
  ]);
  return res.rows[0];
}

async function updateActivity(id, data) {
  // Simple update, assuming all fields provided are to be updated.
  // In a real app we'd build a dynamic query.
  const { title, description, xp_value, start_date, due_date, status, details } = data;
  const res = await db.query(`
    UPDATE activities
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      xp_value = COALESCE($3, xp_value),
      start_date = COALESCE($4, start_date),
      due_date = COALESCE($5, due_date),
      status = COALESCE($6, status),
      details = COALESCE($7, details),
      updated_at = NOW()
    WHERE activity_id = $8
    RETURNING *
  `, [title, description, xp_value, start_date, due_date, status, details, id]);
  return res.rows[0];
}

async function updateActivityStatus(id, status) {
  const res = await db.query(`
    UPDATE activities
    SET status = $1, updated_at = NOW()
    WHERE activity_id = $2
    RETURNING *
  `, [status, id]);
  return res.rows[0];
}

// Phase 6: Student Management
async function listStudents(filters = {}) {
  let queryStr = `SELECT u.user_id, u.full_name, u.email, u.status, u.cohort_id, c.name as cohort_name, us.total_xp, us.current_streak
                  FROM users u
                  LEFT JOIN cohorts c ON u.cohort_id = c.cohort_id
                  LEFT JOIN user_stats us ON u.user_id = us.user_id
                  WHERE u.role = 'student'`;
  const params = [];
  if (filters.status) {
    params.push(filters.status);
    queryStr += ` AND u.status = $${params.length}`;
  }
  if (filters.cohort_id) {
    params.push(filters.cohort_id);
    queryStr += ` AND u.cohort_id = $${params.length}`;
  }
  queryStr += ` ORDER BY u.created_at DESC`;
  const res = await db.query(queryStr, params);
  return res.rows;
}

async function getStudent(id) {
  const res = await db.query(`
    SELECT u.user_id, u.full_name, u.email, u.phone, u.status, u.cohort_id, c.name as cohort_name, 
           us.total_xp, us.current_streak, us.longest_streak, us.last_activity_date,
           m.user_id as mentor_id, m.full_name as mentor_name
    FROM users u
    LEFT JOIN cohorts c ON u.cohort_id = c.cohort_id
    LEFT JOIN user_stats us ON u.user_id = us.user_id
    LEFT JOIN mentor_assignments ma ON u.user_id = ma.student_id AND ma.active = TRUE
    LEFT JOIN users m ON ma.mentor_id = m.user_id
    WHERE u.user_id = $1 AND u.role = 'student'
  `, [id]);
  return res.rows[0];
}

async function getStudentProgress(id) {
  // Returns recent XP transactions, submissions, and missions
  const xpRes = await db.query('SELECT * FROM xp_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [id]);
  const subRes = await db.query('SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 10', [id]);
  return {
    recent_xp: xpRes.rows,
    recent_submissions: subRes.rows
  };
}

// Phase 7: Mentor Management
async function listMentors() {
  const res = await db.query(`
    SELECT user_id, full_name, email, phone, status, cohort_id
    FROM users
    WHERE role = 'mentor'
    ORDER BY created_at DESC
  `);
  return res.rows;
}

async function getMentor(id) {
  const res = await db.query(`
    SELECT user_id, full_name, email, phone, status, cohort_id
    FROM users
    WHERE role = 'mentor' AND user_id = $1
  `, [id]);
  return res.rows[0];
}

async function getMentorStudents(mentorId) {
  const res = await db.query(`
    SELECT u.user_id, u.full_name, u.email, u.status, us.total_xp, ma.assigned_at
    FROM users u
    JOIN mentor_assignments ma ON u.user_id = ma.student_id
    LEFT JOIN user_stats us ON u.user_id = us.user_id
    WHERE ma.mentor_id = $1 AND ma.active = TRUE
  `, [mentorId]);
  return res.rows;
}

async function assignMentor(mentorId, studentId) {
  const res = await db.query(`
    INSERT INTO mentor_assignments (mentor_id, student_id, active)
    VALUES ($1, $2, TRUE)
    ON CONFLICT (mentor_id, student_id) 
    DO UPDATE SET active = TRUE, assigned_at = NOW()
    RETURNING *
  `, [mentorId, studentId]);
  return res.rows[0];
}

async function removeMentorAssignment(mentorId, studentId) {
  await db.query(`
    UPDATE mentor_assignments
    SET active = FALSE
    WHERE mentor_id = $1 AND student_id = $2
  `, [mentorId, studentId]);
}

// Phase 8: XP Rules Management
async function getXpRules() {
  const res = await db.query(`SELECT activity_type_id, type_name, default_xp FROM activity_types ORDER BY activity_type_id`);
  return res.rows;
}

async function updateXpRules(rules) {
  // rules is an array of { type_name, default_xp }
  const updated = [];
  for (const rule of rules) {
    if (rule.type_name && rule.default_xp !== undefined) {
      const res = await db.query(`
        UPDATE activity_types
        SET default_xp = $1
        WHERE type_name = $2
        RETURNING *
      `, [rule.default_xp, rule.type_name]);
      if (res.rows[0]) updated.push(res.rows[0]);
    }
  }
  return updated;
}

// Phase 9 & 10: Analytics & Engagement
async function getAnalyticsOverview(filters = {}) {
  // Simple analytics query, could be expanded based on filters
  const res = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role='student') as total_students,
      (SELECT COUNT(*) FROM users WHERE role='mentor') as total_mentors,
      (SELECT SUM(xp_earned) FROM xp_transactions) as total_xp,
      (SELECT COUNT(*) FROM activities WHERE status='published') as active_activities
  `);
  return res.rows[0];
}

async function getAtRiskStudents() {
  // Example rule: At Risk if last activity date is more than 7 days ago
  const res = await db.query(`
    SELECT u.user_id as "studentId", u.full_name as "studentName", us.last_activity_date as "lastActivity",
           us.total_xp as xp, 'at_risk' as "riskLevel", ma.mentor_id as "mentorId"
    FROM users u
    JOIN user_stats us ON u.user_id = us.user_id
    LEFT JOIN mentor_assignments ma ON u.user_id = ma.student_id AND ma.active = TRUE
    WHERE u.role = 'student' 
      AND (us.last_activity_date IS NULL OR us.last_activity_date < NOW() - INTERVAL '7 days')
  `);
  return res.rows;
}

module.exports = {
  getDashboardStats,
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  updateActivityStatus,
  listStudents,
  getStudent,
  getStudentProgress,
  listMentors,
  getMentor,
  getMentorStudents,
  assignMentor,
  removeMentorAssignment,
  getXpRules,
  updateXpRules,
  getAnalyticsOverview,
  getAtRiskStudents
};

