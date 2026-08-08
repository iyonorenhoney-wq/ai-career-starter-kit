# AIキャリアスターターキット｜Question Bank

## 1. ファイル概要

### ファイル名
`03_question-bank.md`

### 目的
AI仕事診断で使用する正式な質問文・選択肢・採点先を定義する。

このファイルでは、

- Q1〜Q7のタイプ判定質問
- Q8〜Q10の目的判定質問
- 選択肢の表示順
- 各選択肢の加点先
- 質問意図
- 実装用ID
- 回答データ構造

を管理する。

採点ロジック全体は、

`02_scoring-system.md`

を参照する。


---

# 2. 基本ルール

## 質問数

全10問。


## 内訳

```text
Q1〜Q7
→ AI活用タイプ判定

Q8〜Q10
→ AI活用目的判定
```


## 回答形式

すべて単一選択式。


## タイプ判定

5択。


## 目的判定

3択。


---

# 3. タイプID

```text
smart_worker = AIスマートワーカー
creator      = AIクリエイター
supporter    = AIサポーター
producer     = AIプロデューサー
builder      = AIビルダー
```


---

# 4. GOAL ID

```text
work = 本業活用
side = 副業・収益化
both = 本業＋副業
```


---

# 5. 採点ルール

## Q1〜Q6

```text
メインタイプ +2
関連タイプ   +1
```


## Q7

```text
メインタイプ +3
関連タイプ   +1
```


## Q8〜Q9

```text
該当GOAL +2
```


## Q10

```text
該当GOAL +3
```


---

# 6. 選択肢表示方針

Q1〜Q7では、

A〜Eが毎回同じタイプにならないようにする。

ユーザーから、

「Aを選び続けたら同じタイプになる」

と分からない構成にする。


Ver.1では、

アクセスごとのランダムシャッフルではなく、

**質問ごとにあらかじめ異なる順番で固定する。**


---

# Q1

## Question ID

```text
q1
```


## 質問

**仕事や作業をしていて、一番「楽しい」と感じる瞬間は？**


## 質問意図

ユーザーが、

**どんな成果に達成感を感じるか**

を見る。

スキルやAI経験ではなく、

自然なモチベーション源を確認する。


---

## A

**誰かの困りごとが解決して、「助かった」と言ってもらえたとき**


採点：

```text
supporter +2
smart_worker +1
```


Option ID：

```text
q1_a
```


---

## B

**アイデアが、実際の作品や形あるものとして完成したとき**


採点：

```text
creator +2
producer +1
```


Option ID：

```text
q1_b
```


---

## C

**バラバラだった情報が整理されて、分かりやすくなったとき**


採点：

```text
smart_worker +2
supporter +1
```


Option ID：

```text
q1_c
```


---

## D

**面倒だった作業が、ほとんど手をかけず進むようになったとき**


採点：

```text
builder +2
smart_worker +1
```


Option ID：

```text
q1_d
```


---

## E

**自分が考えたものに、反応や売上などの結果が出たとき**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q1_e
```


---

# Q2

## Question ID

```text
q2
```


## 質問

**新しい仕事や作業を頼まれたとき、最初にしがちなことは？**


## 質問意図

「好き」ではなく、

**実際の行動パターン**

を見る。


---

## A

**まず手を動かして、形を見ながら考える**


採点：

```text
creator +2
builder +1
```


Option ID：

```text
q2_a
```


---

## B

**相手が何に困っているのか、まず詳しく確認する**


採点：

```text
supporter +2
producer +1
```


Option ID：

```text
q2_b
```


---

## C

**必要な情報や手順を整理してから進める**


採点：

```text
smart_worker +2
builder +1
```


Option ID：

```text
q2_c
```


---

## D

**「もっと簡単な方法はない？」と効率のいい進め方を考える**


採点：

```text
builder +2
smart_worker +1
```


Option ID：

```text
q2_d
```


---

## E

**どうすれば価値が伝わるか、見せ方や届け方を考える**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q2_e
```


---

# Q3

## Question ID

```text
q3
```


## 質問

**こんなお願いをされたら、一番やってみたいのは？**


## 質問意図

実際の仕事イメージから、

ユーザーが興味を持つAI活用方向を確認する。


---

## A

**「SNSや日々の事務作業を手伝ってほしい」**


採点：

```text
supporter +2
smart_worker +1
```


