import { sql, type Transaction } from 'kysely';
import { db } from '../config/database.js';
import type { Database } from '../types/database.js';
import type { AuthUser } from '../types/auth.js';
import {
  encrypt,
  decrypt,
  decryptOptional,
  encryptOptional,
  hashDeterministic,
} from '../utils/crypto.util.js';

export interface CreateUserData {
  firebase_uid?: string | null;
  email: string;
  phone_number?: string | null;
  password_hash?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  is_active?: boolean;
  is_online?: boolean;
  last_login?: Date | string | null;
  last_active_at?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
}

export interface UpdateUserData {
  firebase_uid?: string | null;
  email?: string;
  phone_number?: string | null;
  password_hash?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  is_active?: boolean;
  is_online?: boolean;
  last_login?: Date | string | null;
  last_active_at?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
}

export interface UserSummary {
  id: string;
  firebase_uid: string | null;
  email: string;
  phone_number?: string | null;
  display_name: string | null;
  avatar_url: string | null;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  is_active: boolean;
  is_online?: boolean;
  last_login?: Date | string | null;
  last_active_at?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  roles: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Retrieves a user by ID along with their aggregated roles and distinct permissions.
 */
export const getUserWithRolesAndPermissions = async (userId: string): Promise<AuthUser | null> => {
  const result = await db
    .selectFrom('users')
    .leftJoin('user_profile', 'user_profile.user_id', 'users.id')
    .leftJoin('user_roles', 'user_roles.user_id', 'users.id')
    .leftJoin('roles', 'roles.id', 'user_roles.role_id')
    .leftJoin('role_permissions', 'role_permissions.role_id', 'roles.id')
    .leftJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
    .where('users.id', '=', userId)
    .groupBy([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.password_hash',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
    ])
    .select([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      sql<boolean>`COALESCE(users.password_hash IS NOT NULL, FALSE)`.as('has_password'),
      sql<string[]>`COALESCE(array_agg(DISTINCT roles.name) FILTER (WHERE roles.name IS NOT NULL), '{}')`.as('roles'),
      sql<string[]>`COALESCE(array_agg(DISTINCT permissions.slug) FILTER (WHERE permissions.slug IS NOT NULL), '{}')`.as('permissions'),
      sql<boolean>`COALESCE(bool_or(roles.is_system = FALSE), FALSE)`.as('has_custom_role'),
    ])
    .executeTakeFirst();

  if (!result) return null;

  return {
    id: result.id,
    firebase_uid: result.firebase_uid,
    email: decrypt(result.email),
    phone_number: decryptOptional(result.phone_number),
    display_name: decryptOptional(result.display_name),
    avatar_url: result.avatar_url,
    first_name: decryptOptional(result.first_name),
    last_name: decryptOptional(result.last_name),
    middle_name: decryptOptional(result.middle_name),
    is_active: result.is_active,
    is_online: result.is_online,
    last_login: result.last_login,
    last_active_at: result.last_active_at,
    gender: decryptOptional(result.gender),
    nationality: decryptOptional(result.nationality),
    date_of_birth: decryptOptional(result.date_of_birth),
    roles: result.roles || [],
    permissions: result.permissions || [],
    has_custom_role: Boolean(result.has_custom_role),
    has_password: Boolean(result.has_password),
  };
};

/** Resolves a Firebase-authenticated principal to its local RBAC account. */
export const getUserWithRolesAndPermissionsByFirebaseUid = async (
  firebaseUid: string
): Promise<AuthUser | null> => {
  const user = await db
    .selectFrom('users')
    .select('id')
    .where('firebase_uid', '=', firebaseUid)
    .executeTakeFirst();

  return user ? await getUserWithRolesAndPermissions(user.id) : null;
};

/**
 * Retrieves all active users along with their aggregated roles and distinct permissions.
 */
export const getAllUsersWithRolesAndPermissions = async (): Promise<AuthUser[]> => {
  const rows = await db
    .selectFrom('users')
    .leftJoin('user_profile', 'user_profile.user_id', 'users.id')
    .leftJoin('user_roles', 'user_roles.user_id', 'users.id')
    .leftJoin('roles', 'roles.id', 'user_roles.role_id')
    .leftJoin('role_permissions', 'role_permissions.role_id', 'roles.id')
    .leftJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
    .where('users.is_active', '=', true)
    .groupBy([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.password_hash',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      'users.created_at',
    ])
    .select([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      sql<boolean>`COALESCE(users.password_hash IS NOT NULL, FALSE)`.as('has_password'),
      sql<string[]>`COALESCE(array_agg(DISTINCT roles.name) FILTER (WHERE roles.name IS NOT NULL), '{}')`.as('roles'),
      sql<string[]>`COALESCE(array_agg(DISTINCT permissions.slug) FILTER (WHERE permissions.slug IS NOT NULL), '{}')`.as('permissions'),
      sql<boolean>`COALESCE(bool_or(roles.is_system = FALSE), FALSE)`.as('has_custom_role'),
    ])
    .orderBy('users.created_at', 'asc')
    .execute();

  return rows.map((r) => ({
    id: r.id,
    firebase_uid: r.firebase_uid,
    email: decrypt(r.email),
    phone_number: decryptOptional(r.phone_number),
    display_name: decryptOptional(r.display_name),
    avatar_url: r.avatar_url,
    first_name: decryptOptional(r.first_name),
    last_name: decryptOptional(r.last_name),
    middle_name: decryptOptional(r.middle_name),
    is_active: r.is_active,
    is_online: r.is_online,
    last_login: r.last_login,
    last_active_at: r.last_active_at,
    gender: decryptOptional(r.gender),
    nationality: decryptOptional(r.nationality),
    date_of_birth: decryptOptional(r.date_of_birth),
    roles: r.roles || [],
    permissions: r.permissions || [],
    has_custom_role: Boolean(r.has_custom_role),
    has_password: Boolean(r.has_password),
  }));
};

/**
 * Finds user by email (case-insensitive) including password for authentication.
 */
export const findByEmail = async (email: string) => {
  const cleanEmail = email.toLowerCase().trim();
  const hash = hashDeterministic(cleanEmail);

  const row = await db
    .selectFrom('users')
    .selectAll()
    .where((eb) =>
      eb.or([
        eb('email_hash', '=', hash),
        eb(sql`LOWER(email)`, '=', cleanEmail),
      ])
    )
    .executeTakeFirst();

  if (!row) return undefined;

  return {
    ...row,
    email: decryptOptional(row.email) || row.email,
    phone_number: decryptOptional(row.phone_number),
    display_name: decryptOptional(row.display_name),
    password_hash: decryptOptional(row.password_hash),
  };
};

export const findByPhoneNumber = async (phoneNumber: string) => {
  const cleanPhone = phoneNumber.trim();
  const hash = hashDeterministic(cleanPhone);

  const row = await db
    .selectFrom('users')
    .selectAll()
    .where((eb) =>
      eb.or([
        eb('phone_number_hash', '=', hash),
        eb('phone_number', '=', cleanPhone),
      ])
    )
    .executeTakeFirst();

  if (!row) return undefined;

  return {
    ...row,
    email: decryptOptional(row.email) || row.email,
    phone_number: decryptOptional(row.phone_number),
    display_name: decryptOptional(row.display_name),
    password_hash: decryptOptional(row.password_hash),
  };
};

/**
 * Finds user by ID without password hash.
 */
export const findById = async (id: string) => {
  const row = await db
    .selectFrom('users')
    .leftJoin('user_profile', 'user_profile.user_id', 'users.id')
    .select([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      'users.created_at',
      'users.updated_at',
    ])
    .where('users.id', '=', id)
    .executeTakeFirst();

  if (!row) return undefined;

  return {
    ...row,
    email: decrypt(row.email),
    phone_number: decryptOptional(row.phone_number),
    display_name: decryptOptional(row.display_name),
    first_name: decryptOptional(row.first_name),
    last_name: decryptOptional(row.last_name),
    middle_name: decryptOptional(row.middle_name),
    gender: decryptOptional(row.gender),
    nationality: decryptOptional(row.nationality),
    date_of_birth: decryptOptional(row.date_of_birth),
  };
};

/**
 * Lists all users with their assigned roles.
 */
export const findAll = async (limit = 50, offset = 0): Promise<UserSummary[]> => {
  const rows = await db
    .selectFrom('users')
    .leftJoin('user_profile', 'user_profile.user_id', 'users.id')
    .leftJoin('user_roles', 'user_roles.user_id', 'users.id')
    .leftJoin('roles', 'roles.id', 'user_roles.role_id')
    .groupBy([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      'users.created_at',
      'users.updated_at',
    ])
    .select([
      'users.id',
      'users.firebase_uid',
      'users.email',
      'users.phone_number',
      'users.display_name',
      'users.avatar_url',
      'users.is_active',
      'users.is_online',
      'users.last_login',
      'users.last_active_at',
      'user_profile.first_name',
      'user_profile.last_name',
      'user_profile.middle_name',
      'user_profile.gender',
      'user_profile.nationality',
      'user_profile.date_of_birth',
      'users.created_at',
      'users.updated_at',
      sql<string[]>`COALESCE(array_agg(DISTINCT roles.name) FILTER (WHERE roles.name IS NOT NULL), '{}')`.as('roles'),
    ])
    .orderBy('users.created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .execute();

  return rows.map((row) => ({
    ...row,
    email: decrypt(row.email),
    phone_number: decryptOptional(row.phone_number),
    display_name: decryptOptional(row.display_name),
    first_name: decryptOptional(row.first_name),
    last_name: decryptOptional(row.last_name),
    middle_name: decryptOptional(row.middle_name),
    gender: decryptOptional(row.gender),
    nationality: decryptOptional(row.nationality),
    date_of_birth: decryptOptional(row.date_of_birth),
    roles: row.roles || [],
  }));
};

/**
 * Creates a new user and assigns roles in a transaction.
 */
export const create = async (
  userData: CreateUserData,
  roleIds: string[] = [],
  externalTrx?: Transaction<Database>
): Promise<UserSummary> => {
  const runner = async (trx: Transaction<Database>) => {
    const rawEmail = userData.email.toLowerCase().trim();
    const rawPhone = userData.phone_number ? userData.phone_number.trim() : null;

    const insertedUser = await trx
      .insertInto('users')
      .values({
        firebase_uid: userData.firebase_uid ?? null,
        email: encrypt(rawEmail),
        email_hash: hashDeterministic(rawEmail),
        phone_number: encryptOptional(rawPhone),
        phone_number_hash: hashDeterministic(rawPhone),
        password_hash: encryptOptional(userData.password_hash),
        display_name: encryptOptional(userData.display_name?.trim()),
        avatar_url: userData.avatar_url ?? null,
        is_active: userData.is_active ?? true,
        is_online: userData.is_online ?? false,
        last_login: userData.last_login ?? null,
        last_active_at: userData.last_active_at ?? new Date(),
      })
      .returning(['id', 'firebase_uid', 'email', 'phone_number', 'display_name', 'avatar_url', 'is_active', 'is_online', 'last_login', 'last_active_at', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    const profileValues: Record<string, unknown> = {};
    if (userData.first_name !== undefined) profileValues.first_name = encryptOptional(userData.first_name?.trim());
    if (userData.last_name !== undefined) profileValues.last_name = encryptOptional(userData.last_name?.trim());
    if (userData.middle_name !== undefined) profileValues.middle_name = encryptOptional(userData.middle_name?.trim());
    if (userData.gender !== undefined) profileValues.gender = encryptOptional(userData.gender?.trim());
    if (userData.nationality !== undefined) profileValues.nationality = encryptOptional(userData.nationality?.trim());
    if (userData.date_of_birth !== undefined) profileValues.date_of_birth = encryptOptional(userData.date_of_birth?.trim());

    if (Object.keys(profileValues).length > 0) {
      await trx
        .insertInto('user_profile')
        .values({
          user_id: insertedUser.id,
          ...profileValues,
        })
        .execute();
    }

    if (roleIds.length > 0) {
      const userRolesValues = roleIds.map((roleId) => ({
        user_id: insertedUser.id,
        role_id: roleId,
      }));
      await trx.insertInto('user_roles').values(userRolesValues).execute();
    }

    const assignedRoles = roleIds.length > 0
      ? await trx
        .selectFrom('roles')
        .select('name')
        .where('id', 'in', roleIds)
        .execute()
      : [];

    return {
      ...insertedUser,
      email: rawEmail,
      phone_number: rawPhone,
      display_name: userData.display_name?.trim() ?? null,
      first_name: userData.first_name?.trim() ?? null,
      last_name: userData.last_name?.trim() ?? null,
      middle_name: userData.middle_name?.trim() ?? null,
      gender: userData.gender?.trim() ?? null,
      nationality: userData.nationality?.trim() ?? null,
      date_of_birth: userData.date_of_birth?.trim() ?? null,
      roles: assignedRoles.map((r) => r.name),
    };
  };

  return externalTrx ? await runner(externalTrx) : await db.transaction().execute(runner);
};

/**
 * Updates a user and optionally reassigns their roles within an atomic transaction.
 */
export const update = async (
  id: string,
  userData: UpdateUserData,
  roleIds?: string[],
  externalTrx?: Transaction<Database>
): Promise<UserSummary | null> => {
  const runner = async (trx: Transaction<Database>) => {
    const updateValues: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (userData.email !== undefined) {
      const rawEmail = userData.email.toLowerCase().trim();
      updateValues['email'] = encrypt(rawEmail);
      updateValues['email_hash'] = hashDeterministic(rawEmail);
    }
    if (userData.phone_number !== undefined) {
      const rawPhone = userData.phone_number ? userData.phone_number.trim() : null;
      updateValues['phone_number'] = encryptOptional(rawPhone);
      updateValues['phone_number_hash'] = hashDeterministic(rawPhone);
    }
    if (userData.firebase_uid !== undefined) updateValues['firebase_uid'] = userData.firebase_uid;
    if (userData.password_hash !== undefined) updateValues['password_hash'] = encryptOptional(userData.password_hash);
    if (userData.display_name !== undefined) updateValues['display_name'] = encryptOptional(userData.display_name?.trim());
    if (userData.avatar_url !== undefined) updateValues['avatar_url'] = userData.avatar_url ?? null;
    if (userData.is_active !== undefined) updateValues['is_active'] = userData.is_active;
    if (userData.is_online !== undefined) updateValues['is_online'] = userData.is_online;
    if (userData.last_login !== undefined) updateValues['last_login'] = userData.last_login ?? null;
    if (userData.last_active_at !== undefined) updateValues['last_active_at'] = userData.last_active_at ?? null;

    const updatedUser = await trx
      .updateTable('users')
      .set(updateValues)
      .where('id', '=', id)
      .returning(['id', 'firebase_uid', 'email', 'phone_number', 'display_name', 'avatar_url', 'is_active', 'is_online', 'last_login', 'last_active_at', 'created_at', 'updated_at'])
      .executeTakeFirst();

    if (!updatedUser) return null;

    const profileValues: Record<string, unknown> = {};
    if (userData.first_name !== undefined) profileValues.first_name = encryptOptional(userData.first_name?.trim());
    if (userData.last_name !== undefined) profileValues.last_name = encryptOptional(userData.last_name?.trim());
    if (userData.middle_name !== undefined) profileValues.middle_name = encryptOptional(userData.middle_name?.trim());
    if (userData.gender !== undefined) profileValues.gender = encryptOptional(userData.gender?.trim());
    if (userData.nationality !== undefined) profileValues.nationality = encryptOptional(userData.nationality?.trim());
    if (userData.date_of_birth !== undefined) profileValues.date_of_birth = encryptOptional(userData.date_of_birth?.trim());

    if (Object.keys(profileValues).length > 0) {
      const profile = await trx
        .selectFrom('user_profile')
        .select('id')
        .where('user_id', '=', id)
        .executeTakeFirst();

      if (profile) {
        await trx
          .updateTable('user_profile')
          .set({
            ...profileValues,
            updated_at: new Date(),
          })
          .where('user_id', '=', id)
          .execute();
      } else {
        await trx
          .insertInto('user_profile')
          .values({
            user_id: id,
            ...profileValues,
          })
          .execute();
      }
    }

    if (roleIds !== undefined) {
      await trx.deleteFrom('user_roles').where('user_id', '=', id).execute();

      if (roleIds.length > 0) {
        const userRolesValues = roleIds.map((roleId) => ({
          user_id: id,
          role_id: roleId,
        }));
        await trx.insertInto('user_roles').values(userRolesValues).execute();
      }
    }

    const rolesResult = await trx
      .selectFrom('user_roles')
      .innerJoin('roles', 'roles.id', 'user_roles.role_id')
      .select('roles.name')
      .where('user_roles.user_id', '=', id)
      .execute();

    const profileResult = await trx
      .selectFrom('user_profile')
      .select(['first_name', 'last_name', 'middle_name', 'gender', 'nationality', 'date_of_birth'])
      .where('user_id', '=', id)
      .executeTakeFirst();

    return {
      ...updatedUser,
      email: decrypt(updatedUser.email),
      phone_number: decryptOptional(updatedUser.phone_number),
      display_name: decryptOptional(updatedUser.display_name),
      first_name: decryptOptional(profileResult?.first_name),
      last_name: decryptOptional(profileResult?.last_name),
      middle_name: decryptOptional(profileResult?.middle_name),
      gender: decryptOptional(profileResult?.gender),
      nationality: decryptOptional(profileResult?.nationality),
      date_of_birth: decryptOptional(profileResult?.date_of_birth),
      roles: rolesResult.map((r) => r.name),
    };
  };

  return externalTrx ? await runner(externalTrx) : await db.transaction().execute(runner);
};

/**
 * Deletes a user by ID (cascades to user_roles and refresh_tokens).
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await db.deleteFrom('users').where('id', '=', id).executeTakeFirst();
  return Number(result.numDeletedRows) > 0;
};
