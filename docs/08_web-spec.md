# AIキャリアスターターキット｜Web Specification

## 1. ファイル概要

### ファイル名
`08_web-spec.md`

### 目的

AIキャリアスターターキット内で使用する、

**AI仕事診断Webアプリ**

の技術仕様・画面仕様・デザイン仕様・コンポーネント構成・データ構造・状態管理・レスポンシブ・結果画面・LINE導線を定義する。

このファイルを、

- Claude Code
- Codex

へ読み込ませることで、

診断Webアプリを実装できる状態にする。


---

# 2. 開発ゴール

Ver.1では、

以下のユーザー体験を完成させる。


```text
診断TOP
↓
診断開始
↓
Q1〜Q10
↓
診断計算
↓
診断結果
↓
MAIN TYPE
SUB TYPE
STYLE
GOAL
AI活用スコア
↓
スクリーンショット
↓
公式LINE
↓
専用PDF受取
```


---

# 3. 開発優先順位

最優先：

```text
1.
診断が正常に動く

2.
採点が正しい

3.
スマホで使いやすい

4.
結果が分かりやすい

5.
スクリーンショットしたくなる

6.
公式LINEへ進みやすい

7.
ブランドとして見栄えが良い
```


デザイン演出より、

**診断機能の安定性を先に完成させる。**


---

# 4. 推奨技術構成

Ver.1推奨：

```text
Next.js

TypeScript

Tailwind CSS
```


必要に応じて：

```text
Framer Motion
Recharts
Lucide Icons
```


を使用可能。


---

# 5. Next.js構成

推奨：

```text
Next.js App Router
```


ディレクトリ例：


```text
app/

├── page.tsx
│
├── diagnosis/
│   └── page.tsx
│
└── result/
    └── page.tsx
```


ただし、

Ver.1では診断全体を、

```text
/diagnosis
```

1ページ内の状態管理で実装してもよい。


---

# 6. 推奨URL

```text
/
```

サービス紹介。


```text
/diagnosis
```

診断本体。


```text
/result
```

診断結果。


または、

診断本体と結果を、

```text
/diagnosis
```

内で管理してもよい。


---

# 7. Ver.1推奨画面構成

実装をシンプルにするため、

以下を推奨。


```text
/

Landing Page

↓

/diagnosis

intro
↓

question
↓

calculating
↓

result
```


診断本体は、

1ページ内でstateによって切り替える。


---

# 8. 診断状態

内部state例：


```ts
type DiagnosisScreen =
  | "intro"
  | "question"
  | "calculating"
  | "result";
```


---

# 9. プロジェクト構成

推奨：


```text
AI-career-starter-kit/

├── app/
│   ├── page.tsx
│   ├── diagnosis/
│   │   └── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── diagnosis/
│   │   ├── DiagnosisIntro.tsx
│   │   ├── DiagnosisQuestion.tsx
│   │   ├── AnswerCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DiagnosisLoading.tsx
│   │   ├── DiagnosisResult.tsx
│   │   ├── ResultShareCard.tsx
│   │   ├── ScoreRadarChart.tsx
│   │   ├── TypeSummary.tsx
│   │   ├── CombinationSummary.tsx
│   │   ├── GoalSummary.tsx
│   │   └── LineCTA.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Section.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── data/
│   ├── questions.ts
│   ├── resultTypes.ts
│   ├── resultCombinations.ts
│   └── goals.ts
│
├── lib/
│   ├── scoring.ts
│   ├── diagnosisStorage.ts
│   ├── resultId.ts
│   └── constants.ts
│
├── types/
│   └── diagnosis.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── og/
│
└── docs/
```


---

# 10. データとUIを分離する

重要。

質問・結果文章・採点情報を、

Reactコンポーネントへ直接書き込まない。


使用：


```text
data/questions.ts

data/resultTypes.ts

data/resultCombinations.ts

data/goals.ts
```


目的：

- 質問修正
- 結果修正
- 採点変更
- テスト
- 将来アップデート

を簡単にする。


---

# 11. デザインコンセプト

キーワード：

```text
SMART

CAREER

AI

TRUST

FUTURE

PREMIUM

CLEAN
```


日本語イメージ：

```text
洗練

信頼

未来感

仕事

成長

知的

上質
```


---

# 12. デザインで避けるもの

```text
AIっぽすぎるサイバー空間

ネオンだらけ

ゲームUIすぎる

占いサイト

ポップすぎる診断

子ども向け

派手なグラデーション乱用

3D演出の乱用
```


