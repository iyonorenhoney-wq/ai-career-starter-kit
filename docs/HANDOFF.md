# AIキャリアスターターキット｜引き継ぎ資料

> **このファイルは仕様書の原本ではありません。**
> `docs/` 配下の `00_` 〜 `09_` は仕様の原本であり、実装の都合で書き換えません。
> このファイルは「実装がどこまで進んでいるか」を引き継ぐための作業メモです。
>
> 最終更新: 2026-08-11
>
> ## ⚠ いま公開作業中です
>
> 診断アプリは完成し、公式LINE URLの設定とBOOK CODEの実装まで終わっています。
> **次にやることは `docs/HANDOFF-RELEASE.md` に書いてあります。**
> このファイル（全体の仕様）を読んだあと、必ずそちらを読んでください。
>
> このファイルは STEP10 完了時点の内容です。それ以降の変更は次のとおりです。
>
> | 変更 | 内容 |
> | --- | --- |
> | 公式LINE URL | `https://lin.ee/vepNrqwH` を `.env.local` に設定済み |
> | BOOK CODE | 結果カードに追加（15冊の手動配布用） |
> | テスト件数 | 150件 → **154件** |
> | `docs/pdf-drafts/` | commit `79299bd` で追加。**要調査** |

---

## 0. 最初に読むべきこと

新しく担当する場合、**この順で読んでください。**

1. このファイル（全体像・確定事項・禁止事項）
2. **`docs/HANDOFF-RELEASE.md`（いまやる作業）**
3. `docs/08_web-spec.md`（Web技術・デザイン仕様）
4. `docs/01_diagnosis-spec.md`（診断の機能・画面・導線）
5. `docs/02_scoring-system.md`（採点ロジック）

**最重要のルール**

- 仕様書を最優先とする
- **勝手に仕様変更しない**
- 不明点は実装前に提案として出す
- 推測だけで修正せず、原因を確認してから対応する
- 各STEPの終了ごとに停止し、ユーザーの確認を待つ

---

## 1. プロジェクトの目的

10問の診断から、その人に合うAI活用の方向性を整理し、
公式LINE経由で専用PDFを渡し、7日間の行動につなげるWebアプリ。

```
LP → AI仕事診断（10問） → 診断結果 → スクリーンショット
→ 公式LINE → 専用PDF（攻略BOOK） → 7日チャレンジ
```

### 誤解しやすい点

このプロダクトは**「診断アプリ」ではありません。**

Web側の責務は診断完了までではなく、次の順序を成立させることまでです（`01` §79, `08` §148）。

```
結果理解 → スクリーンショット → 公式LINE → 専用PDF → 7日チャレンジ
```

したがって **結果画面の「スクショしやすさ」が最重要KPI**であり、
SNSシェアはそれより下の優先度です。

診断結果はゴールではなく **START地点** として設計されています（`01` §88）。

---

## 2. フォルダ構成／開発環境

### 場所

```
~/Developer/ai-career-starter-kit
```

**重要: iCloud Driveの同期対象外に置いてください。**
デスクトップ配下に置いていた際、`node_modules` の数万ファイルが同期対象になり、
`npm install` / 型チェック / テスト / 開発サーバーがすべて応答しなくなりました。
2026-08-09に `~/Developer/` へ移動して解消済みです。

### 環境

| 項目 | 値 |
| --- | --- |
| Node.js | v24.14.0 |
| Next.js | 16.3.0（App Router / Turbopack） |
| React | 19.2.8 |
| TypeScript | 5.x（strict + `noUncheckedIndexedAccess`） |
| Tailwind CSS | v4 |
| Recharts | 3.10.1（結果画面で遅延読み込み） |
| Lucide React | 1.30.0 |
| Vitest | 4.x |

**Framer Motion は導入していません。** アニメーションはすべてCSSです。
初期ロードを増やす理由がないため、現時点では不要と判断しています。

### ディレクトリ

