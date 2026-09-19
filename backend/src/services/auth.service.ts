import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../errors/AppError.js';
import * as userRepository from '../repositories/user.repository.js';
import * as roleRepository from '../repositories/role.repository.js';
import * as tokenRepository from '../repositories/token.repository.js';
import type {
  AuthUser,
  DemoAccountItem,
  JwtPayload,
  RefreshTokenPayload,
  TokenPair,
} from '../types/auth.js';

const SALT_ROUNDS = 10;
const REGULAR_USER_ROLE = 'user';

const sanitizeUser = (user: AuthUser): AuthUser => ({
  ...user,
});

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateTokenPair = async (user: AuthUser): Promise<TokenPair> => {
  const accessPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.roles,
  };

  const accessToken = jwt.sign(accessPayload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await tokenRepository.createRefreshToken(user.id, tokenHash, expiresAt);

  const refreshPayload: RefreshTokenPayload = {
    userId: user.id,
    tokenId: rawRefreshToken,
  };

  const refreshToken = jwt.sign(refreshPayload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  if (!user.is_active) {
    throw new UnauthorizedError('This account has been deactivated. Please contact support.');
  }

  if (!user.password_hash) {
    throw new UnauthorizedError('This account uses Firebase authentication and cannot sign in with a system password.');
  }

  const isMatch = await verifyPassword(password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  const fullUser = await userRepository.getUserWithRolesAndPermissions(user.id);
  if (!fullUser) {
    throw new NotFoundError('User profile details not found.');
  }

  const sanitized = sanitizeUser(fullUser);
  const tokens = await generateTokenPair(sanitized);
  return { user: sanitized, tokens };
};

export const register = async (userData: {
  email: string;
  password: string;
  display_name: string;
}): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  const existing = await userRepository.findByEmail(userData.email);
  if (existing) {
    throw new ConflictError('A user account with this email address already exists.');
  }

  // Find the default 'user' role for self-registration
  const defaultRole = await roleRepository.findByName(REGULAR_USER_ROLE);
  const roleIds = defaultRole ? [defaultRole.id] : [];

  const passwordHash = await hashPassword(userData.password);

  const createdUser = await userRepository.create(
    {
      email: userData.email,
      password_hash: passwordHash,
      display_name: userData.display_name,
      is_active: true,
    },
    roleIds
  );

  const fullUser = await userRepository.getUserWithRolesAndPermissions(createdUser.id);
  if (!fullUser) {
    throw new NotFoundError('User created but failed to hydrate.');
  }

  const sanitized = sanitizeUser(fullUser);
  const tokens = await generateTokenPair(sanitized);
  return { user: sanitized, tokens };
};

export const syncFirebaseUser = async (userData: {
  firebase_uid?: string | null;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
}): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  const firebaseUid = userData.firebase_uid ?? null;
  const email = userData.email.trim().toLowerCase();

  if (!email) {
    throw new ConflictError('Email is required to sync a Firebase account.');
  }

  const existingByEmail = await userRepository.findByEmail(email);
  const existingByFirebase = firebaseUid ? await userRepository.getUserWithRolesAndPermissionsByFirebaseUid(firebaseUid) : null;

  const targetUser = existingByFirebase ?? existingByEmail;

  if (targetUser) {
    await userRepository.update(
      targetUser.id,
      {
        firebase_uid: firebaseUid ?? targetUser.firebase_uid,
        email,
        display_name: userData.display_name ?? targetUser.display_name,
        avatar_url: userData.avatar_url ?? targetUser.avatar_url ?? null,
        is_active: true,
      }
    );

    const refreshedUser = await userRepository.getUserWithRolesAndPermissions(targetUser.id);
    if (!refreshedUser) {
      throw new NotFoundError('Synced user profile could not be loaded.');
    }

    const sanitized = sanitizeUser(refreshedUser);
    const tokens = await generateTokenPair(sanitized);
    return { user: sanitized, tokens };
  }

  const defaultRole = await roleRepository.findByName(REGULAR_USER_ROLE);
  const roleIds = defaultRole ? [defaultRole.id] : [];

  const createdUser = await userRepository.create(
    {
      firebase_uid: firebaseUid,
      email,
      display_name: userData.display_name ?? null,
      avatar_url: userData.avatar_url ?? null,
      is_active: true,
    },
    roleIds
  );

  const hydrated = await userRepository.getUserWithRolesAndPermissions(createdUser.id);
  if (!hydrated) {
    throw new NotFoundError('Firebase user created but failed to hydrate.');
  }

  const sanitized = sanitizeUser(hydrated);
  const tokens = await generateTokenPair(sanitized);
  return { user: sanitized, tokens };
};

