# AIキャリアスターターキット｜Scoring System

## 1. ファイル概要

### ファイル名
`02_scoring-system.md`

### 目的
AI仕事診断の採点ロジックを定義する。

このファイルでは、

- Q1〜Q7のタイプ採点
- Q8〜Q10の目的採点
- MAIN TYPE判定
- SUB TYPE判定
- STYLE判定
- GOAL判定
- SECONDARY GOAL判定
- AI活用スコア変換
- 同点処理
- 境界値処理
- 実装用データ構造
- テストケース

を定義する。

質問本文は、

`03_question-bank.md`

で管理する。


---

# 2. 基本思想

この診断は、

科学的・心理学的な適性検査ではない。

目的は、

**回答傾向から、ユーザーがAIをどう活用すると行動しやすいかを整理すること。**

そのため、

「絶対にこのタイプ」

と断定するのではなく、

- MAIN TYPE
- SUB TYPE
- STYLE
- GOAL

を組み合わせて結果を提示する。


---

# 3. タイプID

採点対象は以下5タイプ。


## AIスマートワーカー

```text
ID: smart_worker
Short: SW
```


## AIクリエイター

```text
ID: creator
Short: CR
```


## AIサポーター

```text
ID: supporter
Short: SP
```


## AIプロデューサー

```text
ID: producer
Short: PR
```


## AIビルダー

```text
ID: builder
Short: BL
```


---

# 4. 目的ID

目的判定は以下3種類。


## 本業活用

```text
ID: work
Short: WORK
```


## 副業・収益化

```text
ID: side
Short: SIDE
```


## 本業＋副業

```text
ID: both
Short: BOTH
```


---

# 5. 診断構成

全10問。


## Q1〜Q7

タイプ判定。


## Q8〜Q10

目的判定。


---

# 6. タイプ採点の基本ルール

Q1〜Q6では、

各回答に対して、

- メイン加点：+2
- サブ加点：+1

を設定する。


例：

```text
回答A
supporter +2
smart_worker +1
```


それ以外は0点。


---

# 7. Q7の重み

Q7は、

「半年後どうなっていたいか」

という本人の将来希望を反映する質問。

そのため、

Q1〜Q6より重くする。


Q7は、

- メイン加点：+3
- サブ加点：+1

とする。


---

# 8. 理由

Q1〜Q6は、

- 好み
- 行動
- 思考
- 達成感
- 興味

を測る。


Q7は、

**本人が実際に進みたい方向**

を測る。


「向いていそうだが本人は望んでいない」

という結果を減らすため、

Q7のメイン加点を強くする。


---

# 9. タイプ生点

各タイプの生点を、

`rawScore`

として保持する。


例：

```json
{
  "smart_worker": 6,
  "creator": 12,
  "supporter": 4,
  "producer": 7,
  "builder": 10
}
```


---

# 10. MAIN TYPE判定

最もrawScoreが高いタイプを、

MAIN TYPE

とする。


上記例：

```text
MAIN = creator
```


---

# 11. SUB TYPE判定

2番目にrawScoreが高いタイプを、

SUB TYPE

とする。


上記例：

```text
SUB = builder
```


---

# 12. MAINとSUBは同じタイプにしない

MAIN TYPEとSUB TYPEは、

必ず異なるタイプにする。


---

# 13. 同点処理の基本方針

タイプ同点が発生した場合、

以下の優先順位で決定する。


1. Q7で選択されたタイプ
2. Q6で選択されたタイプ
3. メイン加点回数
4. サブ加点回数
5. 固定タイブレーク順


---

# 14. Q7優先

最優先はQ7。

例：

```text
creator = 10
builder = 10
```

かつ、

Q7でcreator方向の回答を選択していた場合、

```text
MAIN = creator
SUB = builder
```


---

# 15. Q6優先

Q7で差がつかない場合、

Q6のメインタイプを優先する。


---

# 16. メイン加点回数

それでも同点なら、

+2または+3の

**メイン加点を獲得した回数**

が多いタイプを優先する。


例：

```text
creator
mainHitCount = 4

builder
mainHitCount = 3
```

なら、

creatorを上位とする。


---