```
.
├── app/
│   ├── layout.tsx          # フォント / metadata / OGP
│   ├── page.tsx            # LP
│   ├── globals.css         # ブランドトークン・アニメーション定義
│   └── diagnosis/page.tsx  # 診断ページ（noscript案内を含む）
│
├── components/
│   ├── diagnosis/          # 7ファイル（intro / question / card / progress など）
│   ├── result/             # 12ファイル（結果9セクション + 再診断 + チャート）
│   ├── lp/                 # 11ファイル（LP 8ブロック + CTA + モックアップ + BOOK表紙）
│   ├── ui/                 # TypeIcon / PageViewTracker
│   └── layout/             # Footer
│
├── data/                   # 質問・結果文章・LPコピー（テキストと点数はすべてここ）
├── lib/                    # 採点・保存・ID生成・表示ラベル・計測（UI非依存）
│   └── __tests__/          # テスト8ファイル
├── hooks/useDiagnosis.ts   # 診断フローの状態管理
├── types/                  # diagnosis.ts / content.ts
└── docs/                   # 仕様書の原本（変更しない）+ このファイル
```

### 設計上の原則（守ってください）

1. **データとUIを分離する** — 質問文・採点点数・結果文章をコンポーネントへ直書きしない（`08` §10）
2. **採点ロジックはReactに依存させない** — `lib/scoring.ts` は純関数（同 §91）
3. **`docs/` の `00_`〜`09_` は原本** — 実装の都合で書き換えない

### コマンド

```bash
npm run dev        # 開発サーバー
npm run build      # 本番ビルド
npm run typecheck  # 型チェック
npm run lint       # ESLint
npm run test       # テスト
```

**公開前は必ず `build` まで通してください。**
テストが通っても型エラーでビルドが落ちた実例があります。

---

## 3. STEP1〜10で完成した内容

| STEP | 内容 | コミット |
| --- | --- | --- |
| 1 | プロジェクト土台・ブランドトークン | `40757d5` |
| 2 | 型定義（`types/diagnosis.ts` / `types/content.ts`） | `cfb7834` |
| 3 | 質問データ（Q1〜Q10・44選択肢） | `7f3dab7` |
| 4 | 採点ロジック + Vitest導入 | `ef2e938` |
| 5 | 診断UI + localStorage | `781061f` |
| 6 | 結果画面（9セクション）+ Recharts | `eadba8a` |
| 7 | デザイン（診断・結果）+ Lucide | `cd1b28e` |
| 8 | LP（8ブロック） | `adb24c2` |
| 9 | レスポンシブ最終確認 | `9940223` |
| 10 | 最終調整（noscript / 計測 / a11y / テスト） | `de982be` |

---

## 4. 診断仕様

**出典: `docs/01_diagnosis-spec.md` / `docs/02_scoring-system.md` / `docs/03_question-bank.md`**

### 4-1. 5つのAI活用タイプ

| ID | 名称 | 英語表示 | スコア軸 | アイコン |
| --- | --- | --- | --- | --- |
| `smart_worker` | AIスマートワーカー | AI SMART WORKER | 仕事効率化 | Briefcase |
| `creator` | AIクリエイター | AI CREATOR | 制作 | PenTool |
| `supporter` | AIサポーター | AI SUPPORTER | サポート | Users |
| `producer` | AIプロデューサー | AI PRODUCER | 商品化 | Package |
| `builder` | AIビルダー | AI BUILDER | 仕組み化 | Blocks |

### 4-2. 3つのGOAL

| ID | 表示名 |
| --- | --- |
| `work` | 本業活用 |
| `side` | 副業・収益化 |
| `both` | 本業＋副業 |

### 4-3. 質問構成

- **全10問・すべて単一選択式**
- Q1〜Q7 … タイプ判定（5択）
- Q8〜Q10 … 目的判定（3択）
- 選択肢の並びは**質問ごとに固定**。アクセスごとのランダムシャッフルはしない（`03` §6）
- **Q6とQ7は選択肢の配置が同一**。仕様書どおりであり、意図的にそのままにしている

### 4-4. 採点ルール

```
Q1〜Q6  メインタイプ +2 / 関連タイプ +1
Q7      メインタイプ +3 / 関連タイプ +1   ← 本人の意思を重視
Q8・Q9  該当GOAL +2
Q10     該当GOAL +3                      ← 直近の目標を重視
```

- タイプの理論最大値は **15点**（全5タイプで検証済み）
- 表示スコア = `round(rawScore / 15 × 100)`、上限100・下限0

### 4-5. 判定

