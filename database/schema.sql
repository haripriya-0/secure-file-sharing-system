CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    s3_key TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size BIGINT
);

CREATE TABLE shared_tokens (
    token TEXT PRIMARY KEY,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    expiry_time TIMESTAMP,
    permissions VARCHAR(50)
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    file_id UUID,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_audit_file
        FOREIGN KEY(file_id)
        REFERENCES files(id)
        ON DELETE CASCADE
);