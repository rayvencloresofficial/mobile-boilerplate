/**
 * RBAC Test Pad Endpoints Definition
 *
 * Configured directly against available backend authentication, role,
 * and permission enforcement routes.
 *
 * NOTE: Icons are deliberately omitted per UI specification.
 */

export interface TestEndpointConfig {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  requiredGuard: string;
  guardType: "role" | "permission";
  category: string;
  description: string;
}

export const TEST_ENDPOINTS: TestEndpointConfig[] = [
  // System & Role Boundaries
  {
    id: "super_admin",
    name: "Root Server Maintenance",
    endpoint: "/test-rbac/super-admin",
    method: "GET",
    requiredGuard: "super_admin",
    guardType: "role",
    category: "System Core",
    description: "Restricted strictly to super_admin master accounts.",
  },
  {
    id: "admin_area",
    name: "Admin Central Console",
    endpoint: "/test-rbac/admin-area",
    method: "GET",
    requiredGuard: "admin",
    guardType: "role",
    category: "System Core",
    description: "Administrative console access (admin or super_admin).",
  },

  // Users Module
  {
    id: "users_read",
    name: "Inspect User Directory",
    endpoint: "/test-rbac/users-read",
    method: "GET",
    requiredGuard: "users:read",
    guardType: "permission",
    category: "Users Module",
    description: "Inspect user list and profiles in database.",
  },
  {
    id: "user_create",
    name: "Provision User Account",
    endpoint: "/test-rbac/user-create",
    method: "POST",
    requiredGuard: "users:create",
    guardType: "permission",
    category: "Users Module",
    description: "Register and onboard new user accounts.",
  },
  {
    id: "users_update",
    name: "Modify User Records",
    endpoint: "/test-rbac/users-update",
    method: "PUT",
    requiredGuard: "users:update",
    guardType: "permission",
    category: "Users Module",
    description: "Modify user profile, active state, and role assignments.",
  },
  {
    id: "user_delete",
    name: "Purge User Account",
    endpoint: "/test-rbac/user-delete",
    method: "DELETE",
    requiredGuard: "users:delete",
    guardType: "permission",
    category: "Users Module",
    description: "Permanently purge user records from database.",
  },

  // Roles & Access Control Module
  {
    id: "roles_read",
    name: "Inspect Access Matrix",
    endpoint: "/test-rbac/roles-read",
    method: "GET",
    requiredGuard: "roles:read",
    guardType: "permission",
    category: "Roles Module",
    description: "View existing system roles and their permission mappings.",
  },
  {
    id: "roles_manage",
    name: "Update Role Permissions",
    endpoint: "/test-rbac/roles-manage",
    method: "POST",
    requiredGuard: "roles:manage",
    guardType: "permission",
    category: "Roles Module",
    description: "Create, adjust, or mutate role permission boundaries.",
  },

  // Analytics & Telemetry Module
  {
    id: "analytics_read",
    name: "Audit Telemetry & Metrics",
    endpoint: "/test-rbac/analytics-read",
    method: "GET",
    requiredGuard: "analytics:read",
    guardType: "permission",
    category: "Analytics Module",
    description: "Stream business telemetry, audit logs, and performance metrics.",
  },

  // System Settings Module
  {
    id: "settings_read",
    name: "Read Global Configuration",
    endpoint: "/test-rbac/settings-read",
    method: "GET",
    requiredGuard: "settings:read",
    guardType: "permission",
    category: "Settings Module",
    description: "Read application runtime configurations and preferences.",
  },
  {
    id: "settings_manage",
    name: "Mutate Security Config",
    endpoint: "/test-rbac/settings-manage",
    method: "PUT",
    requiredGuard: "settings:manage",
    guardType: "permission",
    category: "Settings Module",
    description: "Mutate security thresholds, lockout rules, and system flags.",
  },
];

export default TEST_ENDPOINTS;
