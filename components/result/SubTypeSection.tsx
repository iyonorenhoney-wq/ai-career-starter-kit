/**
 * SUB TYPE の解説
 *
 * 出典: docs/01_diagnosis-spec.md §38 / docs/08_web-spec.md §66
 *
 * MAINより簡潔に表示する。
 * 「2番目のタイプ」ではなく「MAINを強くする第二の武器」として見せる
 * （docs/06_pdf-spec.md §19）。
 */

import { getSubType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type SubTypeSectionProps = {
  result: DiagnosisResult;
};

export function SubTypeSection({ result }: SubTypeSectionProps) {
  const sub = getSubType(result);

  return (
    <section
      className="flex flex-col gap-4 rounded-card border border-brand-border bg-brand-white p-6 shadow-card"
      aria-labelledby="sub-type"
    >
      <div className="flex flex-col gap-2">
        <p className="label-en text-xs text-brand-accent-blue">
          Your Second Strength
        </p>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id="sub-type"
            className="label-en text-lg font-bold text-brand-navy"
          >
            {sub.englishName}
          </h2>
          <p className="text-sm font-semibold">{sub.name}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-brand-black/85">
        {sub.subResultText}
      </p>
    </section>
  );
}