| 項目 | 決め方 |
| --- | --- |
| MAIN TYPE | 1位 |
| SUB TYPE | 2位（MAINと必ず異なる） |
| PRIMARY GOAL | 目的スコア1位 |
| SECONDARY GOAL | 2位（内部保持。結果画面には表示しない） |
| routeId | `{mainType}_{primaryGoal}` の15通り |
| resultId | `AI-YYMMDD-XXXX` |

### 4-6. STYLE判定

```
1位 - 3位 <= 10  → multi
1位 - 2位 <= 10  → hybrid
それ以外          → focused
```

- 判定は**表示スコア**で行う
- 判定順は **multi → hybrid → focused**
- 閾値は `lib/constants.ts` の `STYLE_THRESHOLD = 10`

**全78,125通りの実測分布**

| STYLE | 割合 |
| --- | --- |
| focused | 48.7% |
| hybrid | 33.5% |
| multi | 17.9% |

閾値14/15も比較しましたが、multiが38.7%まで増え「まずどこから始めるか」が
弱くなるため、**Ver.1では10のまま据え置き**と決定済みです。

### 4-7. タイブレーク

**タイプ**

```
rawScore → Q7メイン加点 → Q6メイン加点 → メイン加点回数 → サブ加点回数 → 固定順
```

固定順: `smart_worker, creator, supporter, producer, builder`

**目的**

```
スコア → Q10で選択 → Q9で選択 → Q8で選択 → 固定順
```

固定順: `both, work, side`

**実測（全78,125通り）**

| 決着レベル | 割合 |
| --- | --- |
| 生点で決着 | 59.3% |
| Q7メイン加点 | 23.6% |
| Q6メイン加点 | 10.4% |
| メイン加点回数 | 5.0% |
| サブ加点回数 | **0.0%（構造上到達しない）** |
| 固定順 | 1.7% |

### 4-8. 採点の失敗

例外ではなく戻り値で表現します。

```ts
{ ok: true, result } | { ok: false, reason }
```

理由は3種: `incomplete_answers` / `unknown_option` / `all_scores_zero`

失敗時は結果へ進まず、質問画面に戻して
「診断結果の計算に失敗しました。もう一度お試しください。」を表示します。

### 4-9. 画面遷移

```
intro → question → calculating → result
```

- 回答タップから **280ms** 後に自動で次へ
- **戻る操作では自動遷移しない**（能動的なタップ時のみ）
- 計算演出は3メッセージ × 500ms = 約1.5秒

---

## 5. 結果画面の仕様

**セクション順（変更しない）**

| # | セクション | 背景 |
| --- | --- | --- |
| 1 | ResultShareCard（診断書カード） | ダーク |
| 2 | MAIN TYPE | 白 |
| 3 | SUB TYPE | オフホワイト |
| 4 | MAIN × SUB | **ダーク** |
| 5 | AI活用スコア | 白 |
| 6 | GOAL | 白 |
| 7 | 強み | 白 |
| 8 | TODAY'S FIRST STEP | 淡いターコイズ |
| 9 | LINE CTA | **ダーク** |
| — | もう一度診断する + 免責 | 白 |

### ResultShareCard（最重要）

視覚階層（上から強い順）:

```
MAIN TYPE → STYLE → GOAL → SUB TYPE → ONE LINE → BOOK CODE → Diagnosis ID
```

- カード高さは 320〜430px幅で **約571〜651px**。1画面に収まる
- 最長の組み合わせ（`AI SMART WORKER × BUILDER HYBRID` / `SMART WORKER / BOTH`）でも崩れない
- 全20組み合わせ・全15ルートを320pxで検証済み

**BOOK CODE**（15冊の手動配布用）をフッターに追加済みです。
表示位置・区切り文字・色は変更しないでください。
詳細は `docs/HANDOFF-RELEASE.md` の「2.〜4.」を参照。

### Webで表示していない項目（意図的）

データには保持していますが、**Webには出しません**（`04_result-types.md` §21）。
PDF側で使用します。

- 注意ポイント5つ
- 向いているAI活用 / 向いている仕事
- おすすめAIツール / おすすめ学習順
- 30日 / 90日の方向性
- 組み合わせの BEST USE / WATCH OUT

**ユーザーの判断: 「結果画面は情報量を増やさない」** と確定済みです。

---

## 6. LPの仕様

`09_lp.md` は11セクションを定義していますが、**ユーザーの指示により8ブロックへ統合**しています。
11個に戻さないでください。