---

# 13. ブランドカラー

指定カラー：

```text
BLACK

WHITE

BLUE

TURQUOISE BLUE
```


この4色を基本にする。


---

# 14. Color System

## BLACK

用途：

- メインテキスト
- ダーク背景
- ヘッダー
- 強調


候補：

```css
--black: #080B10;
```


または：

```css
--black-soft: #10141B;
```


---

# 15. WHITE

用途：

- メイン背景
- カード
- 文字
- 余白


```css
--white: #FFFFFF;
```


オフホワイト候補：

```css
--white-soft: #F7F9FC;
```


---

# 16. BLUE

メインアクセント。

用途：

- CTA
- MAIN TYPE
- リンク
- プログレス
- 見出しアクセント


候補：

```css
--blue: #176BFF;
```


少し深い青：

```css
--blue-dark: #0B46C5;
```


---

# 17. TURQUOISE BLUE

サブアクセント。

用途：

- SUB TYPE
- スコア
- ライン
- グラフィック
- ホバー
- グラデーション


候補：

```css
--turquoise: #1CCAD8;
```


より青寄り：

```css
--turquoise-blue: #16BFD6;
```


---

# 18. メイングラデーション

青 → ターコイズブルー。


```css
background:
linear-gradient(
  135deg,
  #176BFF 0%,
  #1CCAD8 100%
);
```


用途：

- CTA
- スコアバー
- タイトルアクセント
- 診断結果カード


使用量は少なめ。


---

# 19. Dark Gradient

結果画面等で使用候補。


```css
background:
linear-gradient(
  145deg,
  #080B10 0%,
  #111C2A 60%,
  #102B35 100%
);
```


青・水色の光を、

薄く入れる。


---

# 20. Color Usage Ratio

目安：


```text
WHITE / BLACK
70%

BLUE
20%

TURQUOISE
10%
```


アクセントカラーを使いすぎず、

白黒の余白を中心にする。


---

# 21. Light / Darkの考え方

サイト全体を完全Dark Modeにしない。


推奨：

```text
診断前
WHITE BASE

↓

診断中
WHITE / BLACK

↓

診断結果
BLACK BASE
```

結果だけ少し雰囲気を変える。


理由：

**「診断結果が特別なもの」**

という演出になる。


---

# 22. Landing Page背景

基本：

```text
WHITE
```

または、

非常に薄い青系背景。


候補：

```css
#F7FAFF
```


---

# 23. 結果ページ背景

候補：

```css
#080B10
```


文字：

```text
WHITE
```


アクセント：

```text
BLUE
TURQUOISE
```


結果画面のみ、

少しプレミアム感を出す。


---

# 24. Typography

日本語：

```text
Noto Sans JP
```

または、

システムフォント。


英字：

```text
Geist
```

候補。


---

# 25. Font Hierarchy

## Hero

```text
40〜56px
```


スマホ：

```text
32〜40px
```


## H1

```text
36〜48px
```


## H2

```text
28〜36px
```


## H3

```text
20〜24px
```


## Body

```text
15〜17px
```


スマホ：

```text
15〜16px
```


---

# 26. Font Weight

```text
Hero
700

H1
700

H2
600〜700

Body
400

Highlight
600
```


---

# 27. Letter Spacing

英字ラベル：

```css
letter-spacing: 0.08em;
```


例：

```text
MAIN TYPE

AI CREATOR

YOUR GOAL
```


---

# 28. Layout Width

PC：

```css
max-width: 1200px;
```


診断カード：

```css
max-width: 720px;
```


結果カード：

```css
max-width: 680px;
```


---

# 29. Mobile First

最優先はスマホ。


想定導線：

```text
Threads
Instagram
X
LINE OpenChat
↓
Smartphone
```


PCは後から調整。


---

# 30. Breakpoints

例：


```text
sm
640

md
768

lg
1024

xl
1280
```


Tailwind標準を使用可能。


---

# 31. Header

診断ページでは、

ヘッダーをシンプルにする。


表示：

```text
AI CAREER STARTER KIT
```


右側メニューは、

診断中は基本不要。


目的：

離脱を減らす。


---

# 32. Landing Page Hero

表示候補：


```text
AIを使いたい。

でも、

「自分は何から始めればいい？」

その答えを、
10問で整理します。
```


サブ：


