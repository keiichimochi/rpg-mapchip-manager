# RPG MapChip Manager

RPGのマップチップと音声ファイルを管理するためのWebアプリケーション。Cloudflare WorkersとR2、D1を使用しています。

## 機能

### マップチップ管理
- マップチップのアップロード
- タグ付けとフラグ設定
- サイズ（16x16, 32x32, 64x64）対応
- カテゴリー分類（キャラクター、マップチップ、モンスター、アイテム、エフェクト、UI）
- プレビュー表示
- URLのコピー

### サウンド管理
- 音声ファイルのアップロード（mp3, wav）
- カテゴリー分類（BGM、効果音、ボイス、環境音）
- タグ付け
- プレビュー再生
- URLのコピー
- IDのコピー

## 技術スタック

- Cloudflare Workers
- Cloudflare R2 (画像・音声ストレージ)
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
wrangler r2 bucket create rpg-sounds-dev
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

[[r2_buckets]]
binding = "SOUNDS"
bucket_name = "rpg-sounds"
preview_bucket_name = "rpg-sounds-dev"
```

## APIエンドポイント

### マップチップAPI
- `POST /api/mapchips` - マップチップのアップロード
- `GET /api/mapchips/:id` - マップチップの取得
- `DELETE /api/mapchips/:id` - マップチップの削除
- `PATCH /api/mapchips/:id/tags` - タグの更新
- `PATCH /api/mapchips/:id/category` - カテゴリーの更新
- `GET /api/search` - マップチップの検索

### サウンドAPI
- `POST /api/sounds` - 音声ファイルのアップロード
- `GET /api/sounds/:id` - 音声ファイルの取得
- `DELETE /api/sounds/:id` - 音声ファイルの削除
- `PATCH /api/sounds/:id/tags` - タグの更新
- `GET /api/sounds/search` - 音声ファイルの検索

## ライセンス

MIT License