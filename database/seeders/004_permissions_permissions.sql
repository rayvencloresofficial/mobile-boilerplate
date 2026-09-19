-- 004 permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000113', '004:create', '004', 'Can create 004 records'),
    ('50000000-0000-0000-0000-000000000114', '004:read', '004', 'Can view 004 records'),
    ('50000000-0000-0000-0000-000000000115', '004:update', '004', 'Can update 004 records'),
    ('50000000-0000-0000-0000-000000000116', '004:delete', '004', 'Can delete 004 records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = '004'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = '004'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = '004:read'
ON CONFLICT DO NOTHING;
