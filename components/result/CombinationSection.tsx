/**
 * MAIN × SUB の組み合わせ解説
 *
 * 出典: docs/04_result-combinations.md §30（Web詳細画面の表示項目）
 *       docs/08_web-spec.md §67
 *
 * Webでは以下だけを表示する:
 *   Combination Name / ONE LINE / DESCRIPTION / STRENGTH 3つ程度 / FIRST DIRECTION
 *
 * BEST USE と WATCH OUT はPDF側で扱う（詰め込みすぎないため）。
 */

import { getCombination, getStyle, getStyleLabel } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type CombinationSectionProps = {
  result: DiagnosisResult;
};

/** Webで表示する強みの数 */
const STRENGTH_LIMIT = 3;

export function CombinationSection({ result }: CombinationSectionProps) {
  const combination = getCombination(result);
  const style = getStyle(result);
  const styleLabel = getStyleLabel(result);

  return (
    <section
      className="bg-dark-gradient flex flex-col gap-6 rounded-card px-6 py-8 text-brand-white sm:px-8"
      aria-labelledby="combination"
    >
      <div className="flex flex-col gap-2">
        <p className="label-en text-xs text-brand-turquoise">Your Style</p>

        <h2 id="combination" className="text-h3 font-bold">
          {combination.name}
        </h2>

        <p className="label-en text-xs text-brand-white/50">
          {styleLabel.english}
        </p>
      </div>

      {/* ONE LINE */}
      <p className="border-l-2 border-brand-turquoise/60 pl-4 text-base leading-relaxed font-semibold">
        {combination.oneLine}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm leading-loose text-brand-white/80">
        {combination.description}
      </p>

      {/* STYLE による補足（focused / hybrid / multi で見せ方を変える） */}
      <p className="text-sm leading-relaxed text-brand-white/70">
        {style.description}
        {style.extraNote !== undefined ? `${style.extraNote}` : ""}
      </p>

      {/* STRENGTH：3つ程度にとどめる */}
      <div className="flex flex-col gap-3">
        <h3 className="label-en text-xs text-brand-white/45">
          Combination Strengths
        </h3>
        <ul className="flex flex-col gap-2">
          {combination.strengths.slice(0, STRENGTH_LIMIT).map((strength) => (
            <li key={strength} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-badge bg-brand-turquoise"
              />
              <span className="text-brand-white/90">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FIRST DIRECTION：次に進む方向 */}
      <div className="flex flex-col gap-3 border-t border-brand-white/10 pt-6">
        <h3 className="label-en text-xs text-brand-white/45">
          First Direction
        </h3>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {combination.firstDirection.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-badge border border-brand-turquoise/30 bg-brand-turquoise/10 px-3 py-1 text-xs text-brand-turquoise-light">
                {step}
              </span>
              {index < combination.firstDirection.length - 1 ? (
                <span aria-hidden="true" className="text-brand-white/30">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
