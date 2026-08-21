# AIキャリアスターターキット｜公開作業の引き継ぎ

> このファイルは **公開（Vercelデプロイ）フェーズ専用**の引き継ぎです。
>
> プロダクト全体の仕様・確定事項・禁止事項は
> **`docs/HANDOFF.md` に書いてあります。先にそちらを読んでください。**
>
> 最終更新: 2026-08-11 / BOOK CODE実装完了・Vercel未デプロイ

---

## 0. いまどこにいるか

診断アプリは**全機能が完成**しています。攻略BOOK15冊も**別工程で完成済み**です。

残っているのは **「Vercelへ限定公開して、本番で通しQAする」** ことだけです。

```
[完了] LP / 診断 / 結果画面 / デザイン / レスポンシブ
[完了] 攻略BOOK 15冊（FINAL版・別工程）
[完了] 公式LINE URL の取得と設定（ローカル）
[完了] BOOK CODE 実装（どの1冊を送るか結果カードで判別できる）
    ↓
[これから] GitHubリポジトリ作成 → Vercel限定公開 → 本番QA
```

---

## 1. 絶対に変更してはいけないもの

**次のセッションで、以下に手を入れないでください。**
公開作業でこれらを触る必要はありません。

| 対象 | 理由 |
|---|---|
| **攻略BOOK15冊のPDF本文** | **別工程でFINAL版として完成済み。** 内容の変更・再生成をしない |
| 診断ロジック（採点・タイブレーク） | ユーザー確認済みで確定 |
| 質問文・選択肢・加点先（`data/questions.ts`） | 仕様書から逐語転記済み |
| 結果文章（`data/resultTypes.ts` / `resultCombinations.ts`） | 同上 |
| STYLE判定・閾値（`STYLE_THRESHOLD = 10`） | 全78,125通りの実測を経て決定 |
| SUB TYPE判定 | 同上 |
| **BOOK CODE の仕様** | 15冊の配布に直結。**表記・区切り文字・生成規則を変えない** |
| 結果画面のセクション順 | 確定済み |
| LPの8ブロック構成 | 確定済み |
| ブランドカラー8色 | 確定済み |

詳細は `docs/HANDOFF.md` の「13. これまでに確定した判断」「14. 変更してはいけない仕様」を参照。

---

## 2. BOOK CODE の実装完了状況

### 何のためのものか

Ver.1では **PDFを自動配布しません。** 公式LINEへ送られてきたスクリーンショットを見て、
MOMOKAさんが該当する1冊を手で送ります。

そのとき **「15冊のうちどれを送ればよいか」** をスクショから読み取るための表示です。

### 実装状況：**完了**

| ファイル | 内容 |
|---|---|
| `lib/resultLabels.ts` | `getBookCode()` — MAIN × GOAL からコードを生成 |
| `components/result/ResultShareCard.tsx` | フッターに1行で表示 |
| `lib/__tests__/resultContent.test.ts` | テスト4件（一意性・不変性・対応・区切り文字） |

生成ロジックは1関数のみです。

```ts
export function getBookCode(result: DiagnosisResult): string {
  const main = getMainType(result);
  const goal = getGoal(result);
  const mainCode = main.englishName.replace(/^AI\s+/, "");  // AI CREATOR -> CREATOR
  return `${mainCode} / ${goal.englishName}`;               // -> "CREATOR / SIDE"
}
```

---

## 3. 15 routeId ↔ BOOK CODE 対応

**15通りすべて一意。テストと実画面の両方で確認済みです。**

| BOOK CODE（画面表示） | routeId（内部・PDFファイル名） |
|---|---|
| `SMART WORKER / WORK` | `smart_worker_work` |
| `SMART WORKER / SIDE` | `smart_worker_side` |
| `SMART WORKER / BOTH` | `smart_worker_both` |
| `CREATOR / WORK` | `creator_work` |
| `CREATOR / SIDE` | `creator_side` |
| `CREATOR / BOTH` | `creator_both` |
| `SUPPORTER / WORK` | `supporter_work` |
| `SUPPORTER / SIDE` | `supporter_side` |
| `SUPPORTER / BOTH` | `supporter_both` |
| `PRODUCER / WORK` | `producer_work` |
| `PRODUCER / SIDE` | `producer_side` |
| `PRODUCER / BOTH` | `producer_both` |
| `BUILDER / WORK` | `builder_work` |
| `BUILDER / SIDE` | `builder_side` |
| `BUILDER / BOTH` | `builder_both` |

**変換規則：** 小文字にして、スペースと ` / ` をアンダースコアへ置換するだけ。