Option ID：

```text
q3_a
```


---

## B

**「この知識や経験を、教材や商品として形にしてほしい」**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q3_b
```


---

## C

**「毎回やっているこの作業を、もっと楽にできない？」**


採点：

```text
builder +2
smart_worker +1
```


Option ID：

```text
q3_c
```


---

## D

**「このサービスのWebページやデザインを作ってほしい」**


採点：

```text
creator +2
producer +1
```


Option ID：

```text
q3_d
```


---

## E

**「この情報を整理して、分かりやすい資料にしてほしい」**


採点：

```text
smart_worker +2
supporter +1
```


Option ID：

```text
q3_e
```


---

# Q4

## Question ID

```text
q4
```


## 質問

**仕事や作業をするとき、どの考え方が一番自分に近い？**


## 質問意図

ユーザーの、

**思考スタイル**

を判定する。


---

## A

**同じ作業を何度もするなら、できるだけ仕組みにしたい**


採点：

```text
builder +2
smart_worker +1
```


Option ID：

```text
q4_a
```


---

## B

**自分がやりたいことより、相手が必要としていることを考えたい**


採点：

```text
supporter +2
producer +1
```


Option ID：

```text
q4_b
```


---

## C

**まず正確に理解して、情報を整理してから進めたい**


採点：

```text
smart_worker +2
supporter +1
```


Option ID：

```text
q4_c
```


---

## D

**完璧に考えてからより、まず作って修正していきたい**


採点：

```text
creator +2
builder +1
```


Option ID：

```text
q4_d
```


---

## E

**作るだけでなく、「どう届けるか」まで考えたい**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q4_e
```


---

# Q5

## Question ID

```text
q5
```


## 質問

**もし自由に1日使えるなら、AIでどれをやってみたい？**


## 質問意図

AIを使った、

**具体的な行動への興味**

を見る。


---

## A

