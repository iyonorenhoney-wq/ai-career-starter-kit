/**
 * 結果ID生成のテスト
 * 出典: docs/02_scoring-system.md §65-66 / docs/01_diagnosis-spec.md §48-49
 */

import { describe, expect, it } from "vitest";
import { RESULT_ID_ALPHABET } from "@/lib/constants";
import { createResultId } from "@/lib/resultId";

describe("createResultId", () => {
  it("AI-YYMMDD-XXXX の形式になる", () => {
    const id = createResultId(new Date(2026, 7, 8), () => 0);
    expect(id).toMatch(/^AI-\d{6}-[A-Z0-9]{4}$/);
  });

  it("仕様書の例と同じ日付部分になる（2026年8月8日 → 260808）", () => {
    const id = createResultId(new Date(2026, 7, 8), () => 0);
    expect(id.startsWith("AI-260808-")).toBe(true);
  });

  it("月日が1桁でもゼロ埋めされる", () => {
    const id = createResultId(new Date(2026, 0, 5), () => 0);
    expect(id.startsWith("AI-260105-")).toBe(true);
  });

  it("ランダム部分は4文字", () => {
    const id = createResultId(new Date(2026, 7, 8), () => 0.5);
    expect(id.split("-")[2]).toHaveLength(4);
  });

  it("ランダム部分は許可された文字のみを使う", () => {
    for (let i = 0; i < 200; i++) {
      const suffix = createResultId().split("-")[2] ?? "";
      for (const char of suffix) {
        expect(RESULT_ID_ALPHABET).toContain(char);
      }
    }
  });

  it("見間違えやすい文字（0 O 1 I L）を含まない", () => {
    for (const char of ["0", "O", "1", "I", "L"]) {
      expect(RESULT_ID_ALPHABET).not.toContain(char);
    }
  });

  it("乱数が1を返しても範囲外にならない", () => {
    const id = createResultId(new Date(2026, 7, 8), () => 1);
    expect(id).toMatch(/^AI-\d{6}-[A-Z0-9]{4}$/);
  });

  it("個人情報を含まない（日付とランダム文字のみ）", () => {
    const id = createResultId(new Date(2026, 7, 8), () => 0);
    expect(id.split("-")).toHaveLength(3);
  });

  it("連続生成しても同じ値ばかりにならない", () => {
    const ids = new Set(
      Array.from({ length: 100 }, () => createResultId(new Date(2026, 7, 8))),
    );
    expect(ids.size).toBeGreaterThan(50);
  });
});