# 17. サブ加点回数

メイン加点回数も同じなら、

+1のサブ加点回数を比較する。


---

# 18. 最終タイブレーク

すべて同じ場合のみ、

固定順を使用する。


Ver.1固定順：

```text
smart_worker
creator
supporter
producer
builder
```


この固定順は、

診断意味上の優先順位ではなく、

実装上の最終手段。


---

# 19. SUB TYPE同点

2位候補が複数同点の場合も、

同じタイブレークルールを使用する。


ただし、

MAIN TYPEは候補から除外する。


---

# 20. STYLE判定

MAINとSUBだけでなく、

スコア分布からSTYLEを判定する。


種類：

```text
focused
hybrid
multi
```


---

# 21. STYLEの考え方

STYLEは、

「ユーザーがどの程度1タイプに集中しているか」

を表す。


## focused

1位が明確。


## hybrid

1位と2位が近い。


## multi

上位3タイプが近い。


---

# 22. STYLE判定には表示スコアを使用

STYLE判定は、

後述する0〜100の

`displayScore`

を使用する。


---

# 23. ハイブリッド判定

MAINとSUBの表示スコア差が、

**10ポイント以内**

の場合、

```text
STYLE = hybrid
```


例：

```text
creator 86
builder 80
```

差：

6

結果：

```text
hybrid
```


---

# 24. 特化型判定

MAINとSUBの表示スコア差が、

**11ポイント以上**

の場合、

基本的に

```text
STYLE = focused
```


例：

```text
creator 91
builder 73
```

差：

18

結果：

```text
focused
```


---

# 25. マルチAI活用型判定

上位3タイプが、

すべて10ポイント以内に収まる場合、

```text
STYLE = multi
```


例：

```text
smart_worker 81
supporter 77
builder 74
```

1位と3位の差：

7

結果：

```text
multi
```


---

# 26. STYLE判定優先順位

STYLEは以下の順番で判定する。


1. multi判定
2. hybrid判定
3. focused判定


疑似コード：

```ts
if (top1 - top3 <= 10) {
  style = "multi";
} else if (top1 - top2 <= 10) {
  style = "hybrid";
} else {
  style = "focused";
}
```


---

# 27. STYLE表示名

```text
focused
→ 特化型

hybrid
→ ハイブリッド型

multi
→ マルチAI活用型
```


---

# 28. AI活用スコアの目的

rawScoreはユーザーに直接表示しない。


例：

```text
creator = 12
builder = 10
```

では直感的に分かりにくいため、

0〜100程度の表示値へ変換する。


名称：

**AI活用スコア**


---

# 29. 「適性率」と呼ばない

使用しない：

```text
適性率
成功率
才能率
向いている確率
```


使用する：

```text
AI活用スコア
```


---

# 30. タイプ生点の理論最大値

Q1〜Q6で、

同一タイプが毎回メイン加点された場合：

```text
6 × 2 = 12
```


Q7でも同タイプがメイン：

```text
+3
```


理論最大値：

```text
15
```


---

# 31. 表示スコア基本式

Ver.1では、

rawScoreを15点満点として100換算する。


基本式：

```text
displayScore = round(rawScore / 15 × 100)
```


例：

```text
rawScore = 12

12 / 15 × 100
= 80
```


---

# 32. displayScoreの上限

```text
max = 100
```


---

# 33. displayScoreの下限

理論上0点になる可能性がある。

その場合も、

0をそのまま表示してよい。


ただしデザイン上、

極端に「能力がない」ように見えない表現にする。


---

# 34. スコア説明文

結果画面に必要なら、

以下のような補足を入れる。

```text
AI活用スコアは、
あなたの回答傾向から各AI活用スタイルとの
近さを数値化したものです。

能力や成功確率を示すものではありません。
```


---

# 35. GOAL採点

Q8〜Q10で目的を判定する。


Q8：

```text
選択されたGOAL +2
```


Q9：

```text
選択されたGOAL +2
```


Q10：

```text
選択されたGOAL +3
```


---

# 36. Q10を重くする理由

Q10は、

**3か月後の具体的な理想状態**

を聞く質問。


単なる興味より、

