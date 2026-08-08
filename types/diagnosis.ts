/**
 * AI仕事診断｜診断ドメインの型定義
 *
 * 出典:
 *   docs/01_diagnosis-spec.md
 *   docs/02_scoring-system.md（採点・結果オブジェクトはこちらを正とする）
 *   docs/03_question-bank.md
 *
 * このファイルは型のみを扱う。
 * 実際の値（質問文・点数・バージョン番号など）は data/ と lib/ が持つ。
 */

// ============================================================================
// 1. AI活用タイプ
// 出典: docs/01_diagnosis-spec.md §5
// ============================================================================

/** AI活用タイプの内部ID（5種） */
export type AIType =
  | "smart_worker"
  | "creator"
  | "supporter"
  | "producer"
  | "builder";

/** AI活用タイプの短縮表記 */
export type AITypeShort = "SW" | "CR" | "SP" | "PR" | "BL";

// ============================================================================
// 2. AI活用目的（GOAL）
// 出典: docs/01_diagnosis-spec.md §6
// ============================================================================

/** AI活用目的の内部ID（3種） */
export type Goal = "work" | "side" | "both";

/** AI活用目的の短縮表記 */
export type GoalShort = "WORK" | "SIDE" | "BOTH";

// ============================================================================
// 3. STYLE（スコア分布から判定されるAI活用スタイル）
// 出典: docs/02_scoring-system.md §20-27
// ============================================================================

/**
 * AI活用スタイル。
 *
 * - focused … 1位が明確
 * - hybrid  … 1位と2位が近い
 * - multi   … 上位3タイプが近い
 *
 * 型名を `Style` にすると DOM の同名要素と紛らわしいため `DiagnosisStyle` とする。
 * DiagnosisResult 上のフィールド名は仕様どおり `style` を維持する。
 */
export type DiagnosisStyle = "focused" | "hybrid" | "multi";

// ============================================================================
// 4. 質問と選択肢のID
// 出典: docs/03_question-bank.md
// ============================================================================

/** タイプ判定の質問ID（Q1〜Q7） */
export type TypeQuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";

/** 目的判定の質問ID（Q8〜Q10） */
export type GoalQuestionId = "q8" | "q9" | "q10";

/** 全質問ID（全10問） */
export type QuestionId = TypeQuestionId | GoalQuestionId;

/** タイプ判定は5択（A〜E） */
type TypeOptionSuffix = "a" | "b" | "c" | "d" | "e";

/** 目的判定は3択（A〜C） */
type GoalOptionSuffix = "a" | "b" | "c";

/** タイプ判定の選択肢ID（例: "q1_a"） */
export type TypeOptionId = `${TypeQuestionId}_${TypeOptionSuffix}`;

/** 目的判定の選択肢ID（例: "q8_a"） */
export type GoalOptionId = `${GoalQuestionId}_${GoalOptionSuffix}`;

/** 全選択肢ID */
export type OptionId = TypeOptionId | GoalOptionId;

/**
 * 質問の分類。
 * 出典: docs/03_question-bank.md §18
 */
export type QuestionCategory = "type" | "goal";

// ============================================================================
// 5. 加点定義
// 出典: docs/02_scoring-system.md §49-51 / docs/03_question-bank.md §19
// ============================================================================

/** 選択肢1つがタイプへ与える加点 */
export type TypeScore = {
  readonly type: AIType;
  readonly points: number;
};

/** 選択肢1つがGOALへ与える加点 */
export type GoalScore = {
  readonly goal: Goal;
  readonly points: number;
};

// ============================================================================
// 6. 質問データ
// 出典: docs/03_question-bank.md §19
// ============================================================================

/**
 * タイプ判定の選択肢。
 *
 * 加点は必ず「メインタイプ + 関連タイプ」の2件で構成される
 * （docs/03_question-bank.md §5）。
 * 配列ではなくタプルにすることで、データ登録時の件数漏れを型で検出する。
 */
export type TypeQuestionOption = {
  readonly id: TypeOptionId;
  readonly label: string;
  readonly scores: readonly [TypeScore, TypeScore];
};