```text
仕事効率化・制作・副業・商品化・仕組み化。

あなたに合うAI仕事スタイルを診断。
```


CTA：

```text
無料で診断する
```


補足：

```text
全10問
約2〜3分
```


---

# 33. Hero Design

左：

```text
Text
```


右：

結果カードのモックアップ。

PC。


スマホ：

縦並び。


---

# 34. Hero Visual

結果カードをチラ見せ。


例：

```text
AI CREATOR
×
AI BUILDER
```


ただし、

タイプ一覧を全部見せない。


---

# 35. Landing Page Sections

最低限：


```text
Hero

↓

こんな悩みありませんか

↓

診断で分かること

↓

診断の流れ

↓

CTA
```


Ver.1ではLPを長くしすぎない。


---

# 36. 「こんな悩み」

例：


```text
AIを使いたいけど、
何から覚えればいいか分からない

ChatGPTは触ったけど、
仕事にどう使うか分からない

副業したいけど、
自分に何が向いているか分からない

AIツールが多すぎて、
どれを使えばいいか分からない
```


---

# 37. 診断で分かること

3〜4項目。


```text
あなたのMAIN TYPE

SUB TYPE

AI活用目的

次にすること
```


---

# 38. Diagnosis Intro

診断開始時。


表示：


```text
AI仕事診断

全10問

約2〜3分
```


メッセージ：


```text
正解はありません。

「今の自分に一番近い」

と思うものを選んでください。
```


CTA：

```text
START
```


---

# 39. Question Page

基本レイアウト：


```text
Progress

QUESTION 03 / 10

↓

Question

↓

Answer Cards

↓

Back
```


---

# 40. Progress Bar

上部固定または質問上部。


Base：

```text
薄いグレー
```


Active：

```text
BLUE → TURQUOISE
```


例：


```css
background:
linear-gradient(
  90deg,
  #176BFF,
  #1CCAD8
);
```


---

# 41. Question Number

英字：


```text
QUESTION 03 / 10
```


小さめ。


カラー：

```text
BLUE
```


---

# 42. Question Text

大きめ。


PC：

```text
28〜32px
```


スマホ：

```text
22〜26px
```


最大2〜3行程度。


---

# 43. Answer Cards

背景：

```text
WHITE
```


Border：

```text
#DCE3EC
```


角丸：

```text
16〜20px
```


Padding：

```text
18〜24px
```


---

# 44. Answer Card Hover

PC：


```text
border BLUE

軽いshadow
```


または、

薄いBlue背景。


---

# 45. Answer Selected

選択時：


```text
Border:
BLUE

Background:
薄いBlue

Check icon:
TURQUOISE
```


---

# 46. タップ領域

最低：

```text
48px以上
```


スマホで押しやすくする。


---

# 47. 回答後遷移

第一候補：

```text
Answer Tap

↓

200〜350ms

↓

Next Question
```


アニメーション：

軽いfade。


---

# 48. Back Button

質問下部。


```text
← 前の質問
```


目立たせすぎない。


---

# 49. Calculating Screen

Q10回答後。


背景：

```text
BLACK
```


中央：

```text
あなたのAI仕事スタイルを
分析しています
```


演出：


```text
AI活用タイプを整理中

↓

あなたの強みを整理中

↓

おすすめルートを作成中
```


約1〜2秒程度。


---

# 50. Loading Animation

派手にしない。


候補：

```text
Blue / Turquoiseの細いリング

Progress line

淡いpulse
```


---

# 51. Result Reveal

結果表示時：

```text
Fade Up
```

程度。


MAIN TYPEを最初に表示。


---

# 52. Result Page構成

```text
ResultShareCard

↓

Main Type

↓

Sub Type

↓

Combination

↓

AI Score

↓

Goal

↓

Strengths

↓

First Action

↓

LINE CTA
```


---

# 53. ResultShareCard

最重要コンポーネント。


目的：

```text
保存

スクショ

LINE送信

SNS共有
```


---

# 54. Result Card Size

スマホのスクリーンショットで、

1画面以内に主要情報が収まるサイズ。


縦型。


候補比率：

```text
4:5
```

または、

スマホ画面幅に合わせる。


---

# 55. Result Card Design

背景：

```text
BLACK
```


または、

Dark Gradient。


文字：

```text
WHITE
```


Main：

```text
BLUE
```


Sub：

```text
TURQUOISE
```


---

