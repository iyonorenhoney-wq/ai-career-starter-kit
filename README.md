# AIキャリアスターターキット｜AI仕事診断 Webアプリ

10問の質問から、その人に合うAI活用の方向性（MAIN TYPE / SUB TYPE / GOAL）を整理し、
公式LINEでの専用PDF受け取り、7日チャレンジへつなげるWebアプリです。

```
LP → AI仕事診断（10問） → 診断結果 → スクリーンショット → 公式LINE → 専用PDF → 7日チャレンジ
```

---

## 置き場所についての注意

このプロジェクトは **iCloud Drive の同期対象外**（`~/Developer/` など）に置いてください。

デスクトップや書類フォルダは iCloud 同期の対象になっていることがあり、その配下に置くと
`node_modules` の数万ファイルが同期対象になります。その状態では
`npm install` / 型チェック / テスト / 開発サーバーがいずれも応答しなくなります。

（2026-08-09、デスクトップ配下から `~/Developer/` へ移動して解消済み）

---

## セットアップ

```bash
npm install
```

環境変数のテンプレートをコピーします。

```bash
cp .env.local.example .env.local
```

開発サーバーを起動します。

```bash
npm run dev
```

http://localhost:3000 を開いてください。

---

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェック（`tsc --noEmit`） |
| `npm run test` | テスト（Vitest） |
| `npm run test:watch` | テスト（監視モード） |

---

## 環境変数

| 変数名 | 内容 | 必須 |
| --- | --- | --- |
| `NEXT_PUBLIC_LINE_URL` | 公式LINEの友だち追加URL | 公開時に必須 |

未設定の場合、結果画面のCTAは押せない状態になり「公式LINEは準備中です」と表示されます。
URL確定後は `.env.local` に値を入れて開発サーバーを再起動するだけで有効になります。

---

## 技術構成

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript（strict） |
| スタイル | Tailwind CSS v4 |
| チャート | Recharts（結果画面で遅延読み込み） |
| アイコン | Lucide React |
| テスト | Vitest |
| 永続化 | localStorage のみ |

サーバー処理・データベース・ログインは使用しません。採点はすべてブラウザ内で完結します。

以下は該当STEPで追加します（未導入）。

- Framer Motion（STEP10）

---

## ディレクトリ構成

```
.
├── app/                  # ルーティング
│   ├── layout.tsx        # フォント / metadata
│   ├── page.tsx          # LP
│   ├── globals.css       # Tailwind + ブランドトークン
│   └── diagnosis/        # 診断本体（1ページ内で状態遷移）
│
├── components/
│   ├── diagnosis/        # 診断フロー
│   ├── result/           # 結果画面
│   ├── lp/               # LP各セクション
│   ├── ui/               # 汎用パーツ
│   └── layout/           # ヘッダー / フッター
│
├── data/                 # 質問・結果文章（テキストと点数はすべてここ）
├── lib/                  # 採点ロジック・保存・ID生成（UI非依存）
├── hooks/                # React hooks
├── types/                # 型定義
├── public/               # 静的ファイル
└── docs/                 # 仕様書（原本・変更しない）
```

### 設計上の原則

1. **データとUIを分離する** — 質問文・採点点数・結果文章をコンポーネントへ直書きしない（`docs/08_web-spec.md` §10）
2. **採点ロジックはReactに依存させない** — `lib/scoring.ts` は純関数として実装し、単体テスト可能に保つ（同 §91）
3. **`docs/` は仕様書の原本** — 実装の都合で書き換えない

---

## ブランドカラー

MOMOKAブランドは **深い紺（NAVY）+ 白 + 黒 + ターコイズブルー** を中心にします。
NAVYをメインカラー、TURQUOISEをアクセントカラーとして使用します。

### 土台（80〜90%）

| 用途 | 変数 | 値 |
| --- | --- | --- |
| BLACK | `--color-brand-black` | `#070A0F` |
| NAVY | `--color-brand-navy` | `#0B1D33` |
| NAVY LIGHT | `--color-brand-navy-light` | `#153A5B` |
| WHITE | `--color-brand-white` | `#FFFFFF` |
| OFF WHITE | `--color-brand-off-white` | `#F7F9FC` |

### アクセント（10〜20%）

| 用途 | 変数 | 値 |
| --- | --- | --- |
| TURQUOISE | `--color-brand-turquoise` | `#4BD6D6` |
| TURQUOISE LIGHT | `--color-brand-turquoise-light` | `#7BE8E8` |
| ACCENT BLUE | `--color-brand-accent-blue` | `#1F6FB2` |

Tailwindのユーティリティとして `bg-brand-navy` `text-brand-turquoise` のように使用できます。

### デザイン方針

- 白黒を土台にする
- 深い紺で知的・上質・AI感を出す
- ターコイズはCTA・線・グラフ・光・ポイントに使う
- 鮮やかな青の面積を大きくしない
- ネオンサイトにしない / ゴールドは使わない
- タイプ別に紫・緑・オレンジ等は使用しない（`docs/08_web-spec.md` §105）

結果画面は「深いNAVY / BLACK背景 + WHITE文字 + TURQUOISEの光・ライン」を基本とします。

SNSアイコン・PDF・Udemy・商品まで同じブランド世界観へつなげる前提です。

---

## 実装STEP

| STEP | 内容 | 状態 |
| --- | --- | --- |
| 1 | プロジェクト土台 | 完了 |
| 2 | 型定義 | 完了 |
| 3 | 質問データ | 完了 |
| 4 | 採点ロジック | 完了 |
| 5 | 診断UI（localStorage含む） | 完了 |
| 6 | 結果画面 | 完了 |
| 7 | デザイン（診断・結果画面） | 完了 |
| 8 | LINE導線 / LP | 完了 |
| 9 | レスポンシブ | — |
| 10 | 最終調整 | — |

---

## 仕様書

`docs/` 配下が仕様の原本です。実装時は必ずこちらを参照してください。

| ファイル | 内容 |
| --- | --- |
| `00_product-overview.md` | プロダクト全体像 |
| `01_diagnosis-spec.md` | 診断の機能・画面・導線 |
| `02_scoring-system.md` | 採点ロジック |
| `03_question-bank.md` | 質問文・選択肢・加点先 |
| `04_result-types.md` | 5タイプの結果文章 |
| `04_result-combinations.md` | MAIN × SUB 20パターン |
| `05_roadmaps.md` | 15ルートのロードマップ |
| `06_pdf-spec.md` | 専用PDF仕様 |
| `07_line-flow.md` | LINE導線・運用 |
| `08_web-spec.md` | Web技術・デザイン仕様 |
| `09_lp.md` | LP構成・コピー |
