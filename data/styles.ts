/**
 * AI仕事診断｜STYLE（AI活用スタイル）の表示コンテンツ
 *
 * 出典:
 *   docs/02_scoring-system.md §21, §27
 *   docs/04_result-types.md §17
 *   docs/04_result-combinations.md §28
 *
 * STYLEによって、MAINとSUBのどちらを強く見せるかを変える。
 */

import type { StyleContentMap } from "@/types/content";

export const styles: StyleContentMap = {
  focused: {
    id: "focused",
    name: "特化型",
    englishName: "FOCUSED",
    description:
      "あなたは1つの方向がはっきり出ているタイプです。まずはMAIN TYPEを軸に進めると迷いにくくなります。",
  },

  hybrid: {
    id: "hybrid",
    name: "ハイブリッド型",
    englishName: "HYBRID",
    description:
      "あなたは、MAIN TYPEとSUB TYPEの2つを組み合わせることで力を発揮しやすいタイプです。",
  },

  multi: {
    id: "multi",
    name: "マルチAI活用型",
    englishName: "MULTI",
    description:
      "あなたは1つの方向へ特化するより、複数のAI活用を組み合わせることで力を発揮しやすいタイプです。",
    extraNote:
      "まずはMAIN TYPEを軸に進みながら、必要に応じて他の強みを取り入れていきましょう。",
  },
};
