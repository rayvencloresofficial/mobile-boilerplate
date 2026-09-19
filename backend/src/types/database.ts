import type { ColumnType, Generated } from 'kysely';

export interface UserTable {
  id: Generated<string>;
  firebase_uid: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  display_name: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  avatar_url: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  email: string;
  email_hash: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  phone_number: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  phone_number_hash: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  password_hash: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  is_active: Generated<boolean>;
  is_online: Generated<boolean>;
  last_login: ColumnType<Date | null, string | Date | null | undefined, string | Date | null | undefined>;
  last_active_at: ColumnType<Date | null, string | Date | null | undefined, string | Date | null | undefined>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | Date>;
}

export interface UserProfileTable {
  id: Generated<string>;
  user_id: string;
  first_name: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  last_name: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  middle_name: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  date_of_birth: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  gender: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  nationality: ColumnType<string | null, string | null | undefined, string | null | undefined>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | Date>;
}

export interface RoleTable {
  id: Generated<string>;
  name: string;
  description: string | null;
  is_system: Generated<boolean>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | Date>;
}

export interface PermissionTable {
  id: Generated<string>;
  slug: string;
  module: string;
  description: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface UserRoleTable {
  user_id: string;
  role_id: string;
  assigned_at: ColumnType<Date, string | undefined, never>;
}

export interface RolePermissionTable {
  role_id: string;
  permission_id: string;
  assigned_at: ColumnType<Date, string | undefined, never>;
}

export interface SettingTable {
  id: Generated<string>;
  key: string;
  value: unknown;
  category: Generated<string>;
  description: string | null;
  is_public: Generated<boolean>;
  is_encrypted: Generated<boolean>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | Date>;
}

export interface RefreshTokenTable {
  id: Generated<string>;
  user_id: string;
  token_hash: string;
  expires_at: ColumnType<Date, string | Date, never>;
  revoked_at: ColumnType<Date | null, string | Date | null, string | Date | null>;
  created_at: ColumnType<Date, string | undefined, never>;
}


export interface Database {
  users: UserTable;
  user_profile: UserProfileTable;
  roles: RoleTable;
  permissions: PermissionTable;
  user_roles: UserRoleTable;
  role_permissions: RolePermissionTable;
  settings: SettingTable;
  refresh_tokens: RefreshTokenTable;
}
