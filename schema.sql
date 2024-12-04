CREATE TABLE mapchips (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL CHECK (size IN (16, 32, 64)),
    tags TEXT NOT NULL,
    flags TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);