# 56. Result Card Information

以下だけ。


```text
AI仕事診断書

MAIN TYPE
AI CREATOR

SUB TYPE
AI BUILDER

GOAL
副業・収益化

STYLE
HYBRID

ONE LINE
アイデアを形にし、
さらに便利な仕組みへ育てる人。

Diagnosis ID
AI-260808-X4K9
```


---

# 57. Result Card Background Decoration

候補：

- 細いグリッド
- 抽象ライン
- ブルーのグロー
- ターコイズのグロー
- 円形グラデーション


ただし、

文字を邪魔しない。


---

# 58. Glow Example

```css
background:
radial-gradient(
  circle at 80% 10%,
  rgba(28, 202, 216, 0.18),
  transparent 35%
),
radial-gradient(
  circle at 15% 85%,
  rgba(23, 107, 255, 0.18),
  transparent 40%
),
#080B10;
```


---

# 59. MAIN Label

```text
MAIN TYPE
```


小さく。


その下：

```text
AI CREATOR
```


大きく。


---

# 60. SUB Label

MAINより小さく表示。


```text
SUB TYPE
AI BUILDER
```


---

# 61. STYLE Label

例：


```text
CREATOR × BUILDER
HYBRID
```


Badge形式も候補。


---

# 62. Result Card Brand

最下部：


```text
AI CAREER STARTER KIT
by MOMOKA
```


小さく。


---

# 63. Result Content Background

カード下の詳細部分は、

完全Darkにしなくてもよい。


候補：

```text
BLACK背景

Dark card

White text
```


または、

カード以降はWhiteへ戻す。


---

# 64. 推奨結果画面構成

ブランド感を出すため、

結果冒頭：

```text
BLACK
```


詳細：

```text
WHITE
```


へ切り替える。


例：


```text
Black Result Hero

↓

White Detail Content
```


---

# 65. Result Detail Main Type

表示：


```text
あなたのMAIN TYPE

AI CREATOR

アイデアを、AIで形にする人。
```


説明文。


---

# 66. Sub Type

カード形式。


```text
あなたの第二の強み

AI BUILDER
```


---

# 67. Combination Section

強調。


```text
YOUR STYLE

制作 × 仕組み化
```


ONE LINE。


---

# 68. Score Section

見出し：

```text
AI活用スコア
```


レーダーチャート。


---

# 69. Radar Chart Library

候補：

```text
Recharts
```


または、

SVGで自作。


Ver.1：

Rechartsでよい。


---

# 70. Radar Chart Colors

Main Line：

```text
BLUE
```


Fill：

```text
rgba(23,107,255,0.18)
```


Point：

```text
TURQUOISE
```


Grid：

薄いGray。


---

# 71. Radar Labels

日本語。


```text
仕事効率化

制作

サポート

商品化

仕組み化
```


スマホでも読めるサイズ。


---

# 72. Goal Section

```text
YOUR GOAL

副業・収益化
```


Goal Badge：

Blue/Turquoise Gradient。


---

# 73. Strength Cards

3つ程度。


例：


```text
01
アイデアを形にする

02
作りながら学ぶ

03
改善して伸ばす
```


3列 or スマホ1列。


---

# 74. First Action

かなり目立たせる。


背景：

```text
薄いBlue
```


タイトル：

```text
TODAY'S FIRST STEP
```


例：


```text
7日以内に完成させる作品を
1つだけ決めてください。
```


---

# 75. LINE CTA Section

結果画面の最重要CTA。


背景：

BlackまたはBlue。


見出し：


```text
あなた専用の
AIキャリア攻略BOOKを受け取る
```


---

# 76. LINE CTA Flow

表示：


```text
01
この結果をスクショ

↓

02
公式LINEを追加

↓

03
スクショ +
「今一番変えたいこと」
を送信

↓

04
あなた専用攻略BOOKを受け取る
```


---

# 77. LINE CTA Button

テキスト：


```text
専用攻略BOOKを受け取る
```


背景：

Blue → Turquoise Gradient。


文字：

White。


高さ：

56px前後。


角丸：

14〜18px。


---

# 78. LINE Button Hover

PC：

少し明るく。


transform：

```text
translateY(-1px)
```


程度。


---

# 79. LINE URL

環境変数管理。


```text
NEXT_PUBLIC_LINE_URL
```


コードへ直接複数記述しない。


---

# 80. Screenshot Guide

ボタン前に、