| # | ブロック | 背景 | 内容 |
| --- | --- | --- | --- |
| 1 | HERO | 白 | コピー → CTA → 結果カードのモックアップ |
| 2 | PROBLEM | オフホワイト | 悩み4つ + 締めのコピー |
| 3 | WHAT YOU GET | 白 | 分かる4つ / 5タイプ / MAIN×SUB を統合 |
| 4 | AFTER DIAGNOSIS | **ダーク** | 診断→BOOK→7日→30日→90日の流れ |
| 5 | CAREER BOOK | 白 | BOOKの中身 + 7日チャレンジ |
| — | 中盤CTA | 白 | |
| 6 | HOW TO RECEIVE | オフホワイト | ここで初めてLINE導線を詳述 |
| 7 | FAQ + この診断を作った人 | 白 | 5問 + MOMOKA紹介（写真なし） |
| 8 | FINAL CTA | **ダーク** | 最終CTA + 免責 |

### CTA

- **3箇所**（hero / middle / final）
- 文言はすべて `無料でAI仕事診断をはじめる` に統一
- 遷移先はすべて `/diagnosis`

### LPに載せないもの（確定）

- お客様の声
- 実績一覧
- Udemy / Brain / コミュニティ
- 商品販売CTA

**販売感を出さないこと。** LPの目的は診断開始のみです。

### 所要時間の表記

**サイト全体で「約2分」に統一**しています。
`09_lp.md` §40 は「約2〜3分」ですが、ユーザーの指示により2分で統一しました。
**混在させないでください。**

### PDFモックアップ

実物がないため、**偽の表紙画像は作っていません。**
`components/lp/BookCover.tsx` はタイトルだけの枠です。

```tsx
<BookCover />                      // 現在
<BookCover imageSrc="/book.png" /> // 実物ができたら
```

---

## 7. デザインルール／ブランドカラー

**このデザインはユーザー確認済みで確定しています。勝手に変えないでください。**

### ブランドカラー（この8色のみ）

**土台（80〜90%）**

| 用途 | 変数 | 値 |
| --- | --- | --- |
| BLACK | `--color-brand-black` | `#070A0F` |
| NAVY | `--color-brand-navy` | `#0B1D33` |
| NAVY LIGHT | `--color-brand-navy-light` | `#153A5B` |
| WHITE | `--color-brand-white` | `#FFFFFF` |
| OFF WHITE | `--color-brand-off-white` | `#F7F9FC` |

**アクセント（10〜20%）**

| 用途 | 変数 | 値 |
| --- | --- | --- |
| TURQUOISE | `--color-brand-turquoise` | `#4BD6D6` |
| TURQUOISE LIGHT | `--color-brand-turquoise-light` | `#7BE8E8` |
| ACCENT BLUE | `--color-brand-accent-blue` | `#1F6FB2` |

補助: `--color-brand-border: #DBE2EA` / `--color-brand-tint: #F4F7FB`

### 方針

- 白黒を土台にする
- 深い紺で知的・上質・AI感を出す
- ターコイズは**視線を集めたい場所だけ**（罫線・小さな点・ラベル）
- 鮮やかな青の面積を大きくしない
- ネオンサイトにしない / **ゴールドは使わない**
- **タイプ別に紫・緑・オレンジ等は使用しない**（`08` §105）
  - タイプ差はアイコン・モチーフ・比率・レイアウトで表現する

> `04_result-types.md` §18 にはタイプ別カラー（紫・緑・オレンジ）の記載がありますが、
> **`08_web-spec.md` §105 を採用**することで決着済みです。戻さないでください。

### 目指す方向

「上質 × 知的 × 未来感 × 信頼感」

避けるもの: よくあるAIサービス / SaaS管理画面 / サイバーすぎ / ネオンだらけ /
カードだらけ / グラデーションだらけ / 長文 / 大量の英語

### 実装上の作り

- 装飾を足さず、**余白・文字階層・1pxの罫線**で質を出す
- `eyebrow`（小さな英字ラベル）を各セクションの頭に置く
- アニメーションはCSSのみ（`fade-up` / `scan` / `soft-pulse`）
- `prefers-reduced-motion` で全アニメーションを無効化

---

## 8. localStorage仕様

### キー