**自分の商品や教材のアイデアを考えて、形にしてみる**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q5_a
```


---

## B

**普段の仕事を、AIでどこまで早くできるか試してみる**


採点：

```text
smart_worker +2
builder +1
```


Option ID：

```text
q5_b
```


---

## C

**Webサイト・画像・デザインなどを1つ完成させる**


採点：

```text
creator +2
producer +1
```


Option ID：

```text
q5_c
```


---

## D

**誰かの仕事をAIで手伝って、どれだけ楽にできるか試す**


採点：

```text
supporter +2
smart_worker +1
```


Option ID：

```text
q5_d
```


---

## E

**CodexやGPTなどを使って、便利な仕組みやツールを作る**


採点：

```text
builder +2
creator +1
```


Option ID：

```text
q5_e
```


---

# Q6

## Question ID

```text
q6
```


## 質問

**AIで1つだけ「できること」を増やせるなら、どれを選ぶ？**


## 質問意図

ユーザーが、

**最も欲しいAI活用能力**

を見る。


---

## A

**人の要望を理解して、AIを使いながら仕事をサポートできる**


採点：

```text
supporter +2
smart_worker +1
```


Option ID：

```text
q6_a
```


---

## B

**自分の知識や経験を、商品として形にして届けられる**


採点：

```text
producer +2
creator +1
```


Option ID：

```text
q6_b
```


---

## C

**文章・資料・情報整理などの仕事を、短時間で終わらせられる**


採点：

```text
smart_worker +2
builder +1
```


Option ID：

```text
q6_c
```


---

## D

**Web・デザイン・画像・動画などを、自分で形にできる**


採点：

```text
creator +2
producer +1
```


Option ID：

```text
q6_d
```


---

## E

**面倒な業務を、ツールや自動化で解決できる**


採点：

```text
builder +2
smart_worker +1
```


Option ID：

```text
q6_e
```


---

# Q7

## Question ID

```text
q7
```


## 質問

**半年後、どんな自分になっていたら一番うれしい？**


## 質問意図

Q1〜Q6で見た行動傾向に加えて、

**本人が実際に進みたい方向**

を強く反映する。

そのためQ7のみ、

メインタイプを+3とする。


---

## A

**AIを使って、誰かから継続的に仕事を任されている**


採点：

```text
supporter +3
smart_worker +1
```


Option ID：

```text
q7_a
```


---

## B

**自分の商品・教材・コンテンツから売上が出ている**


採点：

```text
producer +3
creator +1
```


Option ID：

```text
q7_b
```


---

## C

**AIを日常業務で使いこなし、仕事がかなり効率化されている**


採点：

```text
smart_worker +3
builder +1
```


Option ID：

```text
q7_c
```


---

## D

**AIを使って作った作品や制作物が、仕事につながっている**


採点：

```text
creator +3
producer +1
```


Option ID：

```text
q7_d
```


---

## E

**AIでツールや仕組みを作り、業務改善までできるようになっている**


採点：

```text
builder +3
smart_worker +1
```


Option ID：

```text
q7_e
```


---

# Q8

## Question ID

```text
q8
```


## 質問

**今、AIを学びたい一番の理由は？**


## 質問意図

ユーザーが現在持っている、

**AI活用の主目的**

を直接確認する。


---

## A

**今の仕事をもっと早く、効率よく進めたい**


採点：

```text
work +2
```


Option ID：

```text
q8_a
```


---

## B

**AIを使って、新しい収入源を作りたい**


採点：

```text
side +2
```


Option ID：

```text
q8_b
```


---

## C

**今の仕事にも活かしながら、将来的には収入にもつなげたい**


採点：

```text
both +2
```


Option ID：

```text
q8_c
```


---

# Q9

## Question ID

```text
q9
```


## 質問

**今、どれを先に実現したい？**


## 質問意図

興味ではなく、

**行動の優先順位**

を見る。


---

## A

**AIを使った副業や案件を始めて、自分で売上を作る**


採点：

```text
side +2
```


Option ID：

```text
q9_a
```


---

## B

**まず今の仕事の中で、AIを使える場面を増やす**


採点：

```text
work +2
```


Option ID：

```text
q9_b
```


---

## C

**仕事で使える力をつけながら、収益化できそうなことも探す**


採点：

```text
both +2
```


Option ID：

```text
q9_c
```


---

# Q10

## Question ID

```text
q10
```


## 質問

**3か月後、どの状態になっていたら一番理想に近い？**


## 質問意図

近い未来の具体的な目標を確認する。

目的判定の中で最重要とし、

+3点を加点する。


---

## A

**普段の仕事でAIを当たり前に使えて、作業時間が減っている**


採点：

```text
work +3
```


Option ID：

```text
q10_a
```


---

## B

**本業でAIを活用しながら、副業や商品づくりも動き始めている**


採点：

```text
both +3
```


Option ID：

```text
q10_b
```


---

## C

**AIを使った商品・サービス・案件から、最初の収入が生まれている**


採点：

```text
side +3
```


Option ID：

```text
q10_c
```


---

# 7. 質問一覧まとめ

```text
Q1
達成感

Q2
行動パターン

Q3
やってみたい仕事

Q4
思考スタイル

Q5
AIでやってみたいこと

Q6
欲しいAI能力

Q7
半年後の理想

Q8
AIを学ぶ理由

Q9
現在の優先順位

Q10
3か月後の目標
```


---

# 8. 判定観点

タイプ判定では、

同じことを言い換えて7回聞くのではなく、

以下の異なる角度から判定する。


```text
感情
↓
行動
↓
仕事
↓
思考
↓
興味
↓
能力
↓
未来
```


これにより、

回答の偏りを減らす。


---

# 9. 質問文のトーン

使用する言葉：

- 一番近い
- やってみたい
- うれしい
- 自分なら
- どれを選ぶ


避ける：

- あなたは〇〇が得意ですか？
- あなたは〇〇タイプですか？
- 副業したいですか？
- エンジニアになりたいですか？


理由：

診断結果が推測されやすくなるため。


---

# 10. 難しい言葉を避ける

AI初心者も対象とするため、

専門用語だけの選択肢にしない。


例えば、

避ける：

```text
API連携やエージェント自動化を構築したい
```


使用：

```text
便利な仕組みやツールを作りたい
```


必要に応じて、

Codexなど具体例を補足として入れる。


---

# 11. 回答者がAI未経験でも答えられる

診断では、

「Claudeを使ったことがありますか？」

のような、

経験前提質問を使用しない。


ユーザーがAI未経験でも、

自分の、

- 好み
- 行動
- 将来像

から回答できるようにする。


---

# 12. 誘導を避ける

以下のような、

明らかに魅力差のある選択肢を作らない。


悪い例：

```text
A
面倒な仕事を毎日する

