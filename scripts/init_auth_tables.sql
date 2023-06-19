CREATE TABLE auth_user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);
CREATE TABLE auth_session (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES auth_user(id) NOT NULL,
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);
CREATE TABLE auth_key (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES auth_user(id) NOT NULL,
    primary_key BOOLEAN NOT NULL,
    hashed_password TEXT,
    expires BIGINT
);