| キー | 内容 |
| --- | --- |
| `aiCareerDiagnosisProgress` | 診断途中（`currentQuestion` / `answers` / `startedAt`） |
| `aiCareerDiagnosisResult` | 診断結果 |

保存形式は `{ diagnosisVersion, progress }` / `{ diagnosisVersion, result }`。

### バージョン

`DIAGNOSIS_VERSION = "1.0.0"`（`lib/constants.ts`）

**質問や採点を変更したら、必ずこの値を上げてください。**
バージョンが一致しない保存データは破棄されます。

### 復元の優先順位

1. 保存済みの結果があれば結果画面（LINEから戻った場合を想定）
2. 途中の回答があればその質問から再開
3. どちらもなければ開始画面

### 堅牢性（テスト済み）

- 壊れたJSON / 型不正 / 必須項目欠け → すべて `null` として扱い、開始画面へ
- **localStorageが使えない環境**（Safariプライベートブラウズ等）→ 例外を投げず動作継続
- 容量超過 → 例外を投げず動作継続

---

## 9. 公式LINE導線

### 受け取りの流れ

```
01 診断を受ける
02 結果をスクショ
03 公式LINEを追加
04 スクショ ＋「今一番変えたいこと」を送信
05 専用攻略BOOKを受け取る
```

### 実装

- 結果画面の LINE CTA は「価値 → 受け取り方 → CTA」の順
- URL未設定時は**ボタンを押せない状態**にし「公式LINEは準備中です」を表示
- URL設定時は `<a target="_blank" rel="noopener noreferrer">`

### 運用（`07_line-flow.md`）

Ver.1では **MOMOKA本人が手動で返信**します。
スクショを見てMAIN × GOALを判定し、該当する15冊のうち1冊を送ります。

---

## 10. 環境変数

| 変数名 | 現在の値 | 必須 |
| --- | --- | --- |
| `NEXT_PUBLIC_LINE_URL` | **設定済み** `https://lin.ee/vepNrqwH` | 公開時に必須 |

- テンプレート: `.env.local.example`
- `.env.local` は `.gitignore` 済み
- `.env.local` に設定済み。**ただし `.gitignore` されているためデプロイされません**
- **Vercel側にも同じ環境変数の登録が必要です**（`docs/HANDOFF-RELEASE.md` 参照）

---

## 11. テスト／buildの現在の状態

| コマンド | 結果 |
| --- | --- |
| `npm run typecheck` | エラー0 |
| `npm run lint` | エラー0・警告0 |
| `npm run test` | **154件すべてPASS**（8ファイル） |
| `npm run build` | 成功 |

### テストファイル

| ファイル | 対象 |
| --- | --- |
| `scoring.test.ts` | 採点・仕様書テストケース10件・回答例6件 |
| `exhaustive.test.ts` | **全78,125通りの不変条件**（MAIN≠SUB等） |
| `tiebreak.test.ts` | 同点処理 |
| `style.test.ts` | STYLE判定の境界値 |
| `displayScore.test.ts` | 0〜100変換 |
| `resultId.test.ts` | ID生成 |
| `resultContent.test.ts` | 5タイプ・20組み合わせ・3GOAL・3STYLEの網羅 |
| `diagnosisStorage.test.ts` | 保存・復元・異常系 |

> `resultContent.test.ts` には BOOK CODE のテスト4件を追加済み。

### 初期ロード（gzip後）

| ページ | サイズ |
| --- | --- |
| `/` | 179 KB |
| `/diagnosis` | 196 KB |

Rechartsは別チャンク（83KB）で、**結果画面到達時のみ**読み込まれます。
この遅延読み込みを壊さないでください。

### レスポンシブ確認済み

`320 / 360 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440px`
横向き（844×390）、文字サイズ125% / 150%
→ すべて横スクロール・はみ出し・見切れなし、48px未満のタップ領域0件

---

## 12. iPhone実機確認で発生した問題と修正内容

### 問題

iPhone Safariで `/diagnosis` が**真っ白**（LPは正常に表示された）。

### 原因

Next.js開発サーバーが、**localhost以外からの `/_next/*`（JavaScript）をブロック**していました。

```
⚠ Blocked cross-origin request to Next.js dev resource
  /_next/static/chunks/... from "192.168.10.109".
```

### なぜLPは映って診断画面だけ真っ白だったか