### 重要な性質

- BOOK CODE は **MAIN TYPE と GOAL だけ**で決まる
- **SUB TYPE と STYLE は影響しない**（テストで保証済み）
- BOOK CODE が読めなくても、カード上部の MAIN TYPE と GOAL から判別できる（二重の手段）

---

## 4. BOOK CODE の表示位置・レスポンシブ仕様

### 表示位置

結果カード（`ResultShareCard`）の**フッター区画**。診断IDと同じ「管理情報」のまとまりに置いています。

```
AI 仕事診断書                          [アイコン]
MAIN TYPE
AI SMART WORKER
AIスマートワーカー
──────────────────────────
STYLE
SMART WORKER × BUILDER HYBRID        ← ターコイズ・18px太字
──────────────────────────
GOAL                        本業＋副業
SUB TYPE                    AI BUILDER
│ AIを仕事で使い、さらに仕組みとして定着させる人。
──────────────────────────
BOOK CODE      SMART WORKER / BOTH   ← 白・12px（ここ）
AI-260811-K4M2     AI CAREER STARTER KIT
                            by MOMOKA
```

### 見間違いを防ぐための設計（変更しないこと）

| 項目 | 区切り | 色 | 大きさ | 位置 |
|---|---|---|---|---|
| STYLE | `×` | ターコイズ | 18px 太字 | カード中央 |
| SUB TYPE | — | 白85% | 14px | GOALの下 |
| **BOOK CODE** | **`/`** | **白100%** | **12px** | **フッター** |

`SMART WORKER × BUILDER HYBRID` と `SMART WORKER / BOTH` を取り違えないよう、
**区切り文字・色・位置の3点で分離**しています。

### レスポンシブ実測（最長ケース `SMART WORKER / BOTH`）

| 幅 | 想定端末 | カード高さ | 横スクロール | はみ出し | BOOK CODE |
|---|---|---|---|---|---|
| 320px | 最小 | 651px | なし | 0 | 表示 |
| 375px | iPhone SE | 625px | なし | 0 | 表示 |
| 390px | iPhone 14 | 625px | なし | 0 | 表示 |
| 430px | iPhone Pro Max | 571px | なし | 0 | 表示 |
| 768px | iPad | 570px | なし | 0 | 表示 |
| 1024px | iPad横 | 570px | なし | 0 | 表示 |
| 1280px | PC | 570px | なし | 0 | 表示 |
| 1440px | PC大 | 570px | なし | 0 | 表示 |

**15ルートすべてを320pxで表示し、崩れ0件**も確認済みです。

### なぜフッターへ入れたか（重要な設計判断）

最初は独立した枠として実装しましたが、**カードが689pxまで伸びました。**

BOOK CODE はカード下部にあるため、小型端末でスクリーンショットの下端が切れると
**配布に必要な情報が失われます。**

| 実装 | 375px時のカード高さ |
|---|---|
| BOOK CODE 追加前 | 605px |
| 独立枠で追加（**不採用**） | 679px |
| **フッターへ統合（採用）** | **625px** |

**この理由でフッターに置いています。独立枠へ戻さないでください。**

---

## 5. commit `5d71a04` の内容

```
feat(result): add BOOK CODE to the share card
```

| ファイル | 変更 |
|---|---|
| `lib/resultLabels.ts` | `getBookCode()` を追加 |
| `components/result/ResultShareCard.tsx` | フッターにBOOK CODEの行を追加 |
| `lib/__tests__/resultContent.test.ts` | テスト4件追加（150件 → 154件） |

**診断ロジック・質問・結果文章・STYLE判定・SUB TYPE判定は変更していません。**

---

## 6. commit `79299bd` と `docs/pdf-drafts/`（**次セッションで要調査**）

```
docs: add creator_side career book drafts
```

### 経緯

BOOK CODE のコミット時、`git add -A` によって未追跡だった `docs/pdf-drafts/` が
一緒にステージされました。コミットメッセージと内容が食い違うため、**別コミットへ分離**しました。

**このディレクトリは前セッションのClaudeが作成したものではありません。**
セッション外で作られたものが未追跡のまま残っていました。

### 分かっていること

| 項目 | 内容 |
|---|---|
| 場所 | `docs/pdf-drafts/` |
| サイズ | 380KB / 20ファイル |
| 中身 | `creator_side` の原稿（v1〜v5 final）・デザイン仕様・デザインシステム・プロトタイプHTML/CSS |
| **アプリからの参照** | **なし**（`app/` `components/` `lib/` `data/` `hooks/` `types/` `next.config.ts` を検索して0件） |
| **ビルド成果物への混入** | **なし** |
| **build/runtimeへの必要性** | **不要** |

