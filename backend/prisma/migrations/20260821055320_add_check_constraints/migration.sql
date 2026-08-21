-- Constraints not expressible in prisma/schema.prisma (Prisma has no CHECK
-- constraint modeling), added by hand so they're still enforced for any
-- write path that doesn't go through the app's Zod validation layer.

-- Mirrors modules.schema.js: mandatory modules must have a due date.
ALTER TABLE "modules" ADD CONSTRAINT "modules_mandatory_due_date_check"
  CHECK (classification <> 'mandatory' OR due_date IS NOT NULL);

-- Mirrors reviews.schema.js: keeps a bad/typo'd XP value out of the
-- append-only ledger even if written outside the API (e.g. AI Coach path).
ALTER TABLE "xp_ledger" ADD CONSTRAINT "xp_ledger_xp_awarded_range_check"
  CHECK (xp_awarded >= 1 AND xp_awarded <= 1000);
