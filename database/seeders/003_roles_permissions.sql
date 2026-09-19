-- roles permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000109', 'roles:create', 'roles', 'Can create roles records'),
    ('50000000-0000-0000-0000-000000000110', 'roles:read', 'roles', 'Can view roles records'),
    ('50000000-0000-0000-0000-000000000111', 'roles:update', 'roles', 'Can update roles records'),
    ('50000000-0000-0000-0000-000000000112', 'roles:delete', 'roles', 'Can delete roles records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'roles'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'roles'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'roles:read'
ON CONFLICT DO NOTHING;
