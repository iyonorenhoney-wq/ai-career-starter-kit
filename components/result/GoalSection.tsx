/**
 * GOAL（AI活用目的）
 *
 * 出典: docs/01_diagnosis-spec.md §40 / docs/08_web-spec.md §72
 *
 * PRIMARY GOAL を表示する。SECONDARY GOAL は内部保持のみで表示しない
 * （docs/01_diagnosis-spec.md §28）。
 */

import { getGoal } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type GoalSectionProps = {
  result: DiagnosisResult;
};

export function GoalSection({ result }: GoalSectionProps) {
  const goal = getGoal(result);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="goal">
      <p className="label-en text-xs text-brand-accent-blue">Your Goal</p>

      <div className="flex flex-wrap items-center gap-3">
        <h2 id="goal" className="text-h3 font-bold">
          {goal.name}
        </h2>
        <span className="bg-brand-gradient rounded-badge px-3 py-1">
          <span className="label-en text-xs font-semibold text-brand-white">
            {goal.englishName}
          </span>
        </span>
      </div>

      <p className="text-sm leading-relaxed text-brand-black/85">
        {goal.resultSummary}
      </p>
    </section>
  );
}
