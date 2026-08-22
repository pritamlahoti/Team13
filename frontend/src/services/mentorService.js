const mockMentees = [
  {
    id: 'mentee1',
    name: 'Aarav Sharma',
    avatar: 'A',
    task: 'Career Development',
    progress: 85,
    pulse: 'Strong Momentum',
    pulseTrend: '+18%',
    status: 'Active',
    lastFeedback: 'Strong improvement in project confidence.',
    nextBestAction: 'Review his project proposal.',
    memory: {
      lastDiscussed: 'Build confidence with presentations',
      previousConcern: 'Difficulty explaining technical decisions',
      agreedAction: 'Practice project explanation twice this week',
      nextCheckpoint: '25 Aug 2026'
    },
    radar: { tech: 90, comm: 70, problem: 85, project: 95, career: 60 },
    journey: [
      { date: '01 Aug', event: 'Assigned Mentor' },
      { date: '05 Aug', event: 'Initial Assessment' },
      { date: '09 Aug', event: 'Goal Setting' },
      { date: '14 Aug', event: 'First Mentoring Session' },
      { date: '18 Aug', event: 'Project Review' },
      { date: '21 Aug', event: 'Feedback Given' },
      { date: '25 Aug', event: 'Next Session' }
    ]
  },
  {
    id: 'mentee2',
    name: 'Priya Mehta',
    avatar: 'P',
    task: 'Python Mentoring',
    progress: 60,
    pulse: 'On Track',
    pulseTrend: '+5%',
    status: 'Active',
    lastFeedback: 'Good start on Python basics, needs to practice loops.',
    nextBestAction: 'Schedule a follow-up session.',
    memory: {
      lastDiscussed: 'Python basics',
      previousConcern: 'Understanding loops',
      agreedAction: 'Complete 3 loop exercises',
      nextCheckpoint: '28 Aug 2026'
    },
    radar: { tech: 60, comm: 80, problem: 70, project: 50, career: 40 },
    journey: [
      { date: '10 Aug', event: 'Assigned Mentor' },
      { date: '15 Aug', event: 'Initial Session' }
    ]
  },
  {
    id: 'mentee3',
    name: 'Rohan Patil',
    avatar: 'R',
    task: 'Project Architecture',
    progress: 30,
    pulse: 'Needs Attention',
    pulseTrend: '-12%',
    status: 'At Risk',
    lastFeedback: 'Needs to engage more with the material.',
    nextBestAction: 'Provide feedback on his pending submission.',
    memory: {
      lastDiscussed: 'Project Ideas',
      previousConcern: 'No clear project direction',
      agreedAction: 'Submit a proposal',
      nextCheckpoint: 'Overdue'
    },
    radar: { tech: 40, comm: 50, problem: 60, project: 30, career: 20 },
    journey: [
      { date: '01 Aug', event: 'Assigned Mentor' },
      { date: '10 Aug', event: 'Missed Session' }
    ]
  }
];

const mockSessions = [
  { id: 'sess1', menteeId: 'mentee1', studentName: 'Aarav Sharma', time: 'Today, 10:30 AM', task: 'Career Guidance' },
  { id: 'sess2', menteeId: 'mentee2', studentName: 'Priya Mehta', time: 'Today, 3:00 PM', task: 'Python Mentoring' },
  { id: 'sess3', menteeId: 'mentee3', studentName: 'Rohan Patil', time: 'Tomorrow, 2:00 PM', task: 'Project Architecture Review' }
];

const mockReviews = [
  { id: 'rev1', menteeId: 'mentee3', studentName: 'Rohan Patil', task: 'Project Proposal', priority: 'High Priority', submissionDate: 'Waiting 5 days', previousFeedback: 'Break the project into smaller milestones.' },
  { id: 'rev2', menteeId: 'mentee2', studentName: 'Priya Mehta', task: 'Python Reflection', priority: 'Medium Priority', submissionDate: 'Waiting 2 days', previousFeedback: 'Good job on the syntax exercises.' }
];

export const mentorService = {
  getAssignedMentees: async () => mockMentees,
  getUpcomingSessions: async () => mockSessions,
  getPendingReviews: async () => mockReviews,
  getMentorStats: async () => ({
    impactScore: 4.8,
    sessions: 86,
    feedbackCycles: 71,
    mentees: 28,
    reviews: 64,
    streak: 12,
    menteeProgress: 82,
    feedbackResponse: 75,
    sessionConsistency: 94
  })
};