```text
先にこの結果をスクショしてください 📱
```


を表示。


必要なら、

Result Cardへスクロールするボタン。


---

# 81. Share機能

Ver.1優先：

```text
スクリーンショット
```


将来的に：

- Web Share API
- X
- Threads
- Image Download


追加可能。


---

# 82. 画像ダウンロード機能

Ver.1では必須ではない。


将来的に、

Result CardをPNG生成可能。


候補：

```text
html-to-image
```


等。


---

# 83. Result ID表示

カード下部。


形式：

```text
AI-YYMMDD-XXXX
```


---

# 84. Result ID生成

lib：


```text
lib/resultId.ts
```


例：


```ts
export function createResultId() {
  ...
}
```


個人情報は含めない。


---

# 85. localStorage

保存対象：


```text
diagnosisVersion

answers

currentQuestion

result
```


---

# 86. Storage Key

例：


```text
aiCareerDiagnosis
```


または分離：


```text
aiCareerDiagnosisAnswers

aiCareerDiagnosisResult
```


---

# 87. Diagnosis Version

```text
1.0.0
```


質問や採点変更時に更新。


---

# 88. Version不一致

保存Versionが現在Versionと異なる場合、

診断途中データをリセット。


---

# 89. Answers State

```ts
type AnswerMap = Record<string, string>;
```


例：


```json
{
  "q1": "q1_b",
  "q2": "q2_a"
}
```


---

# 90. Scoring Function

ファイル：

```text
lib/scoring.ts
```


責任：

```text
rawScore

mainType

subType

style

goal

secondaryGoal

displayScores

routeId
```


を生成。


---

# 91. scoring.tsはUIから分離

重要。


UI：

```text
選択
```


Scoring：

```text
計算
```


を完全分離。


---

# 92. Scoring Test

可能なら、

unit testを作成。


対象：


```text
Creator特化

Builder特化

Hybrid

Multi

Goal Work

Goal Side

Goal Both

Tie Break
```


---

# 93. TypeScript Types

`types/diagnosis.ts`


管理：

```ts
AIType

Goal

Style

Question

QuestionOption

DiagnosisResult
```


---

# 94. Error Handling

以下の場合、

結果へ進まない。


```text
未回答

存在しないoption

scoring failure
```


表示：


```text
診断結果の計算に失敗しました。

もう一度お試しください。
```


---

# 95. Reload

診断途中でリロード：

回答復元。


結果後リロード：

結果復元。


---

# 96. Reset

結果画面：


```text
もう一度診断する
```


押下：

確認Modal。


```text
診断結果をリセットして
最初からやり直しますか？
```


---

# 97. Animation Policy

使用：

- Fade
- Fade Up
- Progress
- 軽いScale


使用しない：

- Scroll Jack
- 自動スクロール強制
- 派手な3D
- 長時間ローディング


---

# 98. Motion Duration

目安：


```text
200〜500ms
```


診断テンポを邪魔しない。


---

# 99. Button Style

Primary：


```text
Blue → Turquoise
```


Secondary：


```text
Black / White outline
```


Tertiary：


```text
Text
```


---

# 100. Card Style

Light：

```text
White
Border
Soft Shadow
Radius 20
```


Dark：

```text
#10141B
Border rgba white
Radius 20
```


---

# 101. Shadow

薄め。


```css
box-shadow:
0 12px 40px rgba(8, 11, 16, 0.08);
```


Blue glowは結果カード等のみ。


---

# 102. Border Radius

全体：


```text
12〜24px
```


カード：

```text
20px
```


ボタン：

```text
14〜18px
```


---

# 103. Icon Library

候補：


```text
Lucide React
```


使用例：

- Sparkles
- Briefcase
- PenTool
- Users
- Package
- Blocks
- ArrowRight
- Check


---

# 104. タイプ別アイコン

## Smart Worker

```text
Briefcase
```


## Creator

```text
PenTool
```


## Supporter

```text
Users
```


## Producer

```text
Package
```


## Builder

```text
Blocks
```


---

# 105. タイプ別カラーについて

今回、

ブランドカラーを、

```text
Black
White
Blue
Turquoise
```

へ統一する。


そのため、

5タイプごとに、

紫・緑・オレンジ等を使わない。


代わりに、

タイプごとに、

- アイコン
- パターン
- ラベル
- Blue/Turquoise比率

を変える。


---

# 106. Type Visual Identity

例：


## Smart Worker