実際に近い未来で目指している方向を反映しやすいため、

+3とする。


---

# 37. GOAL生点

例：

```json
{
  "work": 4,
  "side": 0,
  "both": 3
}
```


---

# 38. PRIMARY GOAL

最も高いGOALスコアを、

PRIMARY GOAL

とする。


例：

```text
work = 4
both = 3

PRIMARY GOAL = work
```


---

# 39. SECONDARY GOAL

2番目のGOALを、

SECONDARY GOAL

として内部保持する。


上記例：

```text
SECONDARY GOAL = both
```


---

# 40. GOAL同点処理

GOALが同点の場合、

以下の順番で決定する。


1. Q10
2. Q9
3. Q8
4. 固定タイブレーク


---

# 41. GOAL最終タイブレーク

固定順：

```text
both
work
side
```


理由：

回答が完全に拮抗した場合、

「両方」という柔軟なルートを優先する。


---

# 42. BOTHの扱い

BOTHは、

単に「決められない人」ではない。


意味：

**本業で使うことと、将来的な収益化の両方に関心がある人。**


結果説明では、

中途半端という表現を避ける。


---

# 43. PRIMARYとSECONDARYの使い方

PRIMARY GOAL：

- 結果表示
- PDFルート
- 7日チャレンジ
- 商品導線


SECONDARY GOAL：

- LINE個別返信
- 将来の商品提案
- セグメント分析


---

# 44. PDFルート決定

PDFの主要ルートは、

```text
MAIN TYPE × PRIMARY GOAL
```


で決定する。


例：

```text
creator × side
→ creator_side
```


---

# 45. 15ルート

```text
smart_worker_work
smart_worker_side
smart_worker_both

creator_work
creator_side
creator_both

supporter_work
supporter_side
supporter_both

producer_work
producer_side
producer_both

builder_work
builder_side
builder_both
```


---

# 46. SUB TYPEの扱い

SUB TYPEは、

主要ロードマップの分岐には使わない。


理由：

MAIN × SUB × GOALにすると、

組み合わせが大幅に増えるため。


SUB TYPEは、

以下に使用：

- 診断結果カード
- 診断書本文
- ハイブリッド説明
- 専用PDFのサブタイプ欄
- LINE返信


---

# 47. MAIN × SUB文章

Ver.1では、

MAIN TYPEとSUB TYPEの組み合わせによる

短い説明文を生成または定義する。


例：

```text
MAIN:
creator

SUB:
builder
```


表示：

```text
あなたは、
アイデアを形にする「制作力」と、

作ったものをより便利にする
「仕組み化」の両方を持つタイプです。
```


---

# 48. MAIN × SUBの順序は意味を持つ

以下は別結果として扱う。


```text
creator × builder
```

と

```text
builder × creator
```


理由：

MAINがその人の軸。


---

# 49. タイプ採点データ構造

各回答は、

以下のような形式で管理する。


```ts
type TypeScore = {
  type:
    | "smart_worker"
    | "creator"
    | "supporter"
    | "producer"
    | "builder";

  points: number;
};
```


---

# 50. 回答データ例

```ts
{
  id: "q1-a",
  label: "誰かの困りごとが解決したとき",
  scores: [
    {
      type: "supporter",
      points: 2
    },
    {
      type: "smart_worker",
      points: 1
    }
  ]
}
```


---

# 51. GOAL回答データ例

```ts
{
  id: "q8-b",
  label: "AIを使って新しい収入源を作りたい",
  goalScores: [
    {
      goal: "side",
      points: 2
    }
  ]
}
```


---

# 52. 診断計算処理

疑似コード：

```ts
const rawScores = {
  smart_worker: 0,
  creator: 0,
  supporter: 0,
  producer: 0,
  builder: 0,
};

const goalScores = {
  work: 0,
  side: 0,
  both: 0,
};

for (const answer of selectedAnswers) {
  for (const score of answer.scores ?? []) {
    rawScores[score.type] += score.points;
  }

  for (const goalScore of answer.goalScores ?? []) {
    goalScores[goalScore.goal] += goalScore.points;
  }
}
```


---

# 53. displayScore生成

