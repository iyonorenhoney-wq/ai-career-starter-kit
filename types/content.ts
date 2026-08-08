/**
 * AI仕事診断｜表示コンテンツの型定義
 *
 * 出典:
 *   docs/04_result-types.md         … 5タイプの結果文章
 *   docs/04_result-combinations.md  … MAIN × SUB の20パターン
 *   docs/06_pdf-spec.md §22-25      … GOAL説明
 *   docs/08_web-spec.md §71, §104   … レーダー軸ラベル / タイプ別アイコン
 *
 * 仕様書の文章をそのままデータ化するための型。
 * ロジックは持たせない。
 */

import type {
  AIType,
  AITypeShort,
  CombinationId,
  DiagnosisStyle,
  Goal,
  GoalShort,
} from "./diagnosis";

// ============================================================================
// 1. 共通の部品
// ============================================================================

/**
 * 見出し + 説明文を持つ項目。
 *
 * 仕様書の「強み」「注意ポイント」は
 *   ### 1. 情報を整理する
 *   バラバラな情報を、必要な形に整理することと相性があります。
 * のように見出しと説明が対になっているため、両方を保持する。
 */
export type TitledText = {
  readonly title: string;
  readonly body: string;
};

/**
 * おすすめAIツール1件。
 * 出典: docs/04_result-types.md「おすすめAIツール」
 */
export type RecommendedTool = {
  /** ツール名（ChatGPT / Claude / Canva など） */
  readonly name: string;
  /** 用途。仕様書の箇条書きをそのまま保持する */
  readonly purposes: readonly string[];
  /**
   * 補足。
   * 例:「基本的なAI活用ができてから検討する」「Google Workspaceを使う人は検討」
   * 補足を持たないツールもあるため任意。
   */
  readonly note?: string;
};

/**
 * おすすめ学習順の1ステップ。
 * 出典: docs/04_result-types.md「おすすめ学習順」（STEP1〜STEP8）
 */
export type LearningStep = {
  /** 1始まりのステップ番号 */
  readonly step: number;
  readonly label: string;
};

/**
 * タイプ別アイコン名。
 * 出典: docs/08_web-spec.md §104（Lucide React のアイコン名）
 *
 * STEP7でLucide Reactを導入するまでは名前だけを保持する。
 */
export type TypeIconName =
  | "Briefcase"
  | "PenTool"
  | "Users"
  | "Package"
  | "Blocks";

// ============================================================================
// 2. タイプ別コンテンツ
// 出典: docs/04_result-types.md §26
// ============================================================================

/**
 * 5タイプそれぞれの結果文章。
 *
 * Webの結果画面では一部だけを表示し、PDFで全量を使う
 * （docs/04_result-types.md §20-22）。
 * このデータはWeb・PDF双方の元になるため、仕様書の情報を欠落させずに保持する。
 */
export type ResultTypeContent = {
  readonly id: AIType;
  readonly short: AITypeShort;

  /** 正式名称（例: AIクリエイター） */
  readonly name: string;
  /** 英語表示（例: AI CREATOR） */
  readonly englishName: string;
  /** カテゴリ（例: 制作タイプ） */
  readonly category: string;
  /**
   * レーダーチャートの軸ラベル（例: 制作）。
   * カテゴリから「タイプ」を除いた短い表記。
   * 出典: docs/08_web-spec.md §71
   */
  readonly scoreLabel: string;

  /** キャッチコピー（例: アイデアを、AIで形にする人。） */
  readonly catchCopy: string;
  /** 一言診断 */
  readonly shortDiagnosis: string;
  /** 「あなたはこんなタイプ」の本文 */
  readonly description: string;

  /** 強み（仕様書では5件） */
  readonly strengths: readonly TitledText[];
  /** 注意ポイント（仕様書では5件） */
  readonly cautions: readonly TitledText[];

  /** 向いているAI活用 */
  readonly useCases: readonly string[];
  /** 向いている仕事・活用シーン */
  readonly jobs: readonly string[];

  readonly recommendedTools: readonly RecommendedTool[];
  readonly learningSteps: readonly LearningStep[];

  /**
   * 今日の一歩。
   * title に行動そのもの、body に補足説明を入れる。
   * 出典: docs/01_diagnosis-spec.md §41 / docs/04_result-types.md「今日の一歩」
   */
  readonly firstAction: TitledText;

  /** 30日後の方向性 */
  readonly day30Goal: string;
  /** 90日後の方向性 */
  readonly day90Goal: string;

  /** MAIN TYPEとして表示する文章 */
  readonly mainResultText: string;
  /** SUB TYPEとして表示する文章 */
  readonly subResultText: string;

  /**
   * このタイプを表すキーワード。
   * 出典: docs/04_result-types.md §12
   */
  readonly keywords: readonly string[];

  /** 結果カード等で使うアイコン */
  readonly icon: TypeIconName;
  /**
   * ビジュアルモチーフ。
   * 色でタイプを区別しないため、モチーフで差をつける。
   * 出典: docs/08_web-spec.md §106
   */
  readonly motif: string;
};