```text
Blue強め
Grid / Document motif
```


## Creator

```text
Turquoise少し強め
Freeform line
```


## Supporter

```text
Blue × White
Connected dots
```


## Producer

```text
Deep Blue
Layer / Package motif
```


## Builder

```text
Turquoise
Block / Node motif
```


---

# 107. ブランド統一優先

「タイプごとのカラフルさ」

より、

**AIキャリアスターターキットとしての統一感**

を優先する。


---

# 108. Background Graphic

ブランド共通モチーフ候補：


```text
Node

Grid

Line

Connection

Orbit

Blueprint
```


いずれも薄く使用。


---

# 109. AI感の出し方

ロボット画像等を大量に使わない。


AI感：

```text
情報

つながり

構造

光

グリッド

未来的タイポグラフィ
```


で表現。


---

# 110. Accessibility

最低限：


```text
Keyboard Navigation

Focus State

aria-label

Color Contrast

Tap Size

Text Size
```


---

# 111. Focus State

キーボード操作時：


```text
Blue outline
```


必ず表示。


---

# 112. Color Only禁止

正解・選択状態等を、

色だけで表現しない。


例：

```text
Blue Border
+
Check Icon
```


---

# 113. Loading Performance

診断サイトなので、

初期表示を重くしない。


避ける：

- 大容量動画
- 重い3D
- 大量画像


---

# 114. Image Optimization

Next.js Image等を使用。


WebP / AVIF候補。


---

# 115. Fonts

可能なら、

Next.js font最適化を使用。


---

# 116. Analytics

Ver.1で計測したいイベント：


```text
diagnosis_view

diagnosis_start

question_answer

diagnosis_complete

line_cta_click

diagnosis_restart
```


---

# 117. Analytics Parameters

診断完了時：


```text
main_type

sub_type

goal

style

route_id
```


個人情報は送信しない。


---

# 118. question_answerについて

全回答内容を外部analyticsへ送る必要はない。


Ver.1では、

```text
question_id
```

程度でもよい。


---

# 119. Funnel

```text
Landing View
↓
Diagnosis Start
↓
Complete
↓
LINE CTA Click
```


最低限これを測定。


---

# 120. SEO

診断ページは、

検索流入も将来的に想定。


Title候補：


```text
AI仕事診断｜あなたに合うAI活用方法を10問で診断
```


Description候補：


```text
仕事効率化・制作・副業・商品化・仕組み化。
10個の質問から、あなたに合うAI仕事スタイルと次の一歩を診断します。
```


---

# 121. OGP

SNS共有用画像を作る。


OGP：

```text
AI仕事診断

あなたはAIを
どう仕事に活かす？
```


Black背景

Blue / Turquoise。


---

# 122. Result OGP

動的OGPは、

Ver.1では不要。


将来的には、

タイプ別OGP生成を検討。


---

# 123. Privacy

診断で、

個人情報入力を必須にしない。


結果計算は、

ブラウザ内で完結可能。


---

# 124. Security

外部入力をほぼ扱わないため、

Ver.1はシンプル。


ただし、

- URL
- environment variables
- analytics

などは適切に管理。


---

# 125. LINE URL

`.env.local`


例：


```text
NEXT_PUBLIC_LINE_URL=
```


Gitへ秘密情報を書かない。


---

# 126. 本番URL

Vercel等を候補。


例：


```text
career.momoka-ai.jp
```


または、

MOMOKAサイト配下。


確定は後。


---

# 127. Hosting

候補：

```text
Vercel
```


Next.jsとの相性を考えて選定可能。


---

# 128. Domain

Ver.1では、

独自ドメインがなくてもテスト可能。


正式公開前に、

ブランドURLを検討。


---

# 129. Development Flow

```text
docs完成

↓

Claude Code / Codexへ投入

↓

診断ロジック実装

↓

質問UI

↓

結果UI

↓

デザイン

↓

スマホテスト

↓

ユーザーテスト

↓

公開
```


---

# 130. 実装順

## STEP 1

Project Setup


## STEP 2

Types


## STEP 3

Question Data


## STEP 4

Scoring Logic


## STEP 5

Diagnosis UI


## STEP 6

Result UI


## STEP 7

localStorage


## STEP 8

LINE CTA


## STEP 9

Responsive


## STEP 10

Animation


## STEP 11

Testing


---

# 131. Claude Code / Codexへの実装方針

