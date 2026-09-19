-- user_profile permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000105', 'user_profile:create', 'user_profile', 'Can create user_profile records'),
    ('50000000-0000-0000-0000-000000000106', 'user_profile:read', 'user_profile', 'Can view user_profile records'),
    ('50000000-0000-0000-0000-000000000107', 'user_profile:update', 'user_profile', 'Can update user_profile records'),
    ('50000000-0000-0000-0000-000000000108', 'user_profile:delete', 'user_profile', 'Can delete user_profile records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'user_profile'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'user_profile'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'user_profile:read'
ON CONFLICT DO NOTHING;
