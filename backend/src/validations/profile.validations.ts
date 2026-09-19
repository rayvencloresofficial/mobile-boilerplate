import { z } from 'zod';

export const createProfileSchema = z.object({
    user_id: z.string().uuid('User ID must be a valid UUID.'),
    first_name: z.string().trim().max(100).optional().nullable(),
    last_name: z.string().trim().max(100).optional().nullable(),
    middle_name: z.string().trim().max(100).optional().nullable(),
    date_of_birth: z.string().trim().max(50).optional().nullable(),
    gender: z.string().trim().max(20).optional().nullable(),
    nationality: z.string().trim().max(100).optional().nullable(),
});

export const updateProfileSchema = z.object({
    first_name: z.string().trim().max(100).optional().nullable(),
    last_name: z.string().trim().max(100).optional().nullable(),
    middle_name: z.string().trim().max(100).optional().nullable(),
    date_of_birth: z.string().trim().max(50).optional().nullable(),
    gender: z.string().trim().max(20).optional().nullable(),
    nationality: z.string().trim().max(100).optional().nullable(),
});

export const userIdParamSchema = z.object({
    userId: z.string().uuid('User ID must be a valid UUID.'),
});

export const profileIdParamSchema = z.object({
    id: z.string().uuid('Profile ID must be a valid UUID.'),
});