/**
 * 目的判定の選択肢。
 * 加点先は必ず1つのGOALのみ（docs/03_question-bank.md §5）。
 */
export type GoalQuestionOption = {
  readonly id: GoalOptionId;
  readonly label: string;
  readonly goalScores: readonly [GoalScore];
};

/** 選択肢（判別可能ユニオン） */
export type QuestionOption = TypeQuestionOption | GoalQuestionOption;

/**
 * タイプ判定の質問（Q1〜Q7）。
 * 5タイプのメイン回答を必ず1つずつ持つため、選択肢は5件固定
 * （docs/03_question-bank.md §13）。
 */
export type TypeQuestion = {
  readonly id: TypeQuestionId;
  readonly category: "type";
  readonly question: string;
  /** 質問意図。UIには出さないが、後から見て修正判断できるように保持する */
  readonly intent: string;
  readonly options: readonly [
    TypeQuestionOption,
    TypeQuestionOption,
    TypeQuestionOption,
    TypeQuestionOption,
    TypeQuestionOption,
  ];
};

/** 目的判定の質問（Q8〜Q10）。選択肢は3件固定 */
export type GoalQuestion = {
  readonly id: GoalQuestionId;
  readonly category: "goal";
  readonly question: string;
  readonly intent: string;
  readonly options: readonly [
    GoalQuestionOption,
    GoalQuestionOption,
    GoalQuestionOption,
  ];
};

/** 質問（判別可能ユニオン。`category` で絞り込める） */
export type Question = TypeQuestion | GoalQuestion;

// ============================================================================
// 7. 回答
// 出典: docs/03_question-bank.md §20 / docs/08_web-spec.md §89
// ============================================================================

/**
 * 回答途中を含む回答マップ。
 * 未回答の質問は値が undefined になる。
 */
export type AnswerMap = Readonly<Partial<Record<QuestionId, OptionId>>>;

/**
 * 全10問が回答済みであることを型で保証した回答マップ。
 *
 * 採点は「全問回答済みのときだけ実行する」ため
 * （docs/02_scoring-system.md §68）、この型を採点関数の入口で要求する。
 */
export type CompletedAnswerMap = Readonly<Record<QuestionId, OptionId>>;

// ============================================================================
// 8. スコア
// 出典: docs/02_scoring-system.md §9, §37, §63
// ============================================================================

/** 5タイプ分のスコア（生点・表示スコアの両方に使用） */
export type TypeScoreMap = Readonly<Record<AIType, number>>;

/** 3目的分のスコア */
export type GoalScoreMap = Readonly<Record<Goal, number>>;

// ============================================================================
// 9. タイブレーク用の集計情報
// 出典: docs/02_scoring-system.md §55-60
// ============================================================================

/**
 * 同点時の順位決定に使う、タイプごとの集計情報。
 *
 * 比較順序:
 *   rawScore → q7MainHit → q6MainHit → mainHitCount → subHitCount → 固定順
 */
export type TypeMeta = {
  /** 生点 */
  readonly rawScore: number;
  /** Q1〜Q7でメイン加点（+2 または +3）を獲得した回数 */
  readonly mainHitCount: number;
  /** サブ加点（+1）を獲得した回数 */
  readonly subHitCount: number;
  /** Q7で +3 を獲得したか */
  readonly q7MainHit: boolean;
  /** Q6で +2 を獲得したか */
  readonly q6MainHit: boolean;
};

/** 5タイプ分のタイブレーク情報 */
export type TypeMetaMap = Readonly<Record<AIType, TypeMeta>>;

// ============================================================================
// 10. ID
// 出典: docs/02_scoring-system.md §64-65 / docs/04_result-combinations.md §34
// ============================================================================

/**
 * PDFルートID（MAIN TYPE × PRIMARY GOAL）。
 * 5 × 3 = 15通り（docs/02_scoring-system.md §45）。
 */
export type RouteId = `${AIType}_${Goal}`;

/**
 * MAIN TYPE × SUB TYPE の組み合わせID。
 *
 * MAINとSUBは必ず異なるタイプになるため（docs/02_scoring-system.md §12）、
 * 同一タイプ同士の組み合わせを型レベルで除外し、ちょうど20通りに限定する。
 */
