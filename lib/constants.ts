/**
 * AI仕事診断｜定数
 *
 * 出典: docs/02_scoring-system.md / docs/08_web-spec.md
 *
 * 採点に影響する数値はすべてこのファイルへ集約する。
 * 調整が必要になったとき、1箇所の変更で済むようにするため。
 */

import type { AIType, Goal, GoalQuestionId } from "@/types/diagnosis";

// ============================================================================
// 診断バージョン
// 出典: docs/02_scoring-system.md §70-73
// ============================================================================

/**
 * 診断バージョン。
 *
 * 質問変更   → マイナー更新（1.1.0）
 * 採点大幅変更 → メジャー更新（2.0.0）
 *
 * 保存データのバージョンがこれと異なる場合、古いデータは破棄する。
 */
export const DIAGNOSIS_VERSION = "1.0.0";

// ============================================================================
// タイプ・目的の一覧
// ============================================================================

/** 全AI活用タイプ（反復処理用） */
export const AI_TYPES = [
  "smart_worker",
  "creator",
  "supporter",
  "producer",
  "builder",
] as const satisfies readonly AIType[];

/** 全AI活用目的（反復処理用） */
export const GOALS = ["work", "side", "both"] as const satisfies readonly Goal[];

// ============================================================================
// スコア
// 出典: docs/02_scoring-system.md §30-33
// ============================================================================

/**
 * タイプ生点の理論最大値。
 *
 * Q1〜Q6でメイン加点(+2)を6回 = 12点、Q7でメイン加点(+3) = 3点。
 * 合計15点。data/questions.ts の実データでも検証済み。
 */
export const MAX_TYPE_SCORE = 15;

/** 表示スコア（AI活用スコア）の上限 */
export const MAX_DISPLAY_SCORE = 100;

/** 表示スコアの下限 */
export const MIN_DISPLAY_SCORE = 0;

// ============================================================================
// STYLE判定の閾値
// 出典: docs/02_scoring-system.md §23-26
// ============================================================================

/**
 * STYLE判定に使う表示スコアの差（ポイント）。
 *
 *   1位 - 3位 <= 閾値  → multi
 *   1位 - 2位 <= 閾値  → hybrid
 *   それ以外            → focused
 *
 * 仕様書の値は 10。
 * 実運用の納得度を見て調整できるよう、ここ1箇所で管理する。
 */
export const STYLE_THRESHOLD = 10;

// ============================================================================
// タイブレーク
// 出典: docs/02_scoring-system.md §13-19, §40-41, §61-62
// ============================================================================

/**
 * タイプの最終タイブレーク順。
 *
 * 診断上の優先順位ではなく、すべての比較項目が同値だった場合の
 * 実装上の最終手段（docs/02_scoring-system.md §18）。
 */
export const TYPE_TIEBREAK_ORDER = [
  "smart_worker",
  "creator",
  "supporter",
  "producer",
  "builder",
] as const satisfies readonly AIType[];

/**
 * 目的の最終タイブレーク順。
 *
 * 回答が完全に拮抗した場合、「両方」という柔軟なルートを優先する
 * （docs/02_scoring-system.md §41）。
 */
export const GOAL_TIEBREAK_ORDER = [
  "both",
  "work",
  "side",
] as const satisfies readonly Goal[];

/**
 * GOAL同点時に参照する質問の優先順位。
 * Q10 → Q9 → Q8 の順（docs/02_scoring-system.md §40）。
 */
export const GOAL_TIEBREAK_QUESTION_ORDER = [
  "q10",
  "q9",
  "q8",
] as const satisfies readonly GoalQuestionId[];

// ============================================================================
// 結果ID
// 出典: docs/02_scoring-system.md §65 / docs/01_diagnosis-spec.md §49
// ============================================================================

/** 結果IDの接頭辞。形式は `AI-YYMMDD-XXXX` */
export const RESULT_ID_PREFIX = "AI";

/** 結果IDのランダム部分の文字数 */
export const RESULT_ID_RANDOM_LENGTH = 4;

/**
 * 結果IDに使う文字。
 *
 * ユーザーが問い合わせ時に読み上げ・入力する可能性があるため、
 * 見間違えやすい文字（0/O、1/I/L）を除外している。
 */
export const RESULT_ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// ============================================================================
// localStorage
// 出典: docs/08_web-spec.md §85-86
// ============================================================================

/** localStorageのキー */
export const STORAGE_KEYS = {
  progress: "aiCareerDiagnosisProgress",
  result: "aiCareerDiagnosisResult",
} as const;

// ============================================================================
// 公式LINE
// 出典: docs/01_diagnosis-spec.md §46 / docs/08_web-spec.md §79, §125
// ============================================================================

/**
 * 公式LINEの友だち追加URL。
 *
 * コード内へ直接書かず環境変数で管理する。
 * 未設定のまま公開されても事故にならないよう、未設定時はCTAを押せなくする。
 */
export const LINE_URL = (process.env.NEXT_PUBLIC_LINE_URL ?? "").trim();

/** 公式LINEのURLが設定済みか */
export const IS_LINE_URL_CONFIGURED = LINE_URL.length > 0;

// ============================================================================
// 画面の挙動
// 出典: docs/01_diagnosis-spec.md §15, §70 / docs/08_web-spec.md §47, §49
// ============================================================================

/**
 * 回答カードをタップしてから次の質問へ進むまでの待ち時間（ミリ秒）。
 *
 * 選択状態が見えないまま画面が変わらないよう、200〜350msの範囲に収める。
 */
export const ANSWER_ADVANCE_DELAY_MS = 280;

/** 計算演出の1メッセージあたりの表示時間（ミリ秒） */
export const CALCULATING_STEP_MS = 500;

/**
 * 計算演出のメッセージ。
 * 出典: docs/01_diagnosis-spec.md §71 / docs/08_web-spec.md §49
 */
export const CALCULATING_MESSAGES = [
  "AI活用タイプを分析中",
  "あなたの強みを整理中",
  "おすすめルートを作成中",
] as const;

/** 計算演出の合計時間（ミリ秒）。約1〜2秒に収める */
export const CALCULATING_TOTAL_MS =
  CALCULATING_STEP_MS * CALCULATING_MESSAGES.length;
