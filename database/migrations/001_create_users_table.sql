CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(255) UNIQUE NULL,
    display_name VARCHAR(255) NULL,
    avatar_url TEXT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NULL,
    password_hash VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMPTZ NULL,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users (firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);