-- role permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000121', 'role:create', 'role', 'Can create role records'),
    ('50000000-0000-0000-0000-000000000122', 'role:read', 'role', 'Can view role records'),
    ('50000000-0000-0000-0000-000000000123', 'role:update', 'role', 'Can update role records'),
    ('50000000-0000-0000-0000-000000000124', 'role:delete', 'role', 'Can delete role records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'role'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'role'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'role:read'
ON CONFLICT DO NOTHING;
