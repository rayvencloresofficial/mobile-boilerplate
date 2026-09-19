import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address.'),
  phone_number: z.string()
    .trim()
    .min(11, 'Phone number must be at least 11 characters.')
    .max(15, 'Phone number cannot exceed 15 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password cannot exceed 100 characters.'),
  display_name: z.string().trim().min(1, 'Display name is required.').max(255),
  is_active: z.boolean().optional(),
  role_ids: z.array(z.string().uuid('Each role_id must be a valid UUID.')).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address.').optional(),
  phone_number: z.string().trim().optional().nullable(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password cannot exceed 100 characters.')
    .optional(),
  display_name: z.string().trim().min(1).max(255).optional().nullable(),
  is_active: z.boolean().optional(),
  role_ids: z.array(z.string().uuid('Each role_id must be a valid UUID.')).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID.'),
});