```ts
const MAX_TYPE_SCORE = 15;

const displayScores = Object.fromEntries(
  Object.entries(rawScores).map(([type, score]) => [
    type,
    Math.round((score / MAX_TYPE_SCORE) * 100),
  ])
);
```


---

# 54. タイプ並び替え

```ts
const rankedTypes = Object.entries(rawScores)
  .sort((a, b) => b[1] - a[1]);
```


ただし、

単純sortだけでは同点処理ができないため、

実装時は専用タイブレーク関数を使用する。


---

# 55. 推奨タイブレーク関数

比較要素：

```text
rawScore
↓
Q7 main hit
↓
Q6 main hit
↓
mainHitCount
↓
subHitCount
↓
fixedOrder
```


---

# 56. mainHitCount

各タイプが、

Q1〜Q7で

メイン加点対象として選ばれた回数。


例：

```json
{
  "creator": 4,
  "builder": 2
}
```


---

# 57. subHitCount

各タイプが、

サブ加点対象として選ばれた回数。


---

# 58. Q7 main hit

Q7の回答で、

そのタイプが+3を獲得したか。


boolean：

```ts
q7MainHit: true | false
```


---

# 59. Q6 main hit

Q6で+2のメイン加点を獲得したか。


---

# 60. タイブレーク情報構造例

```ts
type TypeMeta = {
  rawScore: number;
  mainHitCount: number;
  subHitCount: number;
  q7MainHit: boolean;
  q6MainHit: boolean;
};
```


---

# 61. タイプ固定順

```ts
const TYPE_TIEBREAK_ORDER = [
  "smart_worker",
  "creator",
  "supporter",
  "producer",
  "builder",
];
```


---

# 62. GOAL固定順

```ts
const GOAL_TIEBREAK_ORDER = [
  "both",
  "work",
  "side",
];
```


---

# 63. 結果オブジェクト

最終的に以下を生成する。


```ts
type DiagnosisResult = {
  resultId: string;

  mainType:
    | "smart_worker"
    | "creator"
    | "supporter"
    | "producer"
    | "builder";

  subType:
    | "smart_worker"
    | "creator"
    | "supporter"
    | "producer"
    | "builder";

  primaryGoal:
    | "work"
    | "side"
    | "both";

  secondaryGoal:
    | "work"
    | "side"
    | "both";

  style:
    | "focused"
    | "hybrid"
    | "multi";

  rawScores: {
    smart_worker: number;
    creator: number;
    supporter: number;
    producer: number;
    builder: number;
  };

  displayScores: {
    smart_worker: number;
    creator: number;
    supporter: number;
    producer: number;
    builder: number;
  };

  goalScores: {
    work: number;
    side: number;
    both: number;
  };

  routeId: string;

  completedAt: string;
};
```


---

# 64. routeId生成

形式：

```text
${mainType}_${primaryGoal}
```


例：

```ts
const routeId = `${mainType}_${primaryGoal}`;
```


結果：

```text
creator_side
```


---

# 65. 結果ID

診断結果ごとに、

個人情報を含まないIDを生成。


例：

```text
AI-260808-K4M2
```


推奨：

```text
AI-
YYMMDD
-
ランダム4文字
```


---

# 66. resultId用途

- 診断書表示
- 問い合わせ確認
- 将来自動化
- ログ確認


Ver.1では、

ユーザー本人を特定するIDとして使わない。


---

# 67. 異常値処理

すべてのタイプスコアが0になることは、

正常な質問データでは起きない。


もし発生した場合：

```text
diagnosis_error
```

として結果生成を止める。


---

# 68. 未回答処理

Q1〜Q10のどれかが未回答なら、

結果計算を実行しない。


---

# 69. 不正回答処理

存在しないoptionIdが送信された場合、

採点しない。


必要に応じて、

診断を再読み込み。


---

# 70. データ変更対策

質問や採点ロジック変更時に、

古い結果と混ざらないよう、

診断バージョンを保持する。


例：

```text
diagnosisVersion: "1.0.0"
```


---

# 71. Version管理

最初：

```text
1.0.0
```


質問変更：

```text
1.1.0
```


採点大幅変更：

