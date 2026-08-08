/**
 * タイプ判定（Q1〜Q7）の全パターン網羅テスト
 *
 * 5択 × 7問 = 78,125通りをすべて採点し、
 * 仕様上どのケースでも崩れてはいけない条件を検証する。
 *
 * 出典: docs/02_scoring-system.md §12, §30-33 / docs/08_web-spec.md §92
 */

import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";
import { AI_TYPES, MAX_TYPE_SCORE } from "@/lib/constants";
import { scoreDiagnosis } from "@/lib/scoring";
import type { AnswerMap, DiagnosisResult, OptionId } from "@/types/diagnosis";

const TYPE_QUESTIONS = questions.filter((q) => q.category === "type");
const TOTAL_PATTERNS = 5 ** 7;

/** 目的判定は固定する（タイプ判定の網羅が目的のため） */
const GOAL_ANSWERS = {
  q8: "q8_a",
  q9: "q9_b",
  q10: "q10_a",
} as const satisfies Partial<AnswerMap>;

/** n番目のパターンに対応する回答を組み立てる */
function buildAnswers(patternIndex: number): AnswerMap {
  const answers: Record<string, OptionId> = { ...GOAL_ANSWERS };
  let rest = patternIndex;
  for (let i = TYPE_QUESTIONS.length - 1; i >= 0; i--) {
    const question = TYPE_QUESTIONS[i];
    if (!question) continue;
    const option = question.options[rest % 5];
    if (option) answers[question.id] = option.id;
    rest = Math.floor(rest / 5);
  }
  return answers as AnswerMap;
}

/** 全パターンを1度だけ採点してキャッシュする */
const allResults: DiagnosisResult[] = [];
for (let i = 0; i < TOTAL_PATTERNS; i++) {
  const outcome = scoreDiagnosis(buildAnswers(i));
  if (outcome.ok) allResults.push(outcome.result);
}

describe("全78,125パターンの不変条件", () => {
  it("すべてのパターンで採点が成功する", () => {
    expect(allResults).toHaveLength(TOTAL_PATTERNS);
  });

  it("MAIN と SUB が同じになるケースは1件もない（§12）", () => {
    const violations = allResults.filter((r) => r.mainType === r.subType);
    expect(violations).toHaveLength(0);
  });

  it("生点は必ず 0〜15 に収まる（§30）", () => {
    const violations = allResults.filter((r) =>
      AI_TYPES.some(
        (type) => r.rawScores[type] < 0 || r.rawScores[type] > MAX_TYPE_SCORE,
      ),
    );
    expect(violations).toHaveLength(0);
  });

  it("表示スコアは必ず 0〜100 に収まる（§32-33）", () => {
    const violations = allResults.filter((r) =>
      AI_TYPES.some(
        (type) =>
          r.displayScores[type] < 0 || r.displayScores[type] > 100,
      ),
    );
    expect(violations).toHaveLength(0);
  });

  it("MAIN の生点は他のどのタイプ以上でもある", () => {
    const violations = allResults.filter((r) =>
      AI_TYPES.some((type) => r.rawScores[type] > r.rawScores[r.mainType]),
    );
    expect(violations).toHaveLength(0);
  });

  it("SUB の生点は MAIN 以下で、かつ MAIN 以外のどのタイプ以上でもある", () => {
    const violations = allResults.filter((r) => {
      if (r.rawScores[r.subType] > r.rawScores[r.mainType]) return true;
      return AI_TYPES.some(
        (type) =>
          type !== r.mainType && r.rawScores[type] > r.rawScores[r.subType],
      );
    });
    expect(violations).toHaveLength(0);
  });

  it("STYLE は必ず focused / hybrid / multi のいずれかになる", () => {
    const styles = new Set(allResults.map((r) => r.style));
    expect([...styles].sort()).toEqual(["focused", "hybrid", "multi"]);
  });

  it("routeId は 15ルートのいずれかになる", () => {
    const routeIds = new Set(allResults.map((r) => r.routeId));
    // 目的を work に固定しているため、この網羅では5ルートが出現する
    expect(routeIds.size).toBe(5);
    for (const routeId of routeIds) {
      expect(routeId.endsWith("_work")).toBe(true);
    }
  });

  it("5タイプすべてが MAIN として出現しうる", () => {
    const mainTypes = new Set(allResults.map((r) => r.mainType));
    expect([...mainTypes].sort()).toEqual([...AI_TYPES].sort());
  });

  it("目的判定の全27パターンで PRIMARY が単独最大になる", () => {
    const goalOptions = [
      ["q8_a", "q8_b", "q8_c"],
      ["q9_a", "q9_b", "q9_c"],
      ["q10_a", "q10_b", "q10_c"],
    ] as const;

    let checked = 0;
    for (const q8 of goalOptions[0]) {
      for (const q9 of goalOptions[1]) {
        for (const q10 of goalOptions[2]) {
          const outcome = scoreDiagnosis({
            ...buildAnswers(0),
            q8,
            q9,
            q10,
          } as AnswerMap);
          if (!outcome.ok) throw new Error("採点に失敗した");
          const { primaryGoal, secondaryGoal, goalScores } = outcome.result;

          // PRIMARY は最大値であり、同点の相手がいない
          const maxScore = Math.max(...Object.values(goalScores));
          expect(goalScores[primaryGoal]).toBe(maxScore);
          expect(
            Object.values(goalScores).filter((s) => s === maxScore),
          ).toHaveLength(1);

          // SECONDARY は PRIMARY と異なり、PRIMARY 以下
          expect(secondaryGoal).not.toBe(primaryGoal);
          expect(goalScores[secondaryGoal]).toBeLessThanOrEqual(maxScore);

          checked++;
        }
      }
    }
    expect(checked).toBe(27);
  });

  it("同じ回答なら常に同じ判定になる（決定性）", () => {
    // 結果IDと完了時刻は生成のたびに変わるため、比較対象から外す
    const withoutVolatile = (result: DiagnosisResult) => ({
      ...result,
      resultId: "",
      completedAt: "",
    });

    for (const index of [0, 12345, 40000, 78124]) {
      const first = scoreDiagnosis(buildAnswers(index));
      const second = scoreDiagnosis(buildAnswers(index));
      if (!first.ok || !second.ok) throw new Error("採点に失敗した");
      expect(withoutVolatile(first.result)).toEqual(
        withoutVolatile(second.result),
      );
    }
  });
});