B
AIで仕事を全部自動化する
```


すべての選択肢が、

違う価値観として成立するようにする。


---

# 13. タイプ別メイン回答配置

各質問に1つずつ、

5タイプのメイン回答を配置する。


Q1〜Q7を通して、

各タイプが極端に有利にならないようにする。


---

# 14. タイプ別メイン加点確認

各質問でのメインタイプ。


## Q1

```text
A supporter
B creator
C smart_worker
D builder
E producer
```


## Q2

```text
A creator
B supporter
C smart_worker
D builder
E producer
```


## Q3

```text
A supporter
B producer
C builder
D creator
E smart_worker
```


## Q4

```text
A builder
B supporter
C smart_worker
D creator
E producer
```


## Q5

```text
A producer
B smart_worker
C creator
D supporter
E builder
```


## Q6

```text
A supporter
B producer
C smart_worker
D creator
E builder
```


## Q7

```text
A supporter
B producer
C smart_worker
D creator
E builder
```


---

# 15. 目的回答配置

## Q8

```text
A work
B side
C both
```


## Q9

```text
A side
B work
C both
```


## Q10

```text
A work
B both
C side
```


順番を毎回変える。


---

# 16. 実装用TypeScript例

```ts
export const questions = [
  {
    id: "q1",
    type: "type",
    question:
      "仕事や作業をしていて、一番「楽しい」と感じる瞬間は？",

    options: [
      {
        id: "q1_a",
        label:
          "誰かの困りごとが解決して、「助かった」と言ってもらえたとき",
        scores: [
          {
            type: "supporter",
            points: 2,
          },
          {
            type: "smart_worker",
            points: 1,
          },
        ],
      },

      {
        id: "q1_b",
        label:
          "アイデアが、実際の作品や形あるものとして完成したとき",
        scores: [
          {
            type: "creator",
            points: 2,
          },
          {
            type: "producer",
            points: 1,
          },
        ],
      },

      {
        id: "q1_c",
        label:
          "バラバラだった情報が整理されて、分かりやすくなったとき",
        scores: [
          {
            type: "smart_worker",
            points: 2,
          },
          {
            type: "supporter",
            points: 1,
          },
        ],
      },

      {
        id: "q1_d",
        label:
          "面倒だった作業が、ほとんど手をかけず進むようになったとき",
        scores: [
          {
            type: "builder",
            points: 2,
          },
          {
            type: "smart_worker",
            points: 1,
          },
        ],
      },

      {
        id: "q1_e",
        label:
          "自分が考えたものに、反応や売上などの結果が出たとき",
        scores: [
          {
            type: "producer",
            points: 2,
          },
          {
            type: "creator",
            points: 1,
          },
        ],
      },
    ],
  },
];
```


---

# 17. 実装時の注意

質問文や採点を、

UIコンポーネント内へ直接ハードコードしない。


推奨：

```text
data/questions.ts
```

または、

```text
data/questions.json
```


として分離する。


理由：

- 質問修正
- 採点変更
- テスト
- バージョン更新

を簡単にする。


---

# 18. Question Type

実装内部では、

以下の2種類を持たせる。


```ts
type QuestionCategory =
  | "type"
  | "goal";
```


Q1〜Q7：

```text
type
```


Q8〜Q10：

```text
goal
```


---

# 19. データ型例

```ts
type AIType =
  | "smart_worker"
  | "creator"
  | "supporter"
  | "producer"
  | "builder";

type Goal =
  | "work"
  | "side"
  | "both";

type TypeScore = {
  type: AIType;
  points: number;
};

type GoalScore = {
  goal: Goal;
  points: number;
};

type QuestionOption = {
  id: string;
  label: string;

  scores?: TypeScore[];
  goalScores?: GoalScore[];
};

type Question = {
  id: string;

  type:
    | "type"
    | "goal";

  question: string;

  options: QuestionOption[];
};
```


---

# 20. 回答保存形式

```ts
type AnswerMap = {
  [questionId: string]: string;
};
```


例：

```json
{
  "q1": "q1_b",
  "q2": "q2_a",
  "q3": "q3_d",
  "q4": "q4_d",
  "q5": "q5_c",
  "q6": "q6_d",
  "q7": "q7_d",
  "q8": "q8_b",
  "q9": "q9_a",
  "q10": "q10_c"
}
```


---

# 21. 完全Creator × SIDE回答例

例：

```text
Q1 B
Q2 A
Q3 D
Q4 D
Q5 C
Q6 D
Q7 D

