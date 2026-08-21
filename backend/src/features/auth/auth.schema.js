const { z } = require('zod');
const { ROLES } = require('../../constants/roles');

const signupSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  email: z.string().trim().toLowerCase().email('invalid email'),
  password: z.string().min(8, 'password must be at least 8 characters'),
  role: z.enum([ROLES.STUDENT, ROLES.KATALYST_MANAGEMENT, ROLES.HIGHER_MANAGEMENT, ROLES.MENTOR]),
  cohortYear: z.coerce.number().int().positive().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('invalid email'),
  password: z.string().min(1, 'password is required'),
});

module.exports = { signupSchema, loginSchema };