### 分かっていないこと（調査してください）

1. **FINAL版15冊との関係** — このドラフトはFINAL版の元になったものか、それとも破棄された旧案か
2. **Git管理を続けるべきか** — 制作記録として残すか、リポジトリから外すか
3. **公開リポジトリに置いてよいか** — 商品（有料級コンテンツ）の原稿が含まれるため、
   **GitHubをPublicにする場合は特に確認が必要**

### 次セッションでの扱い

**判断がつくまで削除しないでください。** ユーザーに確認してから決めます。

なお、**Vercelデプロイには影響しません**（参照ゼロ・ビルド対象外）。
公開作業を止める要因にはなりません。

---

## 7. 公式LINE

| 項目 | 値 |
|---|---|
| **友だち追加URL** | **`https://lin.ee/vepNrqwH`** |

### `.env.local` の設定状況

**ローカルには設定済みです。**

```
# ~/Developer/ai-career-starter-kit/.env.local
NEXT_PUBLIC_LINE_URL=https://lin.ee/vepNrqwH
```

### 重要：Vercelには別途登録が必要

`.env.local` は `.gitignore` されているため **デプロイされません。**

**Vercelのプロジェクト設定で、同じ環境変数を登録してください。**

```
Key:   NEXT_PUBLIC_LINE_URL
Value: https://lin.ee/vepNrqwH
```

登録を忘れると、本番の結果画面でCTAが
**「公式LINEは準備中です」の押せないボタン**になります。事故にはなりませんが、導線が成立しません。

---

## 8. LINE CTAの動作確認結果（ローカル）

| 項目 | 結果 |
|---|---|
| リンクとして描画 | **OK**（`<button disabled>` から `<a>` へ切り替わった） |
| `href` | `https://lin.ee/vepNrqwH` |
| `target` | `_blank` |
| `rel` | `noopener noreferrer` |
| ボタン高さ | 60px（タップ領域48px以上） |
| 「公式LINEは準備中です」 | 表示されない（正常） |
| 見た目 | ターコイズの有効ボタン |

**コード変更なしで、環境変数だけで切り替わることを確認しました。**

### 未確認

**iPhone実機でLINEアプリが実際に開くか**は未検証です。
デスクトップブラウザでは友だち追加ページが開くところまでしか確認できません。
**本番QAで必ず実機確認してください。**

---

## 9. 品質チェックの結果（`5d71a04` 時点）

| コマンド | 結果 |
|---|---|
| `npm run typecheck` | **エラー0** |
| `npm run lint` | **エラー0・警告0** |
| `npm run test` | **154件すべてPASS**（8ファイル） |
| `npm run build` | **成功**（`/` `/diagnosis` `/_not-found` を静的生成） |

**公開前は必ず `build` まで通してください。**
テストが通っても型エラーでビルドが落ちた実例があります。

---

## 10. 現在の未対応事項

| 項目 | 状態 | 今回やるか |
|---|---|---|
| **Vercelデプロイ** | **未実施** | **やる** |
| **GitHubリポジトリ** | **未作成（リモート未設定）** | **やる** |
| **`metadataBase`** | **未設定** | **本番URL確定後にやる** |
| **OGP画像** | **未実装** | **今回やらない** |
| **アクセス解析** | **no-op のまま** | **今回やらない** |
| 独自ドメイン | 未定 | 限定テスト後に判断 |
| PDF自動配布 | 未実装 | Ver.1では実装しない |

### GitHubリモートの状態（実測）

```bash
$ git remote -v
（出力なし = リモート未設定）

$ git branch --show-current
main

$ git status --short
（出力なし = 全てコミット済み）
```

**ローカルGitのみです。Vercel連携の前にGitHubリポジトリの作成とpushが必要です。**

### OGP・アクセス解析について

どちらも**受け口は実装済み**で、後から数行足すだけで有効になります。

| 項目 | 場所 | やること |
|---|---|---|
| OGP画像 | `app/layout.tsx` の `openGraph` | `images` を追加 |
| アクセス解析 | `lib/analytics.ts` の `track()` | 中身を差し替え（呼び出しは全箇所完了済み） |

**今回のスコープ外です。触らないでください。**

---

## 11. 次セッションで行う作業

**この順番で進めてください。**

### 1. GitHubリポジトリの接続状態を確認

```bash
cd ~/Developer/ai-career-starter-kit
git remote -v
git status --short
git log --oneline | head -5
```

