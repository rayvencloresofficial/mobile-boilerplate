-- Core RBAC roles required by per-table permission seeder assignments
INSERT INTO roles (id, name, description, is_system) VALUES
    ('00000000-0000-0000-0000-000000000001', 'super_admin', 'Full unrestricted master access across all system resources', TRUE),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Administrative privileges for user and role management', TRUE),
    ('00000000-0000-0000-0000-000000000003', 'manager', 'Operational lead with read access to business data', TRUE),
    ('00000000-0000-0000-0000-000000000004', 'user', 'Standard user with base profile access', TRUE)
ON CONFLICT (id) DO NOTHING;
