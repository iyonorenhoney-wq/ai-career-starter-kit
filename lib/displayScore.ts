/**
 * AI仕事診断｜AI活用スコア（表示スコア）への変換
 *
 * 出典: docs/02_scoring-system.md §28-34, §53
 *
 * 生点をそのままユーザーへ見せず、0〜100へ変換する。
 * 「適性率」「成功率」ではなく「AI活用スコア」と呼ぶ（同 §29）。
 */

import {
  AI_TYPES,
  MAX_DISPLAY_SCORE,
  MAX_TYPE_SCORE,
  MIN_DISPLAY_SCORE,
} from "@/lib/constants";
import type { TypeScoreMap } from "@/types/diagnosis";

/**
 * 生点1件を表示スコアへ変換する。
 *
 *   displayScore = round(rawScore / 15 × 100)
 *
 * 上限100・下限0で丸める（docs/02_scoring-system.md §32-33）。
 */
export function toDisplayScore(rawScore: number): number {
  const scaled = Math.round((rawScore / MAX_TYPE_SCORE) * MAX_DISPLAY_SCORE);
  return Math.min(MAX_DISPLAY_SCORE, Math.max(MIN_DISPLAY_SCORE, scaled));
}

/** 5タイプ分の生点をまとめて表示スコアへ変換する */
export function toDisplayScores(rawScores: TypeScoreMap): TypeScoreMap {
  const result = {} as Record<(typeof AI_TYPES)[number], number>;
  for (const type of AI_TYPES) {
    result[type] = toDisplayScore(rawScores[type]);
  }
  return result;
}