| 画面 | サーバーが返すHTML | JSがないと |
| --- | --- | --- |
| LP | 全セクションの内容が入っている | そのまま表示される |
| 診断画面 | **空**（中身はJSが描く） | **何も表示されない** |

**LPが映っていたことが「JSは動いている」という誤った安心材料**になっていました。

### 修正

`next.config.ts` に `allowedDevOrigins` を追加。
**IPを固定で書かず、起動時にMacのプライベートIPを自動で列挙**します。
ネットワークが変わっても書き換え不要です。開発時のみ有効で本番ビルドには影響しません。

### 補足

- IPアドレスは変わります。`ipconfig getifaddr en0` または `npm run dev` の `Network:` 行で確認
- 確認当時のURL: `http://192.168.10.109:3000`
- **実機で全画面・完走を確認済み**（ユーザー確認済み）

---

## 13. これまでに確定した判断

**ユーザーが明示的に決定したもの。覆さないでください。**

| # | 判断 |
| --- | --- |
| 1 | `DiagnosisResult` は `02` §63 を正とする（`primaryGoal` / `secondaryGoal` / `routeId`） |
| 2 | ブランドカラーは `08` §105 を採用。タイプ別に紫・緑・オレンジは使わない |
| 3 | SECONDARY GOAL の同点は PRIMARY を除外して Q10→Q9→Q8→固定順 |
| 4 | Q6・Q7の選択肢順は仕様書どおり（同一配置のまま） |
| 5 | 自動遷移は**能動的なタップ時のみ**。戻ったときは発生させない |
| 6 | `STYLE_THRESHOLD` は **10** のまま（Ver.1） |
| 7 | 配点・サブ加点先は変更しない（MAIN分布の偏りは公開後に判断） |
| 8 | タイブレークルールは変更しない |
| 9 | resultIdは `AI-YYMMDD-XXXX`。`0/O/1/I/L` を除外 |
| 10 | 質問データのフィールド名は `category`（`type` ではない） |
| 11 | `diagnosisVersion` は結果オブジェクトに含めず保存ラッパー側で持つ |
| 12 | 型名は `DiagnosisStyle`（フィールド名は `style`） |
| 13 | 見出し＋説明を持つデータは `{ title, body }` 形式 |
| 14 | 所要時間の表記は**サイト全体で「約2分」** |
| 15 | LPは8ブロック構成（11セクションに戻さない） |
| 16 | LPに実績・お客様の声・商品販売CTAを載せない |
| 17 | 結果画面に情報を追加しない |
| 18 | JS未読み込み時は `<noscript>` 案内のみ（サーバー側描画への変更はしない） |
| 19 | Framer Motionは導入しない |
| 20 | 攻略BOOKの偽モックアップ画像は作らない |

---

## 14. 変更してはいけない仕様

**以下に手を入れる場合は、必ず先にユーザーへ確認してください。**

- 質問文・選択肢文（`data/questions.ts`）
- Option ID・加点先・点数・選択肢の並び順
- 採点ロジック・タイブレーク・STYLE閾値
- MAIN / SUB / GOAL の判定方法
- 5タイプの結果文章（`data/resultTypes.ts`）
- MAIN × SUB の20パターン（`data/resultCombinations.ts`）
- 結果画面のセクション順
- LPの8ブロック構成とCTA文言
- ブランドカラー8色
- 280msの自動遷移
- localStorageのキー名と保存形式
- 公式LINE導線の手順
- `docs/` の `00_`〜`09_`（仕様書の原本）

---

## 15. まだ未完了のもの

### 公開前に必須

| # | 作業 | 担当 |
| --- | --- | --- |
| 1 | **公式LINEのURL取得 → `.env.local` に設定** | MOMOKAさん |
| 2 | **攻略BOOK（PDF）の制作** | MOMOKAさん |
| 3 | 本番URLを決めてデプロイ（Vercel想定） | 実装側 |
| 4 | LINE公式アカウントの応答準備 | MOMOKAさん |

**2番が最も時間がかかります。**

### 公開後でも可

