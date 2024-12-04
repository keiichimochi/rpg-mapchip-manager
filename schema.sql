-- マップチップ用のテーブルを作成
CREATE TABLE IF NOT EXISTS mapchips (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL CHECK (size IN (16, 32, 64)),
    category TEXT NOT NULL CHECK (category IN ('character', 'mapchip', 'monster', 'item', 'effect', 'ui')),
    tags TEXT NOT NULL,
    flags TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 音声ファイル用のテーブルを作成
CREATE TABLE IF NOT EXISTS sound_files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('bgm', 'se', 'voice', 'ambient')),
    tags TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);