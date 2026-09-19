-- Firebase identities are linked to the application's local users table, where
-- roles and permissions are resolved. This account deliberately has no system
-- password: it signs in through Firebase Auth.
UPDATE users
SET
    firebase_uid = 'cEMF9sDNV1gBKgIgfa2Jbf9hQVG2',
    email = '{{ENCRYPT:rclores666@gmail.com}}',
    email_hash = '{{HASH:rclores666@gmail.com}}',
    display_name = '{{ENCRYPT:Rayven Clores}}',
    is_active = TRUE,
    updated_at = NOW()
WHERE (email_hash = '{{HASH:rclores666@gmail.com}}' OR LOWER(email) = LOWER('rclores666@gmail.com'))
  AND (firebase_uid IS NULL OR firebase_uid = 'cEMF9sDNV1gBKgIgfa2Jbf9hQVG2');

INSERT INTO users (firebase_uid, email, email_hash, phone_number, display_name, avatar_url, is_active)
VALUES (
    'cEMF9sDNV1gBKgIgfa2Jbf9hQVG2',
    '{{ENCRYPT:rclores666@gmail.com}}',
    '{{HASH:rclores666@gmail.com}}',
    NULL,
    '{{ENCRYPT:Rayven Clores}}',
    'https://lh3.googleusercontent.com/a/ACg8ocJg8KBjz8uP25AKW7SNl1FPNdHC2P6KVPnBA6kZ3V0jh7DLOuIgjQ=s96-c',
    TRUE
)
ON CONFLICT DO NOTHING;

-- The canonical system super-admin role has every seeded permission and is the
-- authorization middleware's explicit master-access role.
INSERT INTO user_roles (user_id, role_id)
SELECT users.id, '00000000-0000-0000-0000-000000000001'
FROM users
WHERE users.firebase_uid = 'cEMF9sDNV1gBKgIgfa2Jbf9hQVG2'
ON CONFLICT DO NOTHING;