| 作業 | 状況 |
| --- | --- |
| OGP画像の作成 | 設定箇所は用意済み。`app/layout.tsx` に `openGraph.images` を足すだけ |
| `metadataBase` の設定 | 本番URL決定後 |
| アクセス解析の導入 | **呼び出しは全箇所完了済み**。`lib/analytics.ts` の `track` の中身を差し替えるだけ |
| コントラストの調整 | 後述 |
| MOMOKAの宣材写真 | `data/lpContent.ts` の `author.imageSrc` に渡すだけ |
| PDF表紙画像 | `<BookCover imageSrc="..." />` |
| ユーザーテスト | `01` §86 の7項目 |
| 配点の見直し | 実データを見てから |

### 計測イベント（接続済み・送信はしない）

```
lp_view / lp_cta_click(hero|middle|final) / diagnosis_view / diagnosis_start
/ question_answer / diagnosis_complete / line_cta_click / diagnosis_restart
```

`diagnosis_complete` は MAIN / SUB / GOAL / STYLE / routeId を含みます。
**個人情報は送りません。**

### コントラストの既知の課題（未対応・報告済み）

デザイン変更になるため手を入れていません。

| 対象 | 現在の比 | 基準 |
| --- | --- | --- |
| **ターコイズの英字ラベル（白背景）** | **1.77** | 4.5 |
| 補助テキスト BLACK 45% | 3.16 | 4.5 |
| 補助テキスト BLACK 40% | 2.71 | 4.5 |
| ダーク部の WHITE 40% | 3.76 | 4.5 |

影響が最も大きいのはターコイズの英字ラベルです。装飾的なラベルのため
情報理解は妨げませんが、明るい環境では読みづらくなります。
**対応する場合はユーザーの判断が必要です。**

---

## 16. 次にやる作業（優先順位順）

| 順位 | やること | 担当 |
| --- | --- | --- |
| **1** | 公式LINEアカウントを作成しURLを取得 | MOMOKAさん |
| **2** | **`creator_side` の攻略BOOKを1冊完成させる** | MOMOKAさん |
| **3** | スマホで読んでBOOKの構成を確定 | MOMOKAさん |
| **4** | 残り14ルートへ展開 | MOMOKAさん |
| 5 | Vercelへデプロイ・本番URL決定 | 実装側 |
| 6 | LINE URLを設定して実機で受け取りまで通す | 一緒に |
| 7 | 少人数（3〜5名）にテスト依頼 | MOMOKAさん |
| 8 | OGP画像・アクセス解析を追加 | 実装側 |
| 9 | 一般公開 | — |

**Webアプリ側は待機状態にできます。** 1と2はMOMOKAさんにしか作れないものです。

---

## 17. 攻略BOOK制作について決まっている仕様

**出典: `docs/05_roadmaps.md` / `docs/06_pdf-spec.md`**

### 基本

| 項目 | 内容 |
| --- | --- |
| 名称 | あなた専用 AIキャリア攻略BOOK |
| サブタイトル | 診断結果から始める、最初の7日間実践ロードマップ |
| ページ数の目安 | 25〜40ページ |
| サイズ | A4縦 |
| 容量 | 10〜20MB以内 |
| 冊数 | **15冊**（MAIN TYPE × GOAL） |

### 15ルート

```
smart_worker_work / smart_worker_side / smart_worker_both
creator_work      / creator_side      / creator_both
supporter_work    / supporter_side    / supporter_both
producer_work     / producer_side     / producer_both
builder_work      / builder_side      / builder_both
```

### 構成（31パート）

```
01 表紙 / 02 使い方 / 03 AI仕事診断書 / 04 AI活用スコア
05 MAIN TYPE / 06 SUB TYPE / 07 MAIN × SUB / 08 YOUR GOAL
09 強み / 10 注意ポイント / 11 向いているAI活用 / 12 おすすめAIツール
13 向いている仕事 / 14 おすすめ学習順 / 15 今やらなくていいこと
16 今日やること / 17〜23 Day1〜Day7 / 24 7日間振り返り
25 30日 / 26 90日 / 27 AIツール早見表 / 28 実践プロンプト集
29 AIに任せる？チェックリスト / 30 次のステップ / 31 最後のメッセージ
```

### 各Dayの共通項目

```
DAY NUMBER / TODAY THEME / WHY / ACTION / WORK / SUPPORT / DONE CONDITION / LINE REPORT
```

- 各Dayの所要時間は **15〜30分**
- 「1テーマ・1アクション・1完了」を基本にする
- 7日間の目的は習得ではなく **最初の小さな成果を作ること**

