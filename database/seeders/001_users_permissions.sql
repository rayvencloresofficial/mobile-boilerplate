-- users permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000101', 'users:create', 'users', 'Can create users records'),
    ('50000000-0000-0000-0000-000000000102', 'users:read', 'users', 'Can view users records'),
    ('50000000-0000-0000-0000-000000000103', 'users:update', 'users', 'Can update users records'),
    ('50000000-0000-0000-0000-000000000104', 'users:delete', 'users', 'Can delete users records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'users'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'users'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'users:read'
ON CONFLICT DO NOTHING;
