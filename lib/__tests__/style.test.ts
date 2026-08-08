/**
 * STYLE判定のテスト
 * 出典: docs/02_scoring-system.md §20-27
 */

import { describe, expect, it } from "vitest";
import { STYLE_THRESHOLD } from "@/lib/constants";
import { determineStyle } from "@/lib/style";
import type { AIType, TypeScoreMap } from "@/types/diagnosis";

/** 表示スコアから、その順位どおりのタイプ配列を作るヘルパー */
const ranked: readonly AIType[] = [
  "creator",
  "builder",
  "producer",
  "smart_worker",
  "supporter",
];

const scores = (
  creator: number,
  builder: number,
  producer: number,
): TypeScoreMap => ({
  creator,
  builder,
  producer,
  smart_worker: 0,
  supporter: 0,
});

describe("determineStyle", () => {
  it("閾値は仕様書どおり10", () => {
    expect(STYLE_THRESHOLD).toBe(10);
  });

  it("仕様書 §23 の例: 86 と 80（差6）は hybrid", () => {
    expect(determineStyle(ranked, scores(86, 80, 40))).toBe("hybrid");
  });

  it("仕様書 §24 の例: 91 と 73（差18）は focused", () => {
    expect(determineStyle(ranked, scores(91, 73, 40))).toBe("focused");
  });

  it("仕様書 §25 の例: 上位3タイプが 81 / 77 / 74（1位-3位が7）は multi", () => {
    expect(determineStyle(ranked, scores(81, 77, 74))).toBe("multi");
  });

  it("1位-2位がちょうど10なら hybrid（境界値）", () => {
    expect(determineStyle(ranked, scores(90, 80, 40))).toBe("hybrid");
  });

  it("1位-2位が11なら focused（境界値）", () => {
    expect(determineStyle(ranked, scores(91, 80, 40))).toBe("focused");
  });

  it("1位-3位がちょうど10なら multi（境界値）", () => {
    expect(determineStyle(ranked, scores(90, 85, 80))).toBe("multi");
  });

  it("1位-3位が11なら multi にならない（境界値）", () => {
    expect(determineStyle(ranked, scores(91, 85, 80))).toBe("hybrid");
  });

  it("multi判定が hybrid より優先される（判定順序 §26）", () => {
    // 1位-2位も1位-3位も閾値以内 → multi が優先
    expect(determineStyle(ranked, scores(80, 78, 75))).toBe("multi");
  });

  it("全タイプ同点なら multi", () => {
    expect(determineStyle(ranked, scores(50, 50, 50))).toBe("multi");
  });
});
