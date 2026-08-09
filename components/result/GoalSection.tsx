/**
 * GOAL（AI活用目的）
 *
 * 出典: docs/01_diagnosis-spec.md §40 / docs/08_web-spec.md §72
 *
 * PRIMARY GOAL を表示する。SECONDARY GOAL は内部保持のみで表示しない
 * （docs/01_diagnosis-spec.md §28）。
 *
 * デザイン方針:
 *   カードを増やさず、結果の「方向性」として1行で簡潔に見せる。
 */

import { getGoal } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type GoalSectionProps = {
  result: DiagnosisResult;
};

export function GoalSection({ result }: GoalSectionProps) {
  const goal = getGoal(result);

  return (
    <section
      className="border-brand-navy flex flex-col border-l-2 pl-6"
      aria-labelledby="goal"
    >
      <p className="eyebrow text-brand-black/40">Your Goal</p>

      <h2 id="goal" className="mt-3 flex items-baseline gap-3">
        <span className="text-brand-navy text-xl font-bold sm:text-2xl">
          {goal.name}
        </span>
        <span className="label-en text-brand-black/35 text-xs">
          {goal.englishName}
        </span>
      </h2>

      <p className="text-brand-black/70 mt-3 text-sm leading-relaxed">
        {goal.resultSummary}
      </p>
    </section>
  );
}