Q8 B
Q9 A
Q10 C
```


期待：

```text
MAIN
creator

GOAL
side
```


---

# 22. 完全Smart Worker × WORK回答例

```text
Q1 C
Q2 C
Q3 E
Q4 C
Q5 B
Q6 C
Q7 C

Q8 A
Q9 B
Q10 A
```


期待：

```text
MAIN
smart_worker

GOAL
work
```


---

# 23. 完全Supporter回答例

```text
Q1 A
Q2 B
Q3 A
Q4 B
Q5 D
Q6 A
Q7 A
```


期待：

```text
MAIN
supporter
```


---

# 24. 完全Producer回答例

```text
Q1 E
Q2 E
Q3 B
Q4 E
Q5 A
Q6 B
Q7 B
```


期待：

```text
MAIN
producer
```


---

# 25. 完全Builder回答例

```text
Q1 D
Q2 D
Q3 C
Q4 A
Q5 E
Q6 E
Q7 E
```


期待：

```text
MAIN
builder
```


---

# 26. BOTH回答例

```text
Q8 C
Q9 C
Q10 B
```


期待：

```text
GOAL
both
```


---

# 27. 公開前の質問テスト

最低でも、

以下のテストを行う。


- [ ] AI初心者
- [ ] 会社員
- [ ] 副業希望者
- [ ] Web制作経験者
- [ ] コンテンツ販売経験者
- [ ] エンジニア寄り
- [ ] SNS運用者


---

# 28. ユーザーへの確認

テストユーザーには、

結果だけでなく、

以下を聞く。


```text
この質問、答えにくかった？

どの選択肢も当てはまらない質問はあった？

似た質問が多いと感じた？

結果を予想できた？

迷った質問はどれ？

診断結果は自分に近かった？
```


---

# 29. 特に確認する質問

Q5とQ6は、

AIの具体的な活用方法が出るため、

AI初心者が意味を理解できるか確認する。


必要なら、

短い補足説明を追加する。


---

# 30. Q7重要確認

Q7は3点加点のため、

特にテストする。


確認：

```text
半年後という期間は答えやすいか？

理想像として選択肢に偏りがないか？

「売上」という言葉だけが魅力的に見えないか？
```


---

# 31. 診断質問Ver.1の方針

Ver.1では、

質問数を増やして精密に見せるより、

**10問を気持ちよく完走してもらうこと**

を優先する。


結果後に、

PDF・LINE・7日チャレンジ

が続くため、

診断段階でユーザーを疲れさせない。


---

# 32. 将来の質問追加

実データから必要性が確認できれば、

以下の判定を追加可能。


例：

```text
AI経験レベル

利用可能時間

コミュニケーション傾向

収益目標

現在の職種
```


ただし、

Ver.1では追加しない。


---

# 33. 現在地について

AI経験レベルは、

今回の10問では直接タイプ判定に使用しない。


理由：

「AI未経験だからスマートワーカー」

など、

経験値と適性方向を混同しないため。


AI経験レベルは、

将来的にPDFの難易度分岐などで使用可能。


---

# 34. 質問完成条件

以下を満たせばVer.1完成。


- [x] Q1〜Q7作成
- [x] Q8〜Q10作成
- [x] 選択肢順シャッフル
- [x] メイン加点設定
- [x] サブ加点設定
- [x] GOAL加点設定
- [x] Q7重み設定
- [x] Q10重み設定
- [x] Option ID設定
- [x] 質問意図設定

残作業：

- [ ] 実ユーザーテスト
- [ ] テスト結果による文章微調整


---

# 35. 最重要原則

質問を作る目的は、

ユーザーを5つの箱へ無理に分類することではない。


ユーザーが結果を見たとき、

**「確かに私はこの方向から始めると良さそう」**

と思え、

その後の7日間を動けることを最優先する。


診断結果の価値は、

質問精度だけではなく、

```text
診断
↓
理解
↓
ロードマップ
↓
行動
```

まで含めて判断する。


---

# Status

Version: 0.1.0

Phase: Question Design

Status: COMPLETE

Next:
`04_result-types.md`