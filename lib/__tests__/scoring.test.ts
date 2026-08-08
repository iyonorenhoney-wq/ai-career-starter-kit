/**
 * 採点ロジックのテスト
 *
 * 出典:
 *   docs/02_scoring-system.md §74-84（テストケース）
 *   docs/03_question-bank.md §21-26（回答例）
 */

import { describe, expect, it } from "vitest";
import {
  computeScoreBreakdown,
  scoreDiagnosis,
  validateAnswers,
} from "@/lib/scoring";
import type { AnswerMap, OptionId, QuestionId } from "@/types/diagnosis";

/** 固定の生成条件。結果IDと完了時刻をテスト間で安定させる */
const FIXED = {
  now: new Date(2026, 7, 8, 12, 0, 0),
  random: () => 0,
} as const;

/** 10問ぶんの回答を組み立てる */
const build = (ids: readonly string[]): AnswerMap => {
  const keys: readonly QuestionId[] = [
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "q9",
    "q10",
  ];
  const map: Partial<Record<QuestionId, OptionId>> = {};
  ids.forEach((id, i) => {
    const key = keys[i];
    if (key) map[key] = id as OptionId;
  });
  return map;
};

/** 成功した結果を取り出す。失敗ならテストを落とす */
const resultOf = (answers: AnswerMap) => {
  const outcome = scoreDiagnosis(answers, FIXED);
  if (!outcome.ok) {
    throw new Error(`採点に失敗した: ${outcome.reason}`);
  }
  return outcome.result;
};

// 目的判定の既定値（タイプ判定だけを見たいケースで使う）
const GOAL_WORK = ["q8_a", "q9_b", "q10_a"];

// ============================================================================
describe("回答の検証", () => {
  it("全10問そろっていれば成功する", () => {
    const v = validateAnswers(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        ...GOAL_WORK,
      ]),
    );
    expect(v.ok).toBe(true);
  });

  it("未回答があれば incomplete_answers（§68）", () => {
    // Q5だけ未回答
    const withoutQ5: AnswerMap = {
      q1: "q1_b",
      q2: "q2_a",
      q3: "q3_d",
      q4: "q4_d",
      q6: "q6_d",
      q7: "q7_d",
      q8: "q8_a",
      q9: "q9_b",
      q10: "q10_a",
    };
    expect(scoreDiagnosis(withoutQ5)).toEqual({
      ok: false,
      reason: "incomplete_answers",
    });
  });

  it("1問も回答していなければ incomplete_answers", () => {
    expect(scoreDiagnosis({})).toEqual({
      ok: false,
      reason: "incomplete_answers",
    });
  });

  it("存在しない選択肢IDなら unknown_option（§69）", () => {
    const answers = {
      ...build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        ...GOAL_WORK,
      ]),
      q1: "q1_z" as OptionId,
    };
    expect(scoreDiagnosis(answers)).toEqual({
      ok: false,
      reason: "unknown_option",
    });
  });

  it("他の質問の選択肢IDが入っていれば unknown_option", () => {
    const answers = {
      ...build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        ...GOAL_WORK,
      ]),
      q1: "q2_a" as OptionId,
    };
    expect(scoreDiagnosis(answers)).toEqual({
      ok: false,
      reason: "unknown_option",
    });
  });
});

