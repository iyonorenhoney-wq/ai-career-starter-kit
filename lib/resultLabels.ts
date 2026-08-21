/**
 * AI仕事診断｜結果画面の表示ラベル組み立て
 *
 * 出典:
 *   docs/02_scoring-system.md §27
 *   docs/04_result-types.md §17
 *   docs/04_result-combinations.md §28-30
 *   docs/08_web-spec.md §61, §71
 *
 * 表示の組み立てをここへ集約し、コンポーネント側を薄く保つ。
 */

import { goals } from "@/data/goals";
import { resultCombinations } from "@/data/resultCombinations";
import { resultTypes } from "@/data/resultTypes";
import { styles } from "@/data/styles";
import { AI_TYPES } from "@/lib/constants";
import type {
  GoalContent,
  ResultCombinationContent,
  ResultTypeContent,
  StyleContent,
} from "@/types/content";
import type { AIType, CombinationId, DiagnosisResult } from "@/types/diagnosis";

/** MAIN TYPE のコンテンツを取得する */
export function getMainType(result: DiagnosisResult): ResultTypeContent {
  return resultTypes[result.mainType];
}

/** SUB TYPE のコンテンツを取得する */
export function getSubType(result: DiagnosisResult): ResultTypeContent {
  return resultTypes[result.subType];
}

/**
 * MAIN × SUB の組み合わせコンテンツを取得する。
 *
 * MAINとSUBは必ず異なるため、20通りのいずれかに必ず一致する。
 */
export function getCombination(
  result: DiagnosisResult,
): ResultCombinationContent {
  const id = `${result.mainType}_${result.subType}` as CombinationId;
  return resultCombinations[id];
}

/** PRIMARY GOAL のコンテンツを取得する */
export function getGoal(result: DiagnosisResult): GoalContent {
  return goals[result.primaryGoal];
}

/** STYLE のコンテンツを取得する */
export function getStyle(result: DiagnosisResult): StyleContent {
  return styles[result.style];
}

/**
 * 攻略BOOKを特定するためのコード（例: CREATOR / SIDE）。
 *
 * 出典: docs/05_roadmaps.md §2, §20 / docs/06_pdf-spec.md §81
 *
 * 攻略BOOKは MAIN TYPE × GOAL の15冊で分かれている。
 * Ver.1では公式LINEへ送られたスクリーンショットを見て手動で配布するため、
 * どの1冊を送ればよいかがカード上で一目で分かるようにする。
 *
 * SUB TYPE と STYLE は配布するBOOKに影響しない。
 * 見間違いを防ぐため、STYLE（`×` でつなぐ）とは区切り文字を変え、
 * ここでは `/` を使う。
 *
 * routeId との対応:
 *   CREATOR / SIDE  ->  creator_side
 */
export function getBookCode(result: DiagnosisResult): string {
  const main = getMainType(result);
  const goal = getGoal(result);
  // 英語名から "AI " を外す（AI CREATOR -> CREATOR）
  const mainCode = main.englishName.replace(/^AI\s+/, "");
  return `${mainCode} / ${goal.englishName}`;
}

/** 結果カードなどで使うSTYLEの見せ方 */
export type StyleLabel = {
  /** 英字表記（結果カード用） */
  readonly english: string;
  /** 日本語表記 */
  readonly japanese: string;
};

/**
 * STYLEに応じた表示ラベルを組み立てる。
 *
 * focused … MAINを強く見せる（例: AIクリエイター特化型）
 * hybrid  … MAIN × SUB の組み合わせを強く見せる
 * multi   … 複数を組み合わせるタイプであることを見せる
 */
export function getStyleLabel(result: DiagnosisResult): StyleLabel {
  const main = getMainType(result);
  const sub = getSubType(result);

  // 英語名から "AI " を外した短い表記（例: AI CREATOR → CREATOR）
  const shortEn = (name: string): string => name.replace(/^AI\s+/, "");

  if (result.style === "hybrid") {
    return {
      english: `${shortEn(main.englishName)} × ${shortEn(sub.englishName)} HYBRID`,
      japanese: `${main.name} × ${sub.name} のハイブリッド型`,
    };
  }

  if (result.style === "multi") {
    return {
      english: "MULTI AI STYLE",
      japanese: "マルチAI活用型",
    };
  }

  return {
    english: `${shortEn(main.englishName)} FOCUSED`,
    japanese: `${main.name}特化型`,
  };
}

/** AI活用スコアの1行分 */
export type ScoreRow = {
  readonly type: AIType;
  /** レーダーチャートの軸ラベル（例: 制作） */
  readonly label: string;
  /** 0〜100の表示スコア */
  readonly score: number;
  /** MAIN TYPE の行か */
  readonly isMain: boolean;
  /** SUB TYPE の行か */
  readonly isSub: boolean;
};

/**
 * AI活用スコアの表示用データを作る。
 *
 * 軸の並びは常に同じにする（回答によって順番が変わると比較しづらいため）。
 */
export function getScoreRows(result: DiagnosisResult): readonly ScoreRow[] {
  return AI_TYPES.map((type) => ({
    type,
    label: resultTypes[type].scoreLabel,
    score: result.displayScores[type],
    isMain: type === result.mainType,
    isSub: type === result.subType,
  }));
}
