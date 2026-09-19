-- refresh_tokens permissions
INSERT INTO permissions (id, slug, module, description) VALUES
    ('50000000-0000-0000-0000-000000000125', 'refresh_tokens:create', 'refresh_tokens', 'Can create refresh_tokens records'),
    ('50000000-0000-0000-0000-000000000126', 'refresh_tokens:read', 'refresh_tokens', 'Can view refresh_tokens records'),
    ('50000000-0000-0000-0000-000000000127', 'refresh_tokens:update', 'refresh_tokens', 'Can update refresh_tokens records'),
    ('50000000-0000-0000-0000-000000000128', 'refresh_tokens:delete', 'refresh_tokens', 'Can delete refresh_tokens records')
ON CONFLICT (slug) DO UPDATE SET
    module = EXCLUDED.module,
    description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM permissions
WHERE module = 'refresh_tokens'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id
FROM permissions
WHERE module = 'refresh_tokens'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id
FROM permissions
WHERE slug = 'refresh_tokens:read'
ON CONFLICT DO NOTHING;