export const refresh = async (refreshTokenStr: string): Promise<TokenPair> => {
  let decoded: RefreshTokenPayload;
  try {
    decoded = jwt.verify(refreshTokenStr, ENV.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError('Refresh token is invalid or has expired.');
  }

  const tokenHash = hashToken(decoded.tokenId);
  const storedToken = await tokenRepository.findByTokenHash(tokenHash);

  if (!storedToken || storedToken.revoked_at || new Date(storedToken.expires_at) < new Date()) {
    throw new UnauthorizedError('Refresh token is revoked or expired.');
  }

  // Revoke old refresh token for rotation
  await tokenRepository.revokeToken(storedToken.id);

  const user = await userRepository.getUserWithRolesAndPermissions(decoded.userId);
  if (!user || !user.is_active) {
    throw new UnauthorizedError('User account is invalid or deactivated.');
  }

  return await generateTokenPair(user);
};

export const logout = async (refreshTokenStr?: string): Promise<void> => {
  if (!refreshTokenStr) return;
  try {
    const decoded = jwt.verify(refreshTokenStr, ENV.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    const tokenHash = hashToken(decoded.tokenId);
    const storedToken = await tokenRepository.findByTokenHash(tokenHash);
    if (storedToken) {
      await tokenRepository.revokeToken(storedToken.id);
    }
  } catch {
    // Silent fail on invalid logout tokens
  }
};

export const verifyToken = async (token: string): Promise<AuthUser> => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Token is invalid or expired.');
  }

  const user = await userRepository.getUserWithRolesAndPermissions(decoded.userId);
  if (!user || !user.is_active) {
    throw new UnauthorizedError('User account is invalid or deactivated.');
  }

  return sanitizeUser(user);
};

const getRoleColor = (role?: string): string => {
  switch (role) {
    case 'super_admin':
      return 'danger';
    case 'admin':
      return 'primary';
    case 'manager':
      return 'warning';
    case 'user':
      return 'neutral';
    default:
      return 'success';
  }
};

const getRoleTitle = (roles: string[], displayName: string | null): string => {
  if (roles.includes('super_admin')) return 'Super Admin';
  if (roles.includes('admin')) return 'Administrator';
  if (roles.includes('manager')) return 'Manager';
  if (roles.includes('user')) return 'Standard User';
  if (roles.length > 0 && roles[0]) {
    const primary = roles[0];
    return primary
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return displayName || 'Staff User';
};

/**
 * Retrieves all demo accounts seeded in the database.
 * Returns super_admin, admin, manager, user, and any custom personas.
 */
export const getDemoAccounts = async (): Promise<DemoAccountItem[]> => {
  const users = await userRepository.getAllUsersWithRolesAndPermissions();

  return users.map((u) => ({
    id: u.id,
    firebase_uid: u.firebase_uid,
    email: u.email,
    display_name: u.display_name,
    is_active: u.is_active,
    roles: u.roles,
    permissions: u.permissions,
    title: getRoleTitle(u.roles, u.display_name),
    color: getRoleColor(u.roles[0]),
  }));
};

/**
 * Quick developer persona login.
 * Supports role name ('super_admin', 'admin', 'manager', 'user'), email, or user ID.
 */
export const demoLogin = async (
  identifier: string
): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  let userId: string | null = null;
  let isActive = true;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  const byEmail = await userRepository.findByEmail(identifier);
  if (byEmail) {
    userId = byEmail.id;
    isActive = byEmail.is_active;
  } else if (isUuid) {
    const byId = await userRepository.findById(identifier);
    if (byId) {
      userId = byId.id;
      isActive = byId.is_active;
    }
  }

  if (!userId) {
    const all = await userRepository.getAllUsersWithRolesAndPermissions();
    const match = all.find((u) => u.roles.includes(identifier));
    if (match) {
      userId = match.id;
      isActive = match.is_active;
    }
  }


  if (!userId) {
    throw new NotFoundError(`User account matching '${identifier}' not found.`);
  }

  if (!isActive) {
    throw new UnauthorizedError('User account has been deactivated.');
  }

  const fullUser = await userRepository.getUserWithRolesAndPermissions(userId);
  if (!fullUser) {
    throw new NotFoundError('User profile details not found.');
  }

  const sanitized = sanitizeUser(fullUser);
  const tokens = await generateTokenPair(sanitized);
  return { user: sanitized, tokens };
};

