# Notification & Escalation System Notes

This directory contains the components for the Notification / Escalation System (Requirement O).

## Ambiguities and Defaults
Per the SRS, the exact business rules for what triggers an escalation vs a standard notification are ambiguous. The following defaults have been implemented and can be configured in `src/services/notificationService.js`:

1. **Thresholds (Trigger Logic)**
   - **Due Date:** Overdue by > 2 days generates an **escalation**. Overdue <= 2 days generates a **notification**.
   - **Scoring:** Submission score < 60% generates an **escalation**.

2. **Dashboard Routing (Audience)**
   - **Higher Management (Directors):** Only sees escalations (`audience: 'higher_management' | 'both'`). This reduces noise for an oversight role.
   - **Katalyst Management (Mentors):** Sees both standard notifications and escalations (`audience: 'katalyst_management' | 'both'`).
