/**
 * AI仕事診断｜GOAL（AI活用目的）の表示コンテンツ
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §6, §40（結果画面での表示）
 *   docs/06_pdf-spec.md §22-25（PDF用の説明文）
 *
 * 文章は仕様書から転記している。実装側の判断で言い換えない。
 */

import type { GoalContentMap } from "@/types/content";

export const goals: GoalContentMap = {
  work: {
    id: "work",
    short: "WORK",
    name: "本業活用",
    englishName: "WORK",
    resultSummary:
      "まず今の仕事へAIを取り入れ、目の前の仕事で成果を作ることを目指すルートです。",
    description:
      "あなたの現在のGOALは、「本業活用」です。まずは今の仕事へAIを取り入れ、時間短縮・品質改善・アイデア支援など、目の前の仕事で成果を作ることを優先します。",
  },

  side: {
    id: "side",
    short: "SIDE",
    name: "副業・収益化",
    englishName: "SIDE",
    resultSummary:
      "まずAIを使って、小さくても自分で収入を作る経験を目指すルートです。",
    description:
      "あなたの現在のGOALは、「副業・収益化」です。まずはAIを使って、小さくても自分で価値を提供し、最初の収益につながる行動を作ることを優先します。",
  },

  both: {
    id: "both",
    short: "BOTH",
    name: "本業＋副業",
    englishName: "BOTH",
    resultSummary:
      "本業でAI活用の経験を作りながら、将来的な収益化へも広げていくルートです。",
    description:
      "あなたの現在のGOALは、「本業＋副業」です。まず本業でAI活用の経験を作りながら、その経験やスキルを、将来的な副業・商品・サービスへ広げていきます。",
  },
};