/** 5タイプすべてが揃っていることを型で保証する */
export type ResultTypeContentMap = Readonly<Record<AIType, ResultTypeContent>>;

// ============================================================================
// 3. MAIN × SUB の組み合わせコンテンツ
// 出典: docs/04_result-combinations.md §33
// ============================================================================

/**
 * MAIN TYPE × SUB TYPE の組み合わせ文章（20パターン）。
 *
 * 組み合わせの順序には意味があり、
 * creator_builder と builder_creator は別物として扱う
 * （docs/04_result-combinations.md §5）。
 *
 * 注意:
 *   ここでの strengths は仕様書上「見出しのない一行の箇条書き」であり、
 *   タイプ別コンテンツの strengths（見出し + 説明）とは構造が異なる。
 *   仕様書に存在しない見出しを作らないため、文字列配列のまま保持する。
 */
export type ResultCombinationContent = {
  readonly id: CombinationId;
  readonly mainType: AIType;
  readonly subType: AIType;

  /** 表示名称（例: 制作 × 仕組み化タイプ） */
  readonly name: string;
  /** 結果カードにも使える一言 */
  readonly oneLine: string;
  /** 3〜5段落程度の説明 */
  readonly description: string;

  readonly strengths: readonly string[];
  readonly bestUses: readonly string[];
  /** つまずきやすいポイント（仕様書では1件の文章） */
  readonly watchOut: string;
  /** 次に進む方向。矢印でつながる手順として保持する */
  readonly firstDirection: readonly string[];
};

/** 20パターンすべてが揃っていることを型で保証する */
export type ResultCombinationContentMap = Readonly<
  Record<CombinationId, ResultCombinationContent>
>;

// ============================================================================
// 4. GOALコンテンツ
// 出典: docs/06_pdf-spec.md §22-25 / docs/01_diagnosis-spec.md §40
// ============================================================================

export type GoalContent = {
  readonly id: Goal;
  readonly short: GoalShort;
  /** 表示名称（例: 副業・収益化） */
  readonly name: string;
  /** 英語表示（例: SIDE） */
  readonly englishName: string;
  /**
   * 結果画面用の短い説明。
   * 例:「まずAIを使って、小さくても自分で収入を作る経験を目指すルートです。」
   */
  readonly resultSummary: string;
  /** PDF用の詳しい説明 */
  readonly description: string;
};

/** 3目的すべてが揃っていることを型で保証する */
export type GoalContentMap = Readonly<Record<Goal, GoalContent>>;

// ============================================================================
// 5. STYLEコンテンツ
// 出典: docs/02_scoring-system.md §27 / docs/04_result-types.md §17
//       docs/04_result-combinations.md §28
// ============================================================================

export type StyleContent = {
  readonly id: DiagnosisStyle;
  /** 表示名称（例: ハイブリッド型） */
  readonly name: string;
  /** 英語表示（例: HYBRID） */
  readonly englishName: string;
  /** このSTYLEの見せ方を説明する文章 */
  readonly description: string;
  /**
   * multi のときに組み合わせ文章の後へ追記する文章。
   * focused / hybrid では使用しないため任意。
   * 出典: docs/04_result-combinations.md §28
   */
  readonly extraNote?: string;
};

/** 3スタイルすべてが揃っていることを型で保証する */
export type StyleContentMap = Readonly<Record<DiagnosisStyle, StyleContent>>;