export const updateProfile = async (
  userId: string,
  data: {
    phone_number?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    middle_name?: string | null;
    gender?: string | null;
    nationality?: string | null;
    date_of_birth?: string | null;
  }
): Promise<AuthUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const updateData: userRepository.UpdateUserData = {};
  if (data.phone_number !== undefined) {
    updateData.phone_number = data.phone_number && data.phone_number.trim() ? data.phone_number.trim() : null;
  }
  if (data.display_name !== undefined) {
    updateData.display_name = data.display_name ? data.display_name.trim() : null;
  }
  if (data.avatar_url !== undefined) {
    updateData.avatar_url = data.avatar_url ? data.avatar_url.trim() : null;
  }
  if (data.first_name !== undefined) {
    updateData.first_name = data.first_name ? data.first_name.trim() : null;
  }
  if (data.last_name !== undefined) {
    updateData.last_name = data.last_name ? data.last_name.trim() : null;
  }
  if (data.middle_name !== undefined) {
    updateData.middle_name = data.middle_name ? data.middle_name.trim() : null;
  }
  if (data.gender !== undefined) {
    updateData.gender = data.gender ? data.gender.trim() : null;
  }
  if (data.nationality !== undefined) {
    updateData.nationality = data.nationality ? data.nationality.trim() : null;
  }
  if (data.date_of_birth !== undefined) {
    updateData.date_of_birth = data.date_of_birth ? data.date_of_birth.trim() : null;
  }

  await userRepository.update(userId, updateData);

  const fullUser = await userRepository.getUserWithRolesAndPermissions(userId);
  if (!fullUser) {
    throw new NotFoundError('User profile details not found.');
  }

  return sanitizeUser(fullUser);
};

export const changePassword = async (
  userId: string,
  currentPass: string | undefined | null,
  newPass: string
): Promise<void> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User account not found.');
  }

  const userWithPass = await userRepository.findByEmail(user.email);
  if (!userWithPass) {
    throw new NotFoundError('User account not found.');
  }

  // If user already has a password set, current password must match
  if (userWithPass.password_hash) {
    if (!currentPass) {
      throw new UnauthorizedError('Current password is required to change password.');
    }
    const isMatch = await verifyPassword(currentPass, userWithPass.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect.');
    }
  }

  const newHash = await hashPassword(newPass);
  await userRepository.update(userId, { password_hash: newHash });
};

export const deleteAccount = async (userId: string): Promise<void> => {
  const existing = await userRepository.findById(userId);
  if (!existing) {
    throw new NotFoundError('User account not found.');
  }

  // Revoke any tokens
  await tokenRepository.revokeAllUserTokens(userId);

  // Delete user record (cascades to profile, user_roles, refresh_tokens)
  const deleted = await userRepository.deleteUser(userId);
  if (!deleted) {
    throw new NotFoundError('Failed to delete user account.');
  }
};
