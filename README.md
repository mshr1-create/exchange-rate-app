# exchange-rate-app

為替レートコンバーター（React + Vite）の操作マニュアルです。初見の方でも5分で起動・操作できるように、起動手順と使い方、よくあるつまずきをまとめました。

**対象機能（今回の実装範囲）**
- プルダウンで通貨を選択（変換前/変換後）
- 金額（変換前）を入力
- 「変換」ボタンを押下
- 変換結果を表示（変換後）

アプリ本体は `fx-converter` ディレクトリ配下にあります。

**サポート通貨**
- `JPY`（日本円）、`KRW`（韓国ウォン）、`SGD`（シンガポールドル）

## 環境変数の設定（.env と .env.local）

本アプリはクライアントから為替レートAPIにアクセスします。Vite の仕様により、クライアントから参照する環境変数は `VITE_` プレフィックスが必要です。

1) `fx-converter/.env.example` を参考に、以下いずれかを作成してください。
- 共有用: `fx-converter/.env`
- ローカル専用: `fx-converter/.env.local`

設定項目（.env/.env.local とも同一）：

```
VITE_EXCHANGE_RATE_API_KEY=あなたのAPIキー
VITE_EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6
```

メモ:
- `VITE_EXCHANGE_RATE_BASE_URL` は末尾スラッシュなしで指定してください。
- 例のプロバイダ: https://www.exchangerate-api.com/

## 起動手順

以下は `fx-converter` ディレクトリで実行します。

1) 依存関係をインストール
- `pnpm install`

2) 開発サーバーを起動
- `pnpm dev`

3) ブラウザで開く
- 表示URL（例）: `http://localhost:5173/`

補足:
- `npm`/`yarn` でも動作しますが、本プロジェクトは `pnpm` を想定しています。

## 使い方

1) 通貨選択
- 「変換前の通貨」「変換後の通貨」をプルダウンで選択
- 同一通貨（例: JPY→JPY）の場合は変換できません（ボタン無効化・警告表示）

2) 金額入力
- 「金額（変換前）」に0以上の数値を入力（少数可）
- 不正な入力時は変換できません（ボタン無効化）

3) 変換
- 「変換」ボタンを押下するとAPIからレートを取得して計算します
- 取得中はボタンラベルが「取得中…」になります

4) 結果表示
- 「金額（変換後）」にロケール・通貨記号付きで結果が表示されます

## よくあるつまずき

- APIキー未設定
  - 症状: 変換時にエラー、コンソールに `Missing VITE_EXCHANGE_RATE_API_KEY` と表示
  - 対処: `fx-converter/.env` または `.env.local` に `VITE_EXCHANGE_RATE_API_KEY` を設定

- BASE_URL未設定/不正
  - 症状: `Missing VITE_EXCHANGE_RATE_BASE_URL` またはAPIエラー
  - 対処: `VITE_EXCHANGE_RATE_BASE_URL` を `.env`/`.env.local` に設定（末尾スラッシュ無し）

- CORSエラー
  - 症状: ブラウザのコンソールで CORS 関連エラー
  - 原因: 利用するプロバイダやネットワーク設定により、ブラウザからの直接アクセスがブロックされることがあります
  - 対処: 公式ドキュメントのCORS設定を確認する、別プロバイダを利用する、またはバックエンド経由でプロキシする

- 同一通貨の変換
  - 症状: ボタンが無効化、警告「同じ通貨同士は変換できません」
  - 対処: 変換前/変換後のいずれかを別の通貨に変更

- 数値入力が不正
  - 症状: ボタンが無効化またはエラー表示、結果が空のまま
  - 対処: 0以上の数値（少数可）を半角で入力

## 参考: レート取得の仕様

- 使用環境変数: `VITE_EXCHANGE_RATE_API_KEY`, `VITE_EXCHANGE_RATE_BASE_URL`
- 実際の取得URL（例）:
  - `{VITE_EXCHANGE_RATE_BASE_URL}/{VITE_EXCHANGE_RATE_API_KEY}/latest/{BASE}`
- エラーハンドリング:
  - ネットワークエラー、非200系レスポンス、JSON不正、`conversion_rates` 欠落を検出してエラー化

以上で、通貨選択→金額入力→変換→結果表示の基本操作をすぐに試せます。
