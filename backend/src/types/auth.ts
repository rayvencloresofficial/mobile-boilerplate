import type { Request } from 'express';

export interface AuthUser {
  id: string;
  firebase_uid: string | null;
  email: string;
  phone_number?: string | null;
  display_name: string | null;
  avatar_url?: string | null;
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
  permissions: string[];
  has_custom_role?: boolean;
  has_password?: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
}

export interface DemoAccountItem {
  id: string;
  firebase_uid: string | null;
  email: string;
  phone_number?: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  is_online?: boolean;
  last_login?: Date | string | null;
  last_active_at?: Date | string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  roles: string[];
  permissions: string[];
  title: string;
  color: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