// ============================================================================
describe("質問バンクの回答例（docs/03_question-bank.md）", () => {
  it("§21 完全Creator × SIDE → MAIN=creator / GOAL=side", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_b",
        "q9_a",
        "q10_c",
      ]),
    );
    expect(result.mainType).toBe("creator");
    expect(result.primaryGoal).toBe("side");
    expect(result.rawScores.creator).toBe(15);
    expect(result.displayScores.creator).toBe(100);
    expect(result.routeId).toBe("creator_side");
  });

  it("§22 完全Smart Worker × WORK → MAIN=smart_worker / GOAL=work", () => {
    const result = resultOf(
      build([
        "q1_c",
        "q2_c",
        "q3_e",
        "q4_c",
        "q5_b",
        "q6_c",
        "q7_c",
        "q8_a",
        "q9_b",
        "q10_a",
      ]),
    );
    expect(result.mainType).toBe("smart_worker");
    expect(result.primaryGoal).toBe("work");
    expect(result.rawScores.smart_worker).toBe(15);
    expect(result.routeId).toBe("smart_worker_work");
  });

  it("§23 完全Supporter → MAIN=supporter", () => {
    const result = resultOf(
      build([
        "q1_a",
        "q2_b",
        "q3_a",
        "q4_b",
        "q5_d",
        "q6_a",
        "q7_a",
        ...GOAL_WORK,
      ]),
    );
    expect(result.mainType).toBe("supporter");
    expect(result.rawScores.supporter).toBe(15);
  });

  it("§24 完全Producer → MAIN=producer", () => {
    const result = resultOf(
      build([
        "q1_e",
        "q2_e",
        "q3_b",
        "q4_e",
        "q5_a",
        "q6_b",
        "q7_b",
        ...GOAL_WORK,
      ]),
    );
    expect(result.mainType).toBe("producer");
    expect(result.rawScores.producer).toBe(15);
  });

  it("§25 完全Builder → MAIN=builder", () => {
    const result = resultOf(
      build([
        "q1_d",
        "q2_d",
        "q3_c",
        "q4_a",
        "q5_e",
        "q6_e",
        "q7_e",
        ...GOAL_WORK,
      ]),
    );
    expect(result.mainType).toBe("builder");
    expect(result.rawScores.builder).toBe(15);
  });

  it("§26 BOTH → GOAL=both", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_c",
        "q9_c",
        "q10_b",
      ]),
    );
    expect(result.primaryGoal).toBe("both");
    expect(result.goalScores.both).toBe(7);
  });
});

// ============================================================================
describe("採点システムのテストケース（docs/02_scoring-system.md §74-83）", () => {
  it("テストケース1: AIクリエイター特化 → MAIN=creator / STYLE=focused", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        ...GOAL_WORK,
      ]),
    );
    expect(result.mainType).toBe("creator");
    expect(result.style).toBe("focused");
  });

  it("テストケース2: Creator × Builder → MAIN=creator / SUB=builder / STYLE=hybrid", () => {
    // 全78,125通りの探索から、条件を満たす実際の回答を採用している
    const result = resultOf(
      build([
        "q1_a",
        "q2_a",
        "q3_a",
        "q4_a",
        "q5_a",
        "q6_e",
        "q7_d",
        ...GOAL_WORK,
      ]),
    );
    expect(result.mainType).toBe("creator");
    expect(result.subType).toBe("builder");
    expect(result.style).toBe("hybrid");
  });

  it("テストケース3: マルチ型（smart_worker / supporter / builder が近い）→ STYLE=multi", () => {
    const result = resultOf(
      build([
        "q1_a",
        "q2_a",
        "q3_a",
        "q4_a",
        "q5_a",
        "q6_a",
        "q7_e",
        ...GOAL_WORK,
      ]),
    );
    expect(result.style).toBe("multi");
    // 上位3タイプが smart_worker / supporter / builder であること
    expect([result.mainType, result.subType].sort()).toEqual([
      "builder",
      "supporter",
    ]);
    expect(result.rawScores.smart_worker).toBe(5);
  });

  it("テストケース4: 本業活用 → PRIMARY GOAL=work", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_a",
        "q9_b",
        "q10_a",
      ]),
    );
    expect(result.primaryGoal).toBe("work");
    expect(result.goalScores.work).toBe(7);
  });

  it("テストケース5: 副業 → PRIMARY GOAL=side", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_b",
        "q9_a",
        "q10_c",
      ]),
    );
    expect(result.primaryGoal).toBe("side");
    expect(result.goalScores.side).toBe(7);
  });

  it("テストケース6: 両方 → PRIMARY GOAL=both", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_c",
        "q9_c",
        "q10_b",
      ]),
    );
    expect(result.primaryGoal).toBe("both");
  });

  it("テストケース7: GOAL混在（Q8 WORK / Q9 SIDE / Q10 BOTH）→ PRIMARY=both", () => {
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_a",
        "q9_a",
        "q10_b",
      ]),
    );
    expect(result.goalScores).toEqual({ work: 2, side: 2, both: 3 });
    expect(result.primaryGoal).toBe("both");
  });

  it("テストケース8: GOAL同点は後の質問を優先する（Q9 > Q8）", () => {
    // work と side が 2点で同点。PRIMARY は both(3点)。
    // SECONDARY は Q9 で選んだ side が優先される。
    const result = resultOf(
      build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_a",
        "q9_a",
        "q10_b",
      ]),
    );
    expect(result.goalScores.work).toBe(result.goalScores.side);
    expect(result.secondaryGoal).toBe("side");
  });

  it("テストケース9: タイプ同点で Q7 が creator なら MAIN=creator", () => {
    const result = resultOf(
      build([
        "q1_a",
        "q2_a",
        "q3_a",
        "q4_a",
        "q5_e",
        "q6_c",
        "q7_d",
        ...GOAL_WORK,
      ]),
    );
    // creator と builder が生点同点
    expect(result.rawScores.creator).toBe(result.rawScores.builder);
    // Q7 で creator がメイン加点を得ているため creator が上位
    expect(result.mainType).toBe("creator");
    expect(result.subType).toBe("builder");
  });

  it("テストケース10: 回答を変更しても二重加算されない（§83, §84）", () => {
    const finalAnswers = build([
      "q1_c",
      "q2_c",
      "q3_e",
      "q4_c",
      "q5_b",
      "q6_c",
      "q7_c",
      "q8_a",
      "q9_b",
      "q10_a",
    ]);

    // 一度別の回答をしてから、上書きで最終回答にした場合
    const rewritten: AnswerMap = {
      ...build([
        "q1_b",
        "q2_a",
        "q3_d",
        "q4_d",
        "q5_c",
        "q6_d",
        "q7_d",
        "q8_b",
        "q9_a",
        "q10_c",
      ]),
      ...finalAnswers,
    };

    expect(resultOf(rewritten)).toEqual(resultOf(finalAnswers));
    expect(resultOf(rewritten).rawScores.smart_worker).toBe(15);
  });
});

