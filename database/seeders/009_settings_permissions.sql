-- settings permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000129', 'settings:create', 'settings', 'Can create settings records'),
    ('50000000-0000-0000-0000-000000000130', 'settings:read', 'settings', 'Can view settings records'),
    ('50000000-0000-0000-0000-000000000131', 'settings:update', 'settings', 'Can update settings records'),
    ('50000000-0000-0000-0000-000000000132', 'settings:delete', 'settings', 'Can delete settings records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'settings'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'settings'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'settings:read'
ON CONFLICT DO NOTHING;
