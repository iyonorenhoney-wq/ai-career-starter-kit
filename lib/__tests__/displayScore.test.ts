/**
 * AI活用スコア（表示スコア）変換のテスト
 * 出典: docs/02_scoring-system.md §28-34
 */

import { describe, expect, it } from "vitest";
import { toDisplayScore, toDisplayScores } from "@/lib/displayScore";

describe("toDisplayScore", () => {
  it("仕様書の例: rawScore 12 は 80 になる", () => {
    expect(toDisplayScore(12)).toBe(80);
  });

  it("理論最大値 15 は 100 になる", () => {
    expect(toDisplayScore(15)).toBe(100);
  });

  it("0点は 0 のまま", () => {
    expect(toDisplayScore(0)).toBe(0);
  });

  it("0〜15の全生点が 0〜100 に収まる", () => {
    for (let raw = 0; raw <= 15; raw++) {
      const score = toDisplayScore(raw);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("生点が上がれば表示スコアも下がらない（単調性）", () => {
    for (let raw = 1; raw <= 15; raw++) {
      expect(toDisplayScore(raw)).toBeGreaterThanOrEqual(
        toDisplayScore(raw - 1),
      );
    }
  });

  it("上限100を超えない", () => {
    expect(toDisplayScore(20)).toBe(100);
  });

  it("下限0を下回らない", () => {
    expect(toDisplayScore(-5)).toBe(0);
  });
});

describe("toDisplayScores", () => {
  it("5タイプすべてを変換する", () => {
    expect(
      toDisplayScores({
        smart_worker: 0,
        creator: 15,
        supporter: 3,
        producer: 6,
        builder: 12,
      }),
    ).toEqual({
      smart_worker: 0,
      creator: 100,
      supporter: 20,
      producer: 40,
      builder: 80,
    });
  });
});
