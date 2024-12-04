# RPG MapChip Manager

RPGマップチップを管理するためのWebアプリケーション。Cloudflare WorkersとR2、D1を使用しています。

## 機能

- マップチップのアップロード
- タグ付けとフラグ設定
- サイズ（16x16, 32x32, 64x64）対応
- 検索機能
- プレビュー表示
- URLのコピー

## 技術スタック

- Cloudflare Workers
- Cloudflare R2 (画像ストレージ)
- Cloudflare D1 (SQLiteデータベース)
- TypeScript
- Tailwind CSS

## ローカル開発環境のセットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発用データベースとR2バケットの作成:
```bash
wrangler d1 create rpg-mapchips-db-dev
wrangler r2 bucket create rpg-mapchips-dev
```

3. データベースのマイグレーション:
```bash
wrangler d1 execute rpg-mapchips-db-dev --file=schema.sql
```

4. ローカル開発サーバーの起動:
```bash
wrangler dev
```

## デプロイ

本番環境へのデプロイ:
```bash
wrangler deploy
```

## 環境変数の設定

`wrangler.toml`に以下の設定が必要です：

```toml
[[d1_databases]]
binding = "DB"
database_name = "rpg-mapchips-db"
database_id = "本番用DB_ID"
preview_database_id = "開発用DB_ID"

[[r2_buckets]]
binding = "MAPCHIPS"
bucket_name = "rpg-mapchips"
preview_bucket_name = "rpg-mapchips-dev"
```