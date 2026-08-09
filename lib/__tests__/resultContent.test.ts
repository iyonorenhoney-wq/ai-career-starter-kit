/**
 * 結果コンテンツの網羅テスト
 *
 * 出典:
 *   docs/04_result-types.md §28
 *   docs/04_result-combinations.md §36-37
 *   docs/06_pdf-spec.md §22-25
 *
 * 診断結果はどのタイプ・目的の組み合わせでも表示できなければならない。
 * 1件でも欠けると本番で空欄になるため、全件を機械的に確認する。
 */

import { describe, expect, it } from "vitest";
import { goals } from "@/data/goals";
import { resultCombinations } from "@/data/resultCombinations";
import { resultTypes } from "@/data/resultTypes";
import { styles } from "@/data/styles";
import { AI_TYPES, GOALS } from "@/lib/constants";
import {
  getCombination,
  getGoal,
  getMainType,
  getScoreRows,
  getStyle,
  getStyleLabel,
  getSubType,
} from "@/lib/resultLabels";
import type {
  AIType,
  DiagnosisResult,
  DiagnosisStyle,
  Goal,
} from "@/types/diagnosis";

const DIAGNOSIS_STYLES: readonly DiagnosisStyle[] = [
  "focused",
  "hybrid",
  "multi",
];

/** テスト用の診断結果を組み立てる */
function buildResult(
  mainType: AIType,
  subType: AIType,
  primaryGoal: Goal = "work",
  style: DiagnosisStyle = "focused",
): DiagnosisResult {
  return {
    resultId: "AI-260809-TEST",
    mainType,
    subType,
    primaryGoal,
    secondaryGoal: primaryGoal === "both" ? "work" : "both",
    style,
    rawScores: {
      smart_worker: 3,
      creator: 12,
      supporter: 2,
      producer: 5,
      builder: 8,
    },
    displayScores: {
      smart_worker: 20,
      creator: 80,
      supporter: 13,
      producer: 33,
      builder: 53,
    },
    goalScores: { work: 7, side: 0, both: 0 },
    routeId: `${mainType}_${primaryGoal}`,
    completedAt: "2026-08-09T00:00:00.000Z",
  };
}