```text
2.0.0
```


---

# 72. ローカル保存

localStorage保存例：

```json
{
  "diagnosisVersion": "1.0.0",
  "answers": {},
  "result": {}
}
```


---

# 73. バージョン不一致

保存データのdiagnosisVersionが、

現在のバージョンと異なる場合、

古い診断途中データを破棄する。


---

# 74. テストケース1

## AIクリエイター特化

想定：

Q1〜Q7でcreator回答を多く選択。


期待：

```text
MAIN = creator

STYLE = focused
```


---

# 75. テストケース2

## Creator × Builder

想定：

creatorとbuilderが近い。


期待：

```text
MAIN = creator
SUB = builder
STYLE = hybrid
```


---

# 76. テストケース3

## マルチ型

想定：

smart_worker
supporter
builder

が近い。


期待：

```text
STYLE = multi
```


---

# 77. テストケース4

## 本業活用

Q8〜Q10でWORK中心。


期待：

```text
PRIMARY GOAL = work
```


---

# 78. テストケース5

## 副業

SIDE中心。


期待：

```text
PRIMARY GOAL = side
```


---

# 79. テストケース6

## 両方

BOTH中心。


期待：

```text
PRIMARY GOAL = both
```


---

# 80. テストケース7

## GOAL混在

例：

Q8 WORK

Q9 SIDE

Q10 BOTH


点数：

```text
WORK = 2
SIDE = 2
BOTH = 3
```


期待：

```text
PRIMARY = BOTH
```


---

# 81. テストケース8

## GOAL同点

同点の場合、

Q10回答を優先する。


---

# 82. テストケース9

## タイプ同点

creatorとbuilderが完全同点。


Q7がcreator。


期待：

```text
MAIN = creator
```


---

# 83. テストケース10

## 再回答

ユーザーが戻って回答変更。


期待：

古い点数が二重加算されない。


採点は、

現在のanswers全体から毎回再計算する。


---

# 84. 採点再計算方針

推奨：

回答選択時にスコアを直接加算し続けない。


診断完了時、

**answersを元にゼロから再計算**

する。


理由：

- 戻る
- 回答変更
- デバッグ

に強い。


---

# 85. AI活用スコアの注意

displayScoreが高くても、

その仕事で成功することを意味しない。


診断書内で、

能力評価として扱わない。


---

# 86. 初期運用後の調整

Ver.1公開後、

実ユーザーの回答と納得度から、

以下を調整可能。


- +2 / +1配点
- Q7の重み
- STYLE閾値
- 質問本文
- サブ加点先


---

# 87. 最初から複雑にしすぎない

Ver.1では、

機械学習やAIによる動的判定は使用しない。


理由：

- 判定根拠を追える
- 修正しやすい
- テストしやすい
- データがまだない


---

# 88. 将来案

十分な回答データが集まれば、

将来的に、

- 質問ウェイト調整
- ルート改善
- タイプ細分化
- 行動結果との比較

を行う。


ただし、

Ver.1では実装しない。


---

# 89. 採点システム完成条件

以下が実装できれば完成。


- [ ] 5タイプ加点
- [ ] Q1〜Q6 +2/+1
- [ ] Q7 +3/+1
- [ ] GOAL採点
- [ ] MAIN判定
- [ ] SUB判定
- [ ] PRIMARY GOAL
- [ ] SECONDARY GOAL
- [ ] タイブレーク
- [ ] AI活用スコア
- [ ] focused判定
- [ ] hybrid判定
- [ ] multi判定
- [ ] routeId生成
- [ ] resultId生成
- [ ] バージョン管理
- [ ] 再回答正常処理
- [ ] テスト


---

# 90. 最重要原則

採点システムの役割は、

「ユーザーを正解のタイプへ分類する」

ことではない。


目的は、

**ユーザーが納得できる方向性を提示し、
次の行動につなげること。**


診断精度だけを追いすぎず、

結果後の、

- PDF
- 7日チャレンジ
- LINE伴走

まで含めて価値を設計する。


---

# Status

Version: 0.1.0

Phase: Diagnosis Scoring Design

Status: COMPLETE

Next:
`03_question-bank.md`