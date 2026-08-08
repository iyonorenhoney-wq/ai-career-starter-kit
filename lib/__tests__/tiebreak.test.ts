/**
 * タイブレークのテスト
 * 出典: docs/02_scoring-system.md §13-19, §40-41
 */

import { describe, expect, it } from "vitest";
import { GOAL_TIEBREAK_ORDER, TYPE_TIEBREAK_ORDER } from "@/lib/constants";
import { rankGoals, rankTypes, type GoalSelection } from "@/lib/tiebreak";
import type { AIType, GoalScoreMap, TypeMeta, TypeMetaMap } from "@/types/diagnosis";

/** TypeMeta を簡潔に組み立てるヘルパー */
const meta = (
  rawScore: number,
  overrides: Partial<Omit<TypeMeta, "rawScore">> = {},
): TypeMeta => ({
  rawScore,
  mainHitCount: 0,
  subHitCount: 0,
  q7MainHit: false,
  q6MainHit: false,
  ...overrides,
});

/** 5タイプすべてを埋めた TypeMetaMap を作る */
const metaMap = (partial: Partial<Record<AIType, TypeMeta>>): TypeMetaMap => ({
  smart_worker: meta(0),
  creator: meta(0),
  supporter: meta(0),
  producer: meta(0),
  builder: meta(0),
  ...partial,
});

describe("rankTypes", () => {
  it("生点が高い順に並ぶ", () => {
    const ranking = rankTypes(
      metaMap({
        creator: meta(12),
        builder: meta(10),
        producer: meta(7),
        smart_worker: meta(5),
        supporter: meta(4),
      }),
    );
    expect(ranking).toEqual([
      "creator",
      "builder",
      "producer",
      "smart_worker",
      "supporter",
    ]);
  });

  it("同点なら Q7 のメイン加点を優先する（§14）", () => {
    const ranking = rankTypes(
      metaMap({
        creator: meta(10, { q7MainHit: true }),
        builder: meta(10, { q7MainHit: false }),
      }),
    );
    expect(ranking[0]).toBe("creator");
    expect(ranking[1]).toBe("builder");
  });

  it("Q7で差がつかなければ Q6 を優先する（§15）", () => {
    const ranking = rankTypes(
      metaMap({
        builder: meta(10, { q6MainHit: true }),
        creator: meta(10, { q6MainHit: false }),
      }),
    );
    expect(ranking[0]).toBe("builder");
  });

  it("Q7・Q6でも決まらなければメイン加点回数を比較する（§16）", () => {
    const ranking = rankTypes(
      metaMap({
        creator: meta(10, { mainHitCount: 4 }),
        builder: meta(10, { mainHitCount: 3 }),
      }),
    );
    expect(ranking[0]).toBe("creator");
  });

  it("メイン加点回数も同じならサブ加点回数を比較する（§17）", () => {
    const ranking = rankTypes(
      metaMap({
        producer: meta(10, { mainHitCount: 3, subHitCount: 2 }),
        creator: meta(10, { mainHitCount: 3, subHitCount: 5 }),
      }),
    );
    expect(ranking[0]).toBe("creator");
  });

  it("すべて同じなら固定順で決着する（§18）", () => {
    const ranking = rankTypes(
      metaMap({
        smart_worker: meta(6),
        creator: meta(6),
        supporter: meta(6),
        producer: meta(6),
        builder: meta(6),
      }),
    );
    expect(ranking).toEqual([...TYPE_TIEBREAK_ORDER]);
  });

  it("必ず5タイプすべてを返し、重複しない", () => {
    const ranking = rankTypes(metaMap({ creator: meta(3), builder: meta(3) }));
    expect(ranking).toHaveLength(5);
    expect(new Set(ranking).size).toBe(5);
  });
});

describe("rankGoals", () => {
  const scores = (work: number, side: number, both: number): GoalScoreMap => ({
    work,
    side,
    both,
  });
  const noSelection: GoalSelection = {};

  it("スコアが高い順に並ぶ", () => {
    expect(rankGoals(scores(4, 0, 3), noSelection)).toEqual([
      "work",
      "both",
      "side",
    ]);
  });

  it("同点なら Q10 で選ばれた目的を優先する（§40）", () => {
    expect(rankGoals(scores(2, 2, 0), { q10: "side" })[0]).toBe("side");
    expect(rankGoals(scores(2, 2, 0), { q10: "work" })[0]).toBe("work");
  });

  it("Q10で決まらなければ Q9 を優先する", () => {
    expect(
      rankGoals(scores(2, 2, 0), { q10: "both", q9: "side" })[0],
    ).toBe("side");
  });

  it("Q10・Q9で決まらなければ Q8 を優先する", () => {
    expect(
      rankGoals(scores(2, 2, 0), { q10: "both", q9: "both", q8: "work" })[0],
    ).toBe("work");
  });

  it("すべて同点かつ選択情報がなければ固定順（both → work → side）", () => {
    expect(rankGoals(scores(0, 0, 0), noSelection)).toEqual([
      ...GOAL_TIEBREAK_ORDER,
    ]);
  });

  it("必ず3目的すべてを返し、重複しない", () => {
    const ranking = rankGoals(scores(2, 2, 3), { q10: "both" });
    expect(ranking).toHaveLength(3);
    expect(new Set(ranking).size).toBe(3);
  });
});