**現時点ではリモート未設定です。** Vercel連携にはGitHubリポジトリが必要なので、
リポジトリを作成して push します。

**確認すること：**
- **Public にするか Private にするか**
  → `docs/pdf-drafts/`（商品の原稿）が含まれるため、**Private を推奨**
  → ユーザーに必ず確認してから作成する

### 2. `docs/pdf-drafts/` の調査

「6.」に書いた**分かっていないこと3点**を調べ、ユーザーへ確認します。

- FINAL版15冊との関係
- Git管理を続けるか
- 公開リポジトリに置いてよいか

**判断がつくまで削除しない。** デプロイはこれと並行して進められます。

### 3. Vercelサブドメインで限定公開

独自ドメインは使いません。Vercelが発行するサブドメインで公開します。

### 4. Vercelに環境変数を登録

```
NEXT_PUBLIC_LINE_URL = https://lin.ee/vepNrqwH
```

**Production / Preview の両方**に設定してください。

### 5. 初回デプロイ

### 6. 発行されたURLで `metadataBase` を設定

`app/layout.tsx` に追加します。

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://<発行されたURL>"),
  // 以下は既存のまま
};
```

### 7. 再デプロイ

### 8. 本番でQA

**必ず実機（iPhone）で通してください。**

```
LP を開く
  ↓
「無料でAI仕事診断をはじめる」を押す
  ↓
10問すべて回答する
  ↓
結果画面が表示される
  ↓
BOOK CODE が読める（例: CREATOR / SIDE）
  ↓
結果をスクリーンショット
  ↓
「専用攻略BOOKを受け取る」を押す
  ↓
公式LINEが開く（LINEアプリが起動するか）
```

### 9. PC / スマートフォンの基本表示確認

| 端末 | 確認内容 |
|---|---|
| PC | LP・診断・結果が崩れない |
| スマートフォン | 同上 ＋ **診断書カードが1画面に収まりBOOK CODEが読める** |

---

## 12. QAで特に見るべきポイント

| # | 項目 | 期待 |
|---|---|---|
| 1 | LINE CTA | 押せる状態（「準備中です」が出ていない） |
| 2 | LINE遷移 | 実機でLINEアプリが開く |
| 3 | **BOOK CODE** | スクショで読める。MAIN・GOALと一致している |
| 4 | STYLEとの混同 | `×` と `/` が別物として読める |
| 5 | 結果の復元 | 再読み込みしても同じ結果が出る |
| 6 | 再診断 | 確認ダイアログ → やり直すで最初へ戻る |
| 7 | LP → 診断 | 3箇所のCTAすべてが `/diagnosis` へ遷移 |

---

## 13. トラブル時の確認先

| 症状 | 疑うところ |
|---|---|
| CTAが「準備中です」のまま | Vercelの環境変数が未登録／再デプロイしていない |
| 結果画面が真っ白 | JavaScriptが読めていない。ブラウザのコンソールとNetworkを確認 |
| BOOK CODEが表示されない | `getBookCode` の呼び出し。ただしローカルでは全15ルート確認済み |
| OGPが出ない | `metadataBase` 未設定（今回の作業6で設定する） |

> **参考：** 開発中にiPhoneで診断画面が真っ白になった事例があります。
> 原因は「Next.js開発サーバーがLAN経由のJavaScriptをブロックしていた」ことで、
> `next.config.ts` の `allowedDevOrigins` で解決済みです。
> **これは開発時のみの設定で、本番には影響しません。**
> 詳細は `docs/HANDOFF.md` の「12.」を参照。

---

## 14. 環境

| 項目 | 値 |
|---|---|
| 場所 | `~/Developer/ai-career-starter-kit` |
| Node.js | v24.14.0 |
| Next.js | 16.3.0（App Router / Turbopack） |
| ブランチ | `main` |
| リモート | **未設定** |

**iCloud Driveの同期対象外に置いてください。** デスクトップ配下に置くと
`node_modules` が同期対象になり、ビルドもテストも応答しなくなります。

```bash
npm run dev        # 開発サーバー
npm run build      # 本番ビルド
npm run typecheck  # 型チェック
npm run lint       # ESLint
npm run test       # テスト（154件）
```

---

## 15. 直近のコミット履歴

```
79299bd docs: add creator_side career book drafts     ← 要調査（6.参照）
5d71a04 feat(result): add BOOK CODE to the share card ← 今回の実装
a3acf6a docs: add handoff document for next session
de982be chore: final pass before release              ← STEP10完了
fd37e59 fix(dev): allow LAN devices to load dev resources
```
