import type { Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service.js';
import type { ApiResponse } from '../types/api.js';
import type { AuthenticatedRequest } from '../types/auth.js';

export const getCurrentProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }

        const profile = await profileService.getProfileByUserId(userId);
        const response: ApiResponse<typeof profile> = {
            success: true,
            data: profile,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getProfileByUserId = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params as { userId: string };
        const profile = await profileService.getProfileByUserId(userId);

        const response: ApiResponse<typeof profile> = {
            success: true,
            data: profile,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getProfileById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const profile = await profileService.getProfileById(id);

        const response: ApiResponse<typeof profile> = {
            success: true,
            data: profile,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const createProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const payload = {
            ...req.body,
            user_id: req.body.user_id ?? req.user?.id,
        };

        const profile = await profileService.createProfile(payload);
        const response: ApiResponse<typeof profile> = {
            success: true,
            data: profile,
            message: 'User profile created successfully.',
        };

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params as { userId: string };
        const profile = await profileService.updateProfile(userId, req.body);

        const response: ApiResponse<typeof profile> = {
            success: true,
            data: profile,
            message: 'User profile updated successfully.',
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const deleteProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params as { userId: string };
        await profileService.deleteProfile(userId);

        const response: ApiResponse<null> = {
            success: true,
            message: 'User profile deleted successfully.',
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
