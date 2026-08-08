/**
 * AI仕事診断｜採点ロジック
 *
 * 出典: docs/02_scoring-system.md
 *
 * 設計方針:
 *   - Reactに依存しない純関数として実装する（docs/08_web-spec.md §91）
 *   - 回答選択時にスコアを加算し続けず、完了時に answers からゼロベースで
 *     再計算する（docs/02_scoring-system.md §84）。戻る・回答変更に強くするため
 *   - 失敗は例外ではなく戻り値で表現し、呼び出し側に必ず処理させる
 */

import { AI_TYPES, GOALS } from "@/lib/constants";
import { toDisplayScores } from "@/lib/displayScore";
import { createResultId } from "@/lib/resultId";
import { determineStyle } from "@/lib/style";
import { rankGoals, rankTypes, type GoalSelection } from "@/lib/tiebreak";
import { questions } from "@/data/questions";
import type {
  AIType,
  AnswerMap,
  CompletedAnswerMap,
  Goal,
  GoalScoreMap,
  OptionId,
  QuestionOption,
  RouteId,
  ScoringOutcome,
  TypeMeta,
  TypeMetaMap,
  TypeScoreMap,
} from "@/types/diagnosis";

// ============================================================================
// 質問データの索引
// ============================================================================

/** Option ID から選択肢を引くための索引 */
const OPTION_BY_ID: ReadonlyMap<string, QuestionOption> = new Map(
  questions.flatMap((question) =>
    question.options.map((option) => [option.id, option] as const),
  ),
);

/**
 * メイン加点かどうかの判定。
 *
 * Q1〜Q6のメインは +2、Q7のメインは +3、サブは常に +1
 * （docs/02_scoring-system.md §6-7）。
 * したがって2点以上をメイン加点とみなす。
 */
const isMainPoints = (points: number): boolean => points >= 2;

// ============================================================================
// 回答の検証
// ============================================================================

export type AnswerValidation =
  | { readonly ok: true; readonly answers: CompletedAnswerMap }
  | {
      readonly ok: false;
      readonly reason: "incomplete_answers" | "unknown_option";
    };

/**
 * 回答が採点可能な状態かを検証する。
 *
 * - 全10問が回答済みか（docs/02_scoring-system.md §68）
 * - 選択肢IDが実在し、正しい質問に属しているか（同 §69）
 *
 * localStorage から復元したデータも通すため、型だけに頼らず実行時に検証する。
 */
export function validateAnswers(answers: AnswerMap): AnswerValidation {
  const validated: Partial<Record<string, OptionId>> = {};

  for (const question of questions) {
    const optionId = answers[question.id];

    if (optionId === undefined) {
      return { ok: false, reason: "incomplete_answers" };
    }

    const belongsToQuestion = question.options.some(
      (option) => option.id === optionId,
    );
    if (!belongsToQuestion) {
      return { ok: false, reason: "unknown_option" };
    }

    validated[question.id] = optionId;
  }

  return { ok: true, answers: validated as CompletedAnswerMap };
}

// ============================================================================
// 集計
// ============================================================================

/** 採点の中間集計。テストと分析から参照できるよう公開する */
export type ScoreBreakdown = {
  readonly rawScores: TypeScoreMap;
  readonly goalScores: GoalScoreMap;
  readonly typeMeta: TypeMetaMap;
  readonly goalSelection: GoalSelection;
};

/**
 * 回答からスコアとタイブレーク情報を集計する。
 *
 * 呼び出し前に validateAnswers を通していることを前提とする。
 */
