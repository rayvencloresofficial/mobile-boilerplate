import { db } from '../config/database.js';
import type { Transaction } from 'kysely';
import type { Database } from '../types/database.js';

export interface UserProfileRecord {
    id: string;
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    date_of_birth: string | null;
    gender: string | null;
    nationality: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateProfileData {
    user_id: string;
    first_name?: string | null;
    last_name?: string | null;
    middle_name?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
}

export interface UpdateProfileData extends Partial<CreateProfileData> { }

export const findById = async (id: string): Promise<UserProfileRecord | null> => {
    return await db
        .selectFrom('user_profile')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst() ?? null;
};

export const findByUserId = async (userId: string): Promise<UserProfileRecord | null> => {
    return await db
        .selectFrom('user_profile')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst() ?? null;
};

export const findAll = async (): Promise<UserProfileRecord[]> => {
    return await db
        .selectFrom('user_profile')
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();
};

export const create = async (
    data: CreateProfileData,
    externalTrx?: Transaction<Database>
): Promise<UserProfileRecord> => {
    const runner = async (trx: Transaction<Database>) => {
        return await trx
            .insertInto('user_profile')
            .values({
                user_id: data.user_id,
                first_name: data.first_name ?? null,
                last_name: data.last_name ?? null,
                middle_name: data.middle_name ?? null,
                date_of_birth: data.date_of_birth ?? null,
                gender: data.gender ?? null,
                nationality: data.nationality ?? null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
    };

    return externalTrx ? await runner(externalTrx) : await db.transaction().execute(runner);
};

export const update = async (
    id: string,
    data: UpdateProfileData,
    externalTrx?: Transaction<Database>
): Promise<UserProfileRecord | null> => {
    const runner = async (trx: Transaction<Database>) => {
        const updates: Record<string, unknown> = {
            updated_at: new Date(),
        };

        if (data.user_id !== undefined) updates.user_id = data.user_id;
        if (data.first_name !== undefined) updates.first_name = data.first_name ?? null;
        if (data.last_name !== undefined) updates.last_name = data.last_name ?? null;
        if (data.middle_name !== undefined) updates.middle_name = data.middle_name ?? null;
        if (data.date_of_birth !== undefined) updates.date_of_birth = data.date_of_birth ?? null;
        if (data.gender !== undefined) updates.gender = data.gender ?? null;
        if (data.nationality !== undefined) updates.nationality = data.nationality ?? null;

        return await trx
            .updateTable('user_profile')
            .set(updates)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst() ?? null;
    };

    return externalTrx ? await runner(externalTrx) : await db.transaction().execute(runner);
};

export const deleteProfile = async (id: string): Promise<boolean> => {
    const result = await db
        .deleteFrom('user_profile')
        .where('id', '=', id)
        .executeTakeFirst();

    return Number(result.numDeletedRows) > 0;
};