// ============================================================================
describe("5タイプの結果文章", () => {
  it("5タイプすべてが存在する", () => {
    expect(Object.keys(resultTypes).sort()).toEqual([...AI_TYPES].sort());
  });

  it.each([...AI_TYPES])("%s の必須項目がすべて埋まっている", (type) => {
    const content = resultTypes[type];

    // id は自分自身と一致している
    expect(content.id).toBe(type);

    // 文字列項目が空でない
    for (const key of [
      "short",
      "name",
      "englishName",
      "category",
      "scoreLabel",
      "catchCopy",
      "shortDiagnosis",
      "description",
      "day30Goal",
      "day90Goal",
      "mainResultText",
      "subResultText",
      "motif",
    ] as const) {
      expect(content[key].length, `${type}.${key}`).toBeGreaterThan(0);
    }

    // 今日の一歩は見出しと説明の両方を持つ
    expect(content.firstAction.title.length).toBeGreaterThan(0);
    expect(content.firstAction.body.length).toBeGreaterThan(0);
  });

  it.each([...AI_TYPES])("%s は強み5つ・注意ポイント5つを持つ", (type) => {
    const content = resultTypes[type];
    expect(content.strengths).toHaveLength(5);
    expect(content.cautions).toHaveLength(5);

    // すべて { title, body } が埋まっている
    for (const item of [...content.strengths, ...content.cautions]) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it.each([...AI_TYPES])("%s は活用例・仕事・ツール・学習順を持つ", (type) => {
    const content = resultTypes[type];
    expect(content.useCases.length).toBeGreaterThan(0);
    expect(content.jobs.length).toBeGreaterThan(0);
    expect(content.recommendedTools.length).toBeGreaterThan(0);
    expect(content.learningSteps).toHaveLength(8);
    expect(content.keywords.length).toBeGreaterThan(0);
  });

  it("学習順は1から連番になっている", () => {
    for (const type of AI_TYPES) {
      const steps = resultTypes[type].learningSteps.map((s) => s.step);
      expect(steps).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });

  it("英語名・日本語名・スコアラベルがタイプごとに重複しない", () => {
    const englishNames = AI_TYPES.map((t) => resultTypes[t].englishName);
    const names = AI_TYPES.map((t) => resultTypes[t].name);
    const scoreLabels = AI_TYPES.map((t) => resultTypes[t].scoreLabel);
    expect(new Set(englishNames).size).toBe(5);
    expect(new Set(names).size).toBe(5);
    expect(new Set(scoreLabels).size).toBe(5);
  });

  it("レーダーチャートの軸ラベルは仕様書どおり（08 §71）", () => {
    expect(AI_TYPES.map((t) => resultTypes[t].scoreLabel)).toEqual([
      "仕事効率化",
      "制作",
      "サポート",
      "商品化",
      "仕組み化",
    ]);
  });
});

// ============================================================================
describe("MAIN × SUB の20パターン", () => {
  it("ちょうど20件ある", () => {
    expect(Object.keys(resultCombinations)).toHaveLength(20);
  });

  it("MAINとSUBが同一の組み合わせは存在しない", () => {
    for (const combination of Object.values(resultCombinations)) {
      expect(combination.mainType).not.toBe(combination.subType);
    }
  });

  it("id と mainType / subType が一致している", () => {
    for (const [id, combination] of Object.entries(resultCombinations)) {
      expect(id).toBe(`${combination.mainType}_${combination.subType}`);
      expect(combination.id).toBe(id);
    }
  });

  it("すべての組み合わせで必須項目が埋まっている", () => {
    for (const combination of Object.values(resultCombinations)) {
      expect(combination.name.length, combination.id).toBeGreaterThan(0);
      expect(combination.oneLine.length, combination.id).toBeGreaterThan(0);
      expect(combination.description.length, combination.id).toBeGreaterThan(0);
      expect(combination.watchOut.length, combination.id).toBeGreaterThan(0);
      expect(combination.strengths.length, combination.id).toBeGreaterThanOrEqual(3);
      expect(combination.bestUses.length, combination.id).toBeGreaterThan(0);
      expect(combination.firstDirection.length, combination.id).toBeGreaterThan(0);
    }
  });

  it("MAINとSUBの全組み合わせ（20通り）から必ず文章を取得できる", () => {
    let checked = 0;
    for (const mainType of AI_TYPES) {
      for (const subType of AI_TYPES) {
        if (mainType === subType) continue;
        const combination = getCombination(buildResult(mainType, subType));
        expect(combination.mainType).toBe(mainType);
        expect(combination.subType).toBe(subType);
        checked++;
      }
    }
    expect(checked).toBe(20);
  });

  it("順序が逆の組み合わせは別の文章になっている（§5）", () => {
    expect(resultCombinations.creator_builder.name).not.toBe(
      resultCombinations.builder_creator.name,
    );
    expect(resultCombinations.creator_builder.oneLine).not.toBe(
      resultCombinations.builder_creator.oneLine,
    );
  });
});

// ============================================================================
describe("GOAL", () => {
  it("3目的すべてが存在する", () => {
    expect(Object.keys(goals).sort()).toEqual([...GOALS].sort());
  });

  it("表示名称が仕様書どおり", () => {
    expect(goals.work.name).toBe("本業活用");
    expect(goals.side.name).toBe("副業・収益化");
    expect(goals.both.name).toBe("本業＋副業");
  });

  it.each([...GOALS])("%s の必須項目が埋まっている", (goal) => {
    const content = goals[goal];
    expect(content.id).toBe(goal);
    expect(content.short.length).toBeGreaterThan(0);
    expect(content.englishName.length).toBeGreaterThan(0);
    expect(content.resultSummary.length).toBeGreaterThan(0);
    expect(content.description.length).toBeGreaterThan(0);
  });

  it("結果から必ずGOALを取得できる", () => {
    for (const goal of GOALS) {
      expect(getGoal(buildResult("creator", "builder", goal)).id).toBe(goal);
    }
  });
});

// ============================================================================
describe("STYLE", () => {
  it("3スタイルすべてが存在する", () => {
    expect(Object.keys(styles).sort()).toEqual([...DIAGNOSIS_STYLES].sort());
  });

  it("表示名称が仕様書どおり（02 §27）", () => {
    expect(styles.focused.name).toBe("特化型");
    expect(styles.hybrid.name).toBe("ハイブリッド型");
    expect(styles.multi.name).toBe("マルチAI活用型");
  });

  it("multi だけが補足文を持つ（04_result-combinations §28）", () => {
    expect(styles.multi.extraNote).toBeDefined();
    expect(styles.focused.extraNote).toBeUndefined();
    expect(styles.hybrid.extraNote).toBeUndefined();
  });

  it("結果から必ずSTYLEを取得できる", () => {
    for (const style of DIAGNOSIS_STYLES) {
      expect(getStyle(buildResult("creator", "builder", "work", style)).id).toBe(
        style,
      );
    }
  });
});

// ============================================================================
describe("表示ラベルの組み立て", () => {
  it("focused は MAIN を強く見せる", () => {
    const label = getStyleLabel(
      buildResult("creator", "builder", "work", "focused"),
    );
    expect(label.english).toBe("CREATOR FOCUSED");
    expect(label.japanese).toBe("AIクリエイター特化型");
  });

  it("hybrid は MAIN × SUB を見せる", () => {
    const label = getStyleLabel(
      buildResult("creator", "builder", "work", "hybrid"),
    );
    expect(label.english).toBe("CREATOR × BUILDER HYBRID");
    expect(label.japanese).toContain("AIクリエイター");
    expect(label.japanese).toContain("AIビルダー");
  });

  it("multi は複数活用型として見せる", () => {
    const label = getStyleLabel(
      buildResult("smart_worker", "supporter", "work", "multi"),
    );
    expect(label.japanese).toBe("マルチAI活用型");
  });

  it("どのSTYLEでもラベルが空にならない", () => {
    for (const style of DIAGNOSIS_STYLES) {
      for (const mainType of AI_TYPES) {
        for (const subType of AI_TYPES) {
          if (mainType === subType) continue;
          const label = getStyleLabel(
            buildResult(mainType, subType, "work", style),
          );
          expect(label.english.length).toBeGreaterThan(0);
          expect(label.japanese.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("MAIN / SUB のコンテンツを取得できる", () => {
    const result = buildResult("producer", "supporter");
    expect(getMainType(result).id).toBe("producer");
    expect(getSubType(result).id).toBe("supporter");
  });
});

// ============================================================================
describe("AI活用スコアの表示データ", () => {
  const result = buildResult("creator", "builder");
  const rows = getScoreRows(result);

  it("5タイプすべての行を返す", () => {
    expect(rows).toHaveLength(5);
    expect(rows.map((r) => r.type)).toEqual([...AI_TYPES]);
  });

  it("スコアが診断結果の表示スコアと一致する", () => {
    for (const row of rows) {
      expect(row.score).toBe(result.displayScores[row.type]);
    }
  });

  it("軸の並びは常に同じ", () => {
    const other = getScoreRows(buildResult("builder", "supporter"));
    expect(other.map((r) => r.label)).toEqual(rows.map((r) => r.label));
  });

  it("MAIN と SUB に印がつく", () => {
    expect(rows.filter((r) => r.isMain).map((r) => r.type)).toEqual(["creator"]);
    expect(rows.filter((r) => r.isSub).map((r) => r.type)).toEqual(["builder"]);
  });
});
