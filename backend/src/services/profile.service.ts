import { ConflictError, NotFoundError } from '../errors/AppError.js';
import * as profileRepository from '../repositories/profile.repository.js';
import type { UserProfileRecord } from '../repositories/profile.repository.js';

export const getProfileByUserId = async (userId: string): Promise<UserProfileRecord> => {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
        throw new NotFoundError('User profile', userId);
    }
    return profile;
};

export const getProfileById = async (id: string): Promise<UserProfileRecord> => {
    const profile = await profileRepository.findById(id);
    if (!profile) {
        throw new NotFoundError('User profile', id);
    }
    return profile;
};

export const listProfiles = async (): Promise<UserProfileRecord[]> => {
    return await profileRepository.findAll();
};

export const createProfile = async (data: {
    user_id: string;
    first_name?: string | null;
    last_name?: string | null;
    middle_name?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
}): Promise<UserProfileRecord> => {
    const existing = await profileRepository.findByUserId(data.user_id);
    if (existing) {
        throw new ConflictError(`Profile already exists for user '${data.user_id}'.`);
    }

    return await profileRepository.create(data);
};

export const updateProfile = async (
    userId: string,
    data: {
        first_name?: string | null;
        last_name?: string | null;
        middle_name?: string | null;
        date_of_birth?: string | null;
        gender?: string | null;
        nationality?: string | null;
    }
): Promise<UserProfileRecord> => {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
        return await profileRepository.create({
            user_id: userId,
            ...data,
        });
    }

    const updated = await profileRepository.update(profile.id, data);
    if (!updated) {
        throw new NotFoundError('User profile', userId);
    }

    return updated;
};

export const deleteProfile = async (userId: string): Promise<void> => {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
        throw new NotFoundError('User profile', userId);
    }

    const deleted = await profileRepository.deleteProfile(profile.id);
    if (!deleted) {
        throw new NotFoundError('User profile', userId);
    }
};