### 重要な方針

| 方針 | 内容 |
| --- | --- |
| ロードマップの分岐 | **MAIN × GOAL のみ**。MAIN × SUB × GOAL まで細分化しない |
| SUB TYPE の扱い | 表紙・診断書・サブタイプ解説・MAIN×SUB説明に反映。ロードマップ本体は変えない |
| 使ってはいけない表現 | 「あなたの適職」「絶対に成功する」「月○万円稼げる」「科学的」 |
| 「弱点」という語 | 使わない。「注意ポイント」「つまずきやすいところ」 |
| ツール情報 | 料金や最新機能を詳しく書きすぎない（変化するため） |
| 個人名 | Ver.1では自動挿入しない。Diagnosis ID / MAIN / SUB / GOAL で専用感を出す |

### Webアプリ側から使えるデータ

**文章はすべて `data/` にあります。ゼロから書き直さないでください。**

| データ | 内容 |
| --- | --- |
| `data/resultTypes.ts` | 5タイプの全文（強み5 / 注意5 / 活用 / 仕事 / ツール / 学習順8 / 今日の一歩 / 30日 / 90日） |
| `data/resultCombinations.ts` | 20組み合わせ（名称 / ONE LINE / 説明 / 強み / BEST USE / WATCH OUT / FIRST DIRECTION） |
| `data/goals.ts` | 3GOALの説明 |

`05_roadmaps.md` に15ルートすべての Day1〜Day7 の骨格があります。
PDF制作では、そこへ詳細解説・図解・ワーク・プロンプト・完成例を追加します。

---

## 18. creator_side から1冊目を作る方針

**出典: `docs/06_pdf-spec.md` §103-104**

### なぜ creator_side からか

- MOMOKAブランドと相性が強い
- 制作・副業ユーザー向け
- 図解や作品例を入れやすい
- 今後の商品導線のテストができる

### 制作の順序（守ってください）

```
1. PDF共通テンプレートを作る
   ↓
2. creator_side で完全版を1冊制作
   ↓
3. 実際にスマホで読む
   ↓
4. 修正
   ↓
5. テンプレート確定
   ↓
6. 残り14ルートへ展開
```

**最初から15冊を並行して作らないでください。**
後からデザイン修正が発生すると15冊すべて直すことになります。

### creator_side のロードマップ（`05_roadmaps.md` ROUTE 05）

7日後のゴール: **人に見せられる作品を1つ完成。**

```
Day1 制作ジャンルを決める（1つだけ）
Day2 ターゲットを決める
Day3 参考作品を5つ集める
Day4 AIと構成を作る
Day5 制作（まず完成優先）
Day6 改善（スマホ/PC確認・AIレビュー）
Day7 公開
```

- 30日後: 作品3つ + 簡易ポートフォリオ
- 90日後: 初案件 / 商品化 / 制作サービス のいずれかへ
- 今やらなくていいこと: 10ジャンル制作 / 完璧なポートフォリオ / 高度なプログラミング / 大量資格

### 完成の判断基準（`06` §105）

以下がすべて満たされているか確認します。

```
有料でも買いたいと思える？
保存したい？ / あとで見返したい？ / 実際に書き込める？
今日何をするか分かる？ / 7日間続けられそう？ / 次の学習へ進みたい？
```

1つでも弱ければ改善します。

### 最重要

**「無料なのに情報が多い」ではなく「無料なのに、本当に前へ進めた」** と
思われるPDFを目指します（`06` §106）。

---

## 19. 困ったときの確認先

| 知りたいこと | 参照先 |
| --- | --- |
| 診断の画面・導線 | `docs/01_diagnosis-spec.md` |
| 採点・タイブレーク・STYLE | `docs/02_scoring-system.md` |
| 質問文・加点先 | `docs/03_question-bank.md` |
| 5タイプの文章 | `docs/04_result-types.md` |
| MAIN × SUB 20パターン | `docs/04_result-combinations.md` |
| 15ルートの7日間 | `docs/05_roadmaps.md` |
| PDF仕様 | `docs/06_pdf-spec.md` |
| LINE運用 | `docs/07_line-flow.md` |
| Web技術・デザイン | `docs/08_web-spec.md` |
| LP構成・コピー | `docs/09_lp.md` |
