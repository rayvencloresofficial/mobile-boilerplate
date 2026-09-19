import bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError } from '../errors/AppError.js';
import * as userRepository from '../repositories/user.repository.js';
import type { UserSummary } from '../repositories/user.repository.js';

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const sanitizeUserSummary = (user: UserSummary): UserSummary => ({
  ...user,
});

export const listUsers = async (limit = 50, offset = 0): Promise<UserSummary[]> => {
  const users = await userRepository.findAll(limit, offset);
  return users.map(sanitizeUserSummary);
};

export const getUserById = async (id: string): Promise<UserSummary> => {
  const user = await userRepository.getUserWithRolesAndPermissions(id);
  if (!user) {
    throw new NotFoundError('User', id);
  }
  return sanitizeUserSummary({
    id: user.id,
    firebase_uid: user.firebase_uid,
    email: user.email,
    phone_number: user.phone_number,
    display_name: user.display_name,
    avatar_url: user.avatar_url ?? null,
    is_active: user.is_active,
    roles: user.roles,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

export const createUser = async (
  userData: {
    email: string;
    phone_number: string;
    password: string;
    display_name?: string | null;
    is_active?: boolean;
  },
  roleIds: string[] = []
): Promise<UserSummary> => {
  const existingEmail = await userRepository.findByEmail(userData.email);
  if (existingEmail) {
    throw new ConflictError(`User with email '${userData.email}' already exists.`);
  }

  const existingPhone = await userRepository.findByPhoneNumber(userData.phone_number);
  if (existingPhone) {
    throw new ConflictError(`User with phone number '${userData.phone_number}' already exists.`);
  }

  const passwordHash = await hashPassword(userData.password);

  const created = await userRepository.create(
    {
      email: userData.email,
      phone_number: userData.phone_number?.trim() || null,
      password_hash: passwordHash,
      display_name: userData.display_name,
      is_active: userData.is_active ?? true,
    },
    roleIds
  );

  return sanitizeUserSummary(created);
};

export const updateUser = async (
  id: string,
  userData: {
    email?: string;
    phone_number?: string;
    password?: string;
    display_name?: string | null;
    is_active?: boolean;
  },
  roleIds?: string[]
): Promise<UserSummary> => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw new NotFoundError('User', id);
  }

  if (userData.email && userData.email.toLowerCase() !== existing.email.toLowerCase()) {
    const emailConflict = await userRepository.findByEmail(userData.email);
    if (emailConflict && emailConflict.id !== id) {
      throw new ConflictError(`Email '${userData.email}' is already taken by another user.`);
    }
  }

  if (userData.phone_number && userData.phone_number.trim() !== existing.phone_number) {
    const phoneConflict = await userRepository.findByPhoneNumber(userData.phone_number.trim());
    if (phoneConflict && phoneConflict.id !== id) {
      throw new ConflictError(`Phone number '${userData.phone_number}' is already taken by another user.`);
    }
  }

  const updateData: userRepository.UpdateUserData = {
    email: userData.email,
    phone_number: userData.phone_number !== undefined ? (userData.phone_number?.trim() || null) : undefined,
    display_name: userData.display_name,
    is_active: userData.is_active,
  };

  if (userData.password) {
    updateData.password_hash = await hashPassword(userData.password);
  }

  const updated = await userRepository.update(id, updateData, roleIds);
  if (!updated) {
    throw new NotFoundError('User', id);
  }

  return sanitizeUserSummary(updated);
};

export const deleteUser = async (id: string): Promise<void> => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw new NotFoundError('User', id);
  }

  const deleted = await userRepository.deleteUser(id);
  if (!deleted) {
    throw new NotFoundError('User', id);
  }
};
