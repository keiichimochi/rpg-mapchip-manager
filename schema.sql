-- 既存のテーブルをバックアップ
ALTER TABLE mapchips RENAME TO mapchips_old;

-- 新しいテーブルを作成
CREATE TABLE mapchips (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL CHECK (size IN (16, 32, 64)),
    category TEXT NOT NULL CHECK (category IN ('character', 'mapchip', 'monster', 'item', 'effect', 'ui')),
    tags TEXT NOT NULL,
    flags TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 既存のデータを新しいテーブルにコピー（カテゴリーはデフォルト値を設定）
INSERT INTO mapchips (id, filename, size, category, tags, flags, created_at)
SELECT id, filename, size, 'mapchip' as category, tags, flags, created_at
FROM mapchips_old;

-- バックアップテーブルを削除
DROP TABLE mapchips_old;