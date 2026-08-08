/**
 * AI仕事診断｜同点処理（タイブレーク）
 *
 * 出典: docs/02_scoring-system.md §13-19, §40-41, §55-62
 *
 * タイプの比較順序:
 *   rawScore → Q7メイン加点 → Q6メイン加点 → メイン加点回数 → サブ加点回数 → 固定順
 *
 * 目的の比較順序:
 *   スコア → Q10で選択 → Q9で選択 → Q8で選択 → 固定順
 */

import {
  AI_TYPES,
  GOAL_TIEBREAK_ORDER,
  GOAL_TIEBREAK_QUESTION_ORDER,
  GOALS,
  TYPE_TIEBREAK_ORDER,
} from "@/lib/constants";
import type {
  AIType,
  Goal,
  GoalQuestionId,
  GoalScoreMap,
  TypeMetaMap,
} from "@/types/diagnosis";

/** boolean を比較用の数値へ変換する（true が上位） */
const flag = (value: boolean): number => (value ? 1 : 0);

/** 固定順の中での位置。小さいほど上位 */
const typeOrderIndex = (type: AIType): number =>
  TYPE_TIEBREAK_ORDER.indexOf(type);

/** 固定順の中での位置。小さいほど上位 */
const goalOrderIndex = (goal: Goal): number =>
  GOAL_TIEBREAK_ORDER.indexOf(goal);

/**
 * タイプ2件を比較する。
 *
 * @returns 負なら a が上位、正なら b が上位。0 は返らない（固定順で必ず決着する）
 */
export function compareTypes(a: AIType, b: AIType, meta: TypeMetaMap): number {
  const ma = meta[a];
  const mb = meta[b];

  // 1. 生点
  if (ma.rawScore !== mb.rawScore) {
    return mb.rawScore - ma.rawScore;
  }
  // 2. Q7でメイン加点(+3)を獲得したか
  if (ma.q7MainHit !== mb.q7MainHit) {
    return flag(mb.q7MainHit) - flag(ma.q7MainHit);
  }
  // 3. Q6でメイン加点(+2)を獲得したか
  if (ma.q6MainHit !== mb.q6MainHit) {
    return flag(mb.q6MainHit) - flag(ma.q6MainHit);
  }
  // 4. メイン加点の回数
  if (ma.mainHitCount !== mb.mainHitCount) {
    return mb.mainHitCount - ma.mainHitCount;
  }
  // 5. サブ加点の回数
  if (ma.subHitCount !== mb.subHitCount) {
    return mb.subHitCount - ma.subHitCount;
  }
  // 6. 固定順（実装上の最終手段）
  return typeOrderIndex(a) - typeOrderIndex(b);
}

/**
 * 5タイプを上位から順に並べる。
 *
 * 先頭が MAIN TYPE、2番目が SUB TYPE になる。
 * MAIN と SUB は必ず異なるタイプになる（docs/02_scoring-system.md §12）。
 */
export function rankTypes(meta: TypeMetaMap): readonly AIType[] {
  return [...AI_TYPES].sort((a, b) => compareTypes(a, b, meta));
}

/** 各GOAL質問でどの目的が選ばれたか */
export type GoalSelection = Readonly<
  Partial<Record<GoalQuestionId, Goal>>
>;

/**
 * 目的2件を比較する。
 *
 * @returns 負なら a が上位、正なら b が上位。0 は返らない
 */
export function compareGoals(
  a: Goal,
  b: Goal,
  scores: GoalScoreMap,
  selection: GoalSelection,
): number {
  // 1. スコア
  if (scores[a] !== scores[b]) {
    return scores[b] - scores[a];
  }
  // 2. Q10 → Q9 → Q8 の順に、その質問で選ばれた目的を優先する
  for (const questionId of GOAL_TIEBREAK_QUESTION_ORDER) {
    const selected = selection[questionId];
    if (selected === undefined) continue;
    if (selected === a && selected !== b) return -1;
    if (selected === b && selected !== a) return 1;
  }
  // 3. 固定順（both → work → side）
  return goalOrderIndex(a) - goalOrderIndex(b);
}

/**
 * 3目的を上位から順に並べる。
 *
 * 先頭が PRIMARY GOAL、2番目が SECONDARY GOAL になる。
 * SECONDARY は PRIMARY を除外した上で同じルールを適用する
 * （PRIMARY が既に先頭にあるため、並べ替えの結果をそのまま使えばよい）。
 */
export function rankGoals(
  scores: GoalScoreMap,
  selection: GoalSelection,
): readonly Goal[] {
  return [...GOALS].sort((a, b) => compareGoals(a, b, scores, selection));
}