type CombinationIdOf<M extends AIType> = M extends AIType
  ? `${M}_${Exclude<AIType, M>}`
  : never;

/** MAIN × SUB の組み合わせID（20通り） */
export type CombinationId = CombinationIdOf<AIType>;

/**
 * 診断結果ID。形式は `AI-YYMMDD-XXXX`。
 * 個人情報は含めない（docs/01_diagnosis-spec.md §49）。
 */
export type ResultId = `AI-${string}`;

// ============================================================================
// 11. 診断結果
// 出典: docs/02_scoring-system.md §63 （こちらを正とする）
// ============================================================================

/**
 * 診断結果オブジェクト。
 *
 * 診断バージョンはこの型に含めず、保存時のラッパー側で持つ
 * （docs/02_scoring-system.md §72）。
 */
export type DiagnosisResult = {
  readonly resultId: ResultId;

  /** 最もスコアが高いタイプ */
  readonly mainType: AIType;
  /** 2番目にスコアが高いタイプ。mainType とは必ず異なる */
  readonly subType: AIType;

  /** 最もスコアが高い目的 */
  readonly primaryGoal: Goal;
  /** 2番目に高い目的。内部保持用で、結果画面には必ずしも表示しない */
  readonly secondaryGoal: Goal;

  /** スコア分布から判定したAI活用スタイル */
  readonly style: DiagnosisStyle;

  /** 生点（ユーザーには表示しない） */
  readonly rawScores: TypeScoreMap;
  /** 表示用の0〜100スコア（AI活用スコア） */
  readonly displayScores: TypeScoreMap;
  /** 目的の生点 */
  readonly goalScores: GoalScoreMap;

  /** `${mainType}_${primaryGoal}` */
  readonly routeId: RouteId;

  /** 診断完了時刻（ISO 8601 文字列） */
  readonly completedAt: string;
};

// ============================================================================
// 12. 画面状態
// 出典: docs/01_diagnosis-spec.md §69 / docs/08_web-spec.md §8
// ============================================================================

/** 診断ページ内の画面状態 */
export type DiagnosisScreen = "intro" | "question" | "calculating" | "result";

// ============================================================================
// 13. 保存データ
// 出典: docs/01_diagnosis-spec.md §20 / docs/02_scoring-system.md §72
//       docs/08_web-spec.md §85-88
// ============================================================================

/** 診断途中の進捗 */
export type DiagnosisProgress = {
  /** 現在の質問番号（1〜10） */
  readonly currentQuestion: number;
  readonly answers: AnswerMap;
  /** 診断開始時刻（ISO 8601 文字列） */
  readonly startedAt: string;
};

/**
 * localStorage に保存する進捗データ。
 *
 * `diagnosisVersion` が現在のバージョンと異なる場合は破棄する
 * （docs/02_scoring-system.md §73）。
 */
export type StoredDiagnosisProgress = {
  readonly diagnosisVersion: string;
  readonly progress: DiagnosisProgress;
};

/** localStorage に保存する診断結果 */
export type StoredDiagnosisResult = {
  readonly diagnosisVersion: string;
  readonly result: DiagnosisResult;
};

// ============================================================================
// 14. 採点の失敗
// 出典: docs/02_scoring-system.md §67-69 / docs/08_web-spec.md §94
// ============================================================================

/** 採点を実行できない、または結果へ進めない理由 */
export type ScoringErrorReason =
  /** 未回答の質問がある */
  | "incomplete_answers"
  /** 存在しない選択肢IDが含まれている */
  | "unknown_option"
  /** 全タイプのスコアが0（正常な質問データでは発生しない） */
  | "all_scores_zero";

/**
 * 採点の実行結果。
 *
 * 例外ではなく戻り値でエラーを表現し、
 * 呼び出し側に必ず失敗ケースを処理させる。
 */
export type ScoringOutcome =
  | { readonly ok: true; readonly result: DiagnosisResult }
  | { readonly ok: false; readonly reason: ScoringErrorReason };
