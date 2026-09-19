-- user_roles permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000117', 'user_roles:create', 'user_roles', 'Can create user_roles records'),
    ('50000000-0000-0000-0000-000000000118', 'user_roles:read', 'user_roles', 'Can view user_roles records'),
    ('50000000-0000-0000-0000-000000000119', 'user_roles:update', 'user_roles', 'Can update user_roles records'),
    ('50000000-0000-0000-0000-000000000120', 'user_roles:delete', 'user_roles', 'Can delete user_roles records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'user_roles'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'user_roles'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'user_roles:read'
ON CONFLICT DO NOTHING;