export function computeScoreBreakdown(
  answers: CompletedAnswerMap,
): ScoreBreakdown {
  const rawScores: Record<AIType, number> = {
    smart_worker: 0,
    creator: 0,
    supporter: 0,
    producer: 0,
    builder: 0,
  };
  const goalScores: Record<Goal, number> = { work: 0, side: 0, both: 0 };
  const goalSelection: Partial<Record<"q8" | "q9" | "q10", Goal>> = {};

  const mainHitCount: Record<AIType, number> = {
    smart_worker: 0,
    creator: 0,
    supporter: 0,
    producer: 0,
    builder: 0,
  };
  const subHitCount: Record<AIType, number> = {
    smart_worker: 0,
    creator: 0,
    supporter: 0,
    producer: 0,
    builder: 0,
  };
  const q7MainHit: Record<AIType, boolean> = {
    smart_worker: false,
    creator: false,
    supporter: false,
    producer: false,
    builder: false,
  };
  const q6MainHit: Record<AIType, boolean> = {
    smart_worker: false,
    creator: false,
    supporter: false,
    producer: false,
    builder: false,
  };

  for (const question of questions) {
    const optionId = answers[question.id];
    const option = OPTION_BY_ID.get(optionId);
    if (option === undefined) continue;

    if ("scores" in option) {
      for (const score of option.scores) {
        rawScores[score.type] += score.points;

        if (isMainPoints(score.points)) {
          mainHitCount[score.type] += 1;
          if (question.id === "q7") q7MainHit[score.type] = true;
          if (question.id === "q6") q6MainHit[score.type] = true;
        } else {
          subHitCount[score.type] += 1;
        }
      }
    } else {
      for (const score of option.goalScores) {
        goalScores[score.goal] += score.points;
      }
      // GOAL同点時に「その質問で何を選んだか」を参照するため保持する
      const firstGoal = option.goalScores[0];
      if (question.category === "goal") {
        goalSelection[question.id] = firstGoal.goal;
      }
    }
  }

  const typeMeta = {} as Record<AIType, TypeMeta>;
  for (const type of AI_TYPES) {
    typeMeta[type] = {
      rawScore: rawScores[type],
      mainHitCount: mainHitCount[type],
      subHitCount: subHitCount[type],
      q7MainHit: q7MainHit[type],
      q6MainHit: q6MainHit[type],
    };
  }

  return { rawScores, goalScores, typeMeta, goalSelection };
}

// ============================================================================
// 採点
// ============================================================================

export type ScoringOptions = {
  /** 完了時刻。テストのために差し替え可能 */
  readonly now?: Date;
  /** 結果ID生成に使う乱数。テストのために差し替え可能 */
  readonly random?: () => number;
};

/**
 * 診断結果を算出する。
 *
 * 未回答・不正な選択肢・全スコア0のいずれかであれば結果を生成せず、
 * 理由つきで失敗を返す（docs/02_scoring-system.md §67-69）。
 */
export function scoreDiagnosis(
  answers: AnswerMap,
  options: ScoringOptions = {},
): ScoringOutcome {
  const validation = validateAnswers(answers);
  if (!validation.ok) {
    return { ok: false, reason: validation.reason };
  }

  const { rawScores, goalScores, typeMeta, goalSelection } =
    computeScoreBreakdown(validation.answers);

  // 正常な質問データでは起こらないが、データ破損時の保険
  const hasAnyScore = AI_TYPES.some((type) => rawScores[type] > 0);
  if (!hasAnyScore) {
    return { ok: false, reason: "all_scores_zero" };
  }

  const rankedTypes = rankTypes(typeMeta);
  const rankedGoals = rankGoals(goalScores, goalSelection);

  const mainType = rankedTypes[0];
  const subType = rankedTypes[1];
  const primaryGoal = rankedGoals[0];
  const secondaryGoal = rankedGoals[1];

  // AI_TYPES / GOALS が空でない限り成立する。型を絞るためのガード
  if (
    mainType === undefined ||
    subType === undefined ||
    primaryGoal === undefined ||
    secondaryGoal === undefined
  ) {
    return { ok: false, reason: "all_scores_zero" };
  }

  const displayScores = toDisplayScores(rawScores);
  const style = determineStyle(rankedTypes, displayScores);

  const now = options.now ?? new Date();
  const routeId: RouteId = `${mainType}_${primaryGoal}`;

  return {
    ok: true,
    result: {
      resultId: createResultId(now, options.random),
      mainType,
      subType,
      primaryGoal,
      secondaryGoal,
      style,
      rawScores,
      displayScores,
      goalScores,
      routeId,
      completedAt: now.toISOString(),
    },
  };
}

/** 反復処理用に再エクスポート（分析・テストの利便性のため） */
export { AI_TYPES, GOALS };
