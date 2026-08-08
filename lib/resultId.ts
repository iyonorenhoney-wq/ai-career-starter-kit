/**
 * AI仕事診断｜結果ID生成
 *
 * 出典: docs/02_scoring-system.md §65-66 / docs/01_diagnosis-spec.md §48-49
 *
 * 形式: AI-YYMMDD-XXXX  （例: AI-260808-X4K9）
 *
 * 個人情報は一切含めない。
 * Ver.1ではユーザー本人を特定するIDとして使用しない。
 */

import {
  RESULT_ID_ALPHABET,
  RESULT_ID_PREFIX,
  RESULT_ID_RANDOM_LENGTH,
} from "@/lib/constants";
import type { ResultId } from "@/types/diagnosis";

/** 2桁ゼロ埋め */
const pad2 = (value: number): string => String(value).padStart(2, "0");

/**
 * 結果IDを生成する。
 *
 * @param now 生成時刻。テストのために差し替え可能
 * @param random 0以上1未満の乱数を返す関数。テストのために差し替え可能
 */
export function createResultId(
  now: Date = new Date(),
  random: () => number = Math.random,
): ResultId {
  const yy = pad2(now.getFullYear() % 100);
  const mm = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());

  let suffix = "";
  for (let i = 0; i < RESULT_ID_RANDOM_LENGTH; i++) {
    const index = Math.floor(random() * RESULT_ID_ALPHABET.length);
    // random() が 1 を返す実装に備えて範囲内へ収める
    const safeIndex = Math.min(index, RESULT_ID_ALPHABET.length - 1);
    suffix += RESULT_ID_ALPHABET.charAt(safeIndex);
  }

  return `${RESULT_ID_PREFIX}-${yy}${mm}${dd}-${suffix}`;
}