// ============================================================================
describe("結果オブジェクト", () => {
  const result = resultOf(
    build([
      "q1_b",
      "q2_a",
      "q3_d",
      "q4_d",
      "q5_c",
      "q6_d",
      "q7_d",
      "q8_b",
      "q9_a",
      "q10_c",
    ]),
  );

  it("仕様書 §63 のフィールドをすべて持つ", () => {
    expect(Object.keys(result).sort()).toEqual(
      [
        "completedAt",
        "displayScores",
        "goalScores",
        "mainType",
        "primaryGoal",
        "rawScores",
        "resultId",
        "routeId",
        "secondaryGoal",
        "style",
        "subType",
      ].sort(),
    );
  });

  it("routeId は mainType_primaryGoal になる（§64）", () => {
    expect(result.routeId).toBe(`${result.mainType}_${result.primaryGoal}`);
  });

  it("MAIN と SUB は必ず異なる（§12）", () => {
    expect(result.mainType).not.toBe(result.subType);
  });

  it("PRIMARY と SECONDARY は必ず異なる", () => {
    expect(result.primaryGoal).not.toBe(result.secondaryGoal);
  });

  it("completedAt は ISO 8601 文字列", () => {
    expect(() => new Date(result.completedAt).toISOString()).not.toThrow();
    expect(result.completedAt).toBe(FIXED.now.toISOString());
  });

  it("診断バージョンは結果オブジェクトに含めない（保存側で管理する）", () => {
    expect(result).not.toHaveProperty("diagnosisVersion");
  });
});

// ============================================================================
describe("集計（computeScoreBreakdown）", () => {
  const breakdown = computeScoreBreakdown(
    // 完全Creator回答
    {
      q1: "q1_b",
      q2: "q2_a",
      q3: "q3_d",
      q4: "q4_d",
      q5: "q5_c",
      q6: "q6_d",
      q7: "q7_d",
      q8: "q8_b",
      q9: "q9_a",
      q10: "q10_c",
    },
  );

  it("メイン加点の回数を数える", () => {
    // creator は Q1〜Q7 すべてでメイン加点
    expect(breakdown.typeMeta.creator.mainHitCount).toBe(7);
  });

  it("サブ加点の回数を数える", () => {
    // producer は Q1 / Q3 / Q5 / Q6 / Q7 でサブ加点
    expect(breakdown.typeMeta.producer.subHitCount).toBe(5);
    expect(breakdown.typeMeta.producer.mainHitCount).toBe(0);
  });

  it("Q7のメイン加点を記録する", () => {
    expect(breakdown.typeMeta.creator.q7MainHit).toBe(true);
    expect(breakdown.typeMeta.producer.q7MainHit).toBe(false);
  });

  it("Q6のメイン加点を記録する", () => {
    expect(breakdown.typeMeta.creator.q6MainHit).toBe(true);
    expect(breakdown.typeMeta.builder.q6MainHit).toBe(false);
  });

  it("GOAL質問で選ばれた目的を記録する", () => {
    expect(breakdown.goalSelection).toEqual({
      q8: "side",
      q9: "side",
      q10: "side",
    });
  });
});
