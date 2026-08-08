/**
 * AI仕事診断｜質問データ（Q1〜Q10）
 *
 * 出典: docs/03_question-bank.md （このファイルが唯一の正）
 *
 * 重要:
 *   質問文・選択肢文・Option ID・加点先・点数・選択肢順は
 *   仕様書から逐語で転記している。実装側の判断で言い換えない。
 *
 * 採点ルール（docs/03_question-bank.md §5）:
 *   Q1〜Q6  メインタイプ +2 / 関連タイプ +1
 *   Q7      メインタイプ +3 / 関連タイプ +1
 *   Q8・Q9  該当GOAL +2
 *   Q10     該当GOAL +3
 *
 * 選択肢順（docs/03_question-bank.md §6, §14）:
 *   A〜Eが毎回同じタイプにならないよう、質問ごとに順番を固定している。
 *   アクセスごとのランダムシャッフルは行わない。
 */

import type { Question } from "@/types/diagnosis";

export const questions = [
  // ==========================================================================
  // Q1｜達成感
  // ==========================================================================
  {
    id: "q1",
    category: "type",
    question: "仕事や作業をしていて、一番「楽しい」と感じる瞬間は？",
    intent:
      "ユーザーが、どんな成果に達成感を感じるかを見る。スキルやAI経験ではなく、自然なモチベーション源を確認する。",
    options: [
      {
        // A
        id: "q1_a",
        label:
          "誰かの困りごとが解決して、「助かった」と言ってもらえたとき",
        scores: [
          { type: "supporter", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // B
        id: "q1_b",
        label: "アイデアが、実際の作品や形あるものとして完成したとき",
        scores: [
          { type: "creator", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // C
        id: "q1_c",
        label: "バラバラだった情報が整理されて、分かりやすくなったとき",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "supporter", points: 1 },
        ],
      },
      {
        // D
        id: "q1_d",
        label: "面倒だった作業が、ほとんど手をかけず進むようになったとき",
        scores: [
          { type: "builder", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // E
        id: "q1_e",
        label: "自分が考えたものに、反応や売上などの結果が出たとき",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q2｜行動パターン
  // ==========================================================================
  {
    id: "q2",
    category: "type",
    question: "新しい仕事や作業を頼まれたとき、最初にしがちなことは？",
    intent: "「好き」ではなく、実際の行動パターンを見る。",
    options: [
      {
        // A
        id: "q2_a",
        label: "まず手を動かして、形を見ながら考える",
        scores: [
          { type: "creator", points: 2 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // B
        id: "q2_b",
        label: "相手が何に困っているのか、まず詳しく確認する",
        scores: [
          { type: "supporter", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // C
        id: "q2_c",
        label: "必要な情報や手順を整理してから進める",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // D
        id: "q2_d",
        label: "「もっと簡単な方法はない？」と効率のいい進め方を考える",
        scores: [
          { type: "builder", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // E
        id: "q2_e",
        label: "どうすれば価値が伝わるか、見せ方や届け方を考える",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q3｜やってみたい仕事
  // ==========================================================================
  {
    id: "q3",
    category: "type",
    question: "こんなお願いをされたら、一番やってみたいのは？",
    intent:
      "実際の仕事イメージから、ユーザーが興味を持つAI活用方向を確認する。",
    options: [
      {
        // A
        id: "q3_a",
        label: "「SNSや日々の事務作業を手伝ってほしい」",
        scores: [
          { type: "supporter", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // B
        id: "q3_b",
        label: "「この知識や経験を、教材や商品として形にしてほしい」",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
      {
        // C
        id: "q3_c",
        label: "「毎回やっているこの作業を、もっと楽にできない？」",
        scores: [
          { type: "builder", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // D
        id: "q3_d",
        label: "「このサービスのWebページやデザインを作ってほしい」",
        scores: [
          { type: "creator", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // E
        id: "q3_e",
        label: "「この情報を整理して、分かりやすい資料にしてほしい」",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "supporter", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q4｜思考スタイル
  // ==========================================================================
  {
    id: "q4",
    category: "type",
    question: "仕事や作業をするとき、どの考え方が一番自分に近い？",
    intent: "ユーザーの、思考スタイルを判定する。",
    options: [
      {
        // A
        id: "q4_a",
        label: "同じ作業を何度もするなら、できるだけ仕組みにしたい",
        scores: [
          { type: "builder", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // B
        id: "q4_b",
        label: "自分がやりたいことより、相手が必要としていることを考えたい",
        scores: [
          { type: "supporter", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // C
        id: "q4_c",
        label: "まず正確に理解して、情報を整理してから進めたい",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "supporter", points: 1 },
        ],
      },
      {
        // D
        id: "q4_d",
        label: "完璧に考えてからより、まず作って修正していきたい",
        scores: [
          { type: "creator", points: 2 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // E
        id: "q4_e",
        label: "作るだけでなく、「どう届けるか」まで考えたい",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q5｜AIでやってみたいこと
  // ==========================================================================
  {
    id: "q5",
    category: "type",
    question: "もし自由に1日使えるなら、AIでどれをやってみたい？",
    intent: "AIを使った、具体的な行動への興味を見る。",
    options: [
      {
        // A
        id: "q5_a",
        label: "自分の商品や教材のアイデアを考えて、形にしてみる",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
      {
        // B
        id: "q5_b",
        label: "普段の仕事を、AIでどこまで早くできるか試してみる",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // C
        id: "q5_c",
        label: "Webサイト・画像・デザインなどを1つ完成させる",
        scores: [
          { type: "creator", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // D
        id: "q5_d",
        label: "誰かの仕事をAIで手伝って、どれだけ楽にできるか試す",
        scores: [
          { type: "supporter", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // E
        id: "q5_e",
        label: "CodexやGPTなどを使って、便利な仕組みやツールを作る",
        scores: [
          { type: "builder", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q6｜欲しいAI能力
  // ==========================================================================
  {
    id: "q6",
    category: "type",
    question: "AIで1つだけ「できること」を増やせるなら、どれを選ぶ？",
    intent: "ユーザーが、最も欲しいAI活用能力を見る。",
    options: [
      {
        // A
        id: "q6_a",
        label: "人の要望を理解して、AIを使いながら仕事をサポートできる",
        scores: [
          { type: "supporter", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // B
        id: "q6_b",
        label: "自分の知識や経験を、商品として形にして届けられる",
        scores: [
          { type: "producer", points: 2 },
          { type: "creator", points: 1 },
        ],
      },
      {
        // C
        id: "q6_c",
        label: "文章・資料・情報整理などの仕事を、短時間で終わらせられる",
        scores: [
          { type: "smart_worker", points: 2 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // D
        id: "q6_d",
        label: "Web・デザイン・画像・動画などを、自分で形にできる",
        scores: [
          { type: "creator", points: 2 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // E
        id: "q6_e",
        label: "面倒な業務を、ツールや自動化で解決できる",
        scores: [
          { type: "builder", points: 2 },
          { type: "smart_worker", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q7｜半年後の理想
  //
  // この質問のみ、メインタイプを +3 とする（docs/03_question-bank.md §5）。
  // 選択肢の配置はQ6と同一だが、仕様書どおりに実装している。
  // ==========================================================================
  {
    id: "q7",
    category: "type",
    question: "半年後、どんな自分になっていたら一番うれしい？",
    intent:
      "Q1〜Q6で見た行動傾向に加えて、本人が実際に進みたい方向を強く反映する。そのためQ7のみ、メインタイプを+3とする。",
    options: [
      {
        // A
        id: "q7_a",
        label: "AIを使って、誰かから継続的に仕事を任されている",
        scores: [
          { type: "supporter", points: 3 },
          { type: "smart_worker", points: 1 },
        ],
      },
      {
        // B
        id: "q7_b",
        label: "自分の商品・教材・コンテンツから売上が出ている",
        scores: [
          { type: "producer", points: 3 },
          { type: "creator", points: 1 },
        ],
      },
      {
        // C
        id: "q7_c",
        label: "AIを日常業務で使いこなし、仕事がかなり効率化されている",
        scores: [
          { type: "smart_worker", points: 3 },
          { type: "builder", points: 1 },
        ],
      },
      {
        // D
        id: "q7_d",
        label: "AIを使って作った作品や制作物が、仕事につながっている",
        scores: [
          { type: "creator", points: 3 },
          { type: "producer", points: 1 },
        ],
      },
      {
        // E
        id: "q7_e",
        label:
          "AIでツールや仕組みを作り、業務改善までできるようになっている",
        scores: [
          { type: "builder", points: 3 },
          { type: "smart_worker", points: 1 },
        ],
      },
    ],
  },

  // ==========================================================================
  // Q8｜AIを学ぶ理由
  // ==========================================================================
  {
    id: "q8",
    category: "goal",
    question: "今、AIを学びたい一番の理由は？",
    intent: "ユーザーが現在持っている、AI活用の主目的を直接確認する。",
    options: [
      {
        // A
        id: "q8_a",
        label: "今の仕事をもっと早く、効率よく進めたい",
        goalScores: [{ goal: "work", points: 2 }],
      },
      {
        // B
        id: "q8_b",
        label: "AIを使って、新しい収入源を作りたい",
        goalScores: [{ goal: "side", points: 2 }],
      },
      {
        // C
        id: "q8_c",
        label: "今の仕事にも活かしながら、将来的には収入にもつなげたい",
        goalScores: [{ goal: "both", points: 2 }],
      },
    ],
  },

  // ==========================================================================
  // Q9｜現在の優先順位
  // ==========================================================================
  {
    id: "q9",
    category: "goal",
    question: "今、どれを先に実現したい？",
    intent: "興味ではなく、行動の優先順位を見る。",
    options: [
      {
        // A
        id: "q9_a",
        label: "AIを使った副業や案件を始めて、自分で売上を作る",
        goalScores: [{ goal: "side", points: 2 }],
      },
      {
        // B
        id: "q9_b",
        label: "まず今の仕事の中で、AIを使える場面を増やす",
        goalScores: [{ goal: "work", points: 2 }],
      },
      {
        // C
        id: "q9_c",
        label: "仕事で使える力をつけながら、収益化できそうなことも探す",
        goalScores: [{ goal: "both", points: 2 }],
      },
    ],
  },

  // ==========================================================================
  // Q10｜3か月後の目標
  //
  // 目的判定の中で最重要とし、+3点を加点する。
  // ==========================================================================
  {
    id: "q10",
    category: "goal",
    question: "3か月後、どの状態になっていたら一番理想に近い？",
    intent:
      "近い未来の具体的な目標を確認する。目的判定の中で最重要とし、+3点を加点する。",
    options: [
      {
        // A
        id: "q10_a",
        label: "普段の仕事でAIを当たり前に使えて、作業時間が減っている",
        goalScores: [{ goal: "work", points: 3 }],
      },
      {
        // B
        id: "q10_b",
        label: "本業でAIを活用しながら、副業や商品づくりも動き始めている",
        goalScores: [{ goal: "both", points: 3 }],
      },
      {
        // C
        id: "q10_c",
        label: "AIを使った商品・サービス・案件から、最初の収入が生まれている",
        goalScores: [{ goal: "side", points: 3 }],
      },
    ],
  },
] as const satisfies readonly Question[];
