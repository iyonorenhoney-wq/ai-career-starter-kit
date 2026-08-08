/**
 * AI仕事診断｜STYLE判定
 *
 * 出典: docs/02_scoring-system.md §20-27
 *
 * 判定は表示スコア（0〜100）で行う（同 §22）。
 * 判定順序は multi → hybrid → focused（同 §26）。
 */

import { STYLE_THRESHOLD } from "@/lib/constants";
import type { AIType, DiagnosisStyle, TypeScoreMap } from "@/types/diagnosis";

/**
 * 順位づけ済みのタイプ配列と表示スコアからSTYLEを判定する。
 *
 * @param rankedTypes タイブレーク適用後の順位（1位から順に5件）
 * @param displayScores 表示スコア
 */
export function determineStyle(
  rankedTypes: readonly AIType[],
  displayScores: TypeScoreMap,
): DiagnosisStyle {
  const first = rankedTypes[0];
  const second = rankedTypes[1];
  const third = rankedTypes[2];

  // 5タイプ揃っていない場合は判定できないため、最も無難な focused とする。
  // 正常な質問データでは発生しない。
  if (first === undefined || second === undefined || third === undefined) {
    return "focused";
  }

  const top1 = displayScores[first];
  const top2 = displayScores[second];
  const top3 = displayScores[third];

  // 上位3タイプが閾値以内に収まっている
  if (top1 - top3 <= STYLE_THRESHOLD) {
    return "multi";
  }

  // 1位と2位が閾値以内
  if (top1 - top2 <= STYLE_THRESHOLD) {
    return "hybrid";
  }

  return "focused";
}
