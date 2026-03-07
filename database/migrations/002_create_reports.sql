CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    report_type report_type NOT NULL,
    status report_status NOT NULL DEFAULT 'open',
    player_email VARCHAR(255),
    player_name VARCHAR(100),
    screenshot_path TEXT,
    screenshot_mime_type VARCHAR(100),
    screenshot_size_bytes BIGINT,
    source VARCHAR(50) DEFAULT 'web',
    priority SMALLINT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);
