import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password cannot exceed 100 characters.'),
  display_name: z.string().trim().min(1, 'Display name is required.').max(255),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required.'),
});

export const syncFirebaseUserSchema = z.object({
  firebase_uid: z.string().trim().nullable().optional(),
  email: z.string().trim().email('Please provide a valid email address.'),
  display_name: z.string().trim().nullable().optional(),
  avatar_url: z.string().trim().nullable().optional(),
});

export const updateProfileSchema = z.object({
  phone_number: z.string().trim().optional().nullable(),
  display_name: z.string().trim().optional().nullable(),
  avatar_url: z.string().trim().optional().nullable(),
  first_name: z.string().trim().max(100).optional().nullable(),
  last_name: z.string().trim().max(100).optional().nullable(),
  middle_name: z.string().trim().max(100).optional().nullable(),
  date_of_birth: z.string().trim().max(50).optional().nullable(),
  gender: z.string().trim().max(20).optional().nullable(),
  nationality: z.string().trim().max(100).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional().nullable(),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters.')
    .max(100, 'New password cannot exceed 100 characters.'),
});