AIへ最初に全機能を一気に作らせない。


推奨：


```text
1
README/docsを読ませる

↓

2
プロジェクト構造だけ作る

↓

3
診断データ

↓

4
採点テスト

↓

5
UI

↓

6
結果

↓

7
デザイン
```


---

# 132. 最初の実装確認

まず、

デザインなしでもいいので、

以下を確認。


```text
Q1〜Q10回答

↓

MAIN

SUB

GOAL

STYLE

Score

routeId
```


これが正しく出ること。


---

# 133. デザイン実装はその後

採点確認後、

Black / White / Blue / Turquoise

のデザインを適用。


理由：

ロジック修正とデザイン修正を同時にすると、

問題原因が分かりにくくなる。


---

# 134. Test Routes

必ず以下をテスト。


```text
smart_worker_work

creator_side

supporter_side

producer_side

builder_work

creator_builder hybrid

multi
```


---

# 135. Mobile Test Width

最低限：


```text
320px

375px

390px

430px
```


---

# 136. Tablet Test

```text
768px
```


---

# 137. Desktop Test

```text
1280px

1440px
```


---

# 138. Screenshot Test

結果カードを、

実際のiPhone等でスクリーンショット。


確認：


```text
MAIN読める？

SUB読める？

GOAL読める？

ONE LINE読める？

ブランドが分かる？

情報が多すぎない？
```


---

# 139. LINE CTA Test

スマホ実機で、


```text
結果
↓
LINEボタン
↓
公式LINE
```


がスムーズか確認。


---

# 140. UXで最重要

ユーザーに、

```text
次どこ押すん？
```

と思わせない。


各画面、

次の行動を1つにする。


---

# 141. Diagnosis Screen CTA

基本、

回答カードだけ。


---

# 142. Result CTA

メイン：

```text
攻略BOOKを受け取る
```


サブ：

```text
もう一度診断する
```


SNS共有は、

それより下。


---

# 143. Ver.1でやらないこと

```text
ログイン

会員登録

データベース保存必須化

AIチャット

PDF自動生成

LINE API連携

複雑なアニメーション

3D
```


---

# 144. Ver.2候補

```text
結果カードPNG生成

SNSシェア

ユーザー名入力

PDF自動生成

LINE連携

診断履歴

3か月後再診断
```


---

# 145. Web App完成条件

- [ ] Next.js setup
- [ ] TypeScript
- [ ] Tailwind
- [ ] Landing
- [ ] Diagnosis intro
- [ ] Q1〜Q10
- [ ] Progress
- [ ] Back
- [ ] localStorage
- [ ] Scoring
- [ ] Tie break
- [ ] MAIN
- [ ] SUB
- [ ] STYLE
- [ ] GOAL
- [ ] Scores
- [ ] Result ID
- [ ] Result Card
- [ ] Main Result
- [ ] Sub Result
- [ ] Combination Result
- [ ] Radar Chart
- [ ] First Action
- [ ] Screenshot Guide
- [ ] LINE CTA
- [ ] Restart
- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] Error Handling
- [ ] Analytics events
- [ ] Accessibility basics


---

# 146. Design完成条件

以下を満たす。


```text
Black / White / Blue / Turquoiseで統一

余白がある

仕事向けに見える

AI感がある

サイバーすぎない

スマホで綺麗

結果をスクショしたい

無料診断に見えすぎない
```


---

# 147. 最終デザインイメージ

イメージ：


```text
Apple系の余白

+

AIスタートアップの未来感

+

ビジネスツールの信頼感

+

MOMOKAらしいBlue/Turquoise
```


「かわいいAI診断」

ではなく、

**キャリアサービスに見えるAI診断**

を目指す。


---

# 148. 最重要原則

このWebサイトは、

診断機能そのものだけではない。


ユーザーが最初に、

```text
MOMOKAって
ちゃんとしてるな
```

と思う場所になる。


そのため、

デザインと体験の両方で、

**無料プレゼント以上の品質**

を目指す。


最終的に、

```text
診断して楽しかった
```

だけではなく、

```text
自分の方向が分かった

↓

攻略BOOKが欲しい

↓

実際に7日間やってみたい
```

まで自然に進めるWeb体験にする。


---

# Status

Version: 0.1.0

Phase: Web Specification

Brand Colors:
BLACK / WHITE / BLUE / TURQUOISE BLUE

Status: COMPLETE

Next:
`09_lp.md`