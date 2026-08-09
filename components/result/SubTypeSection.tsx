/**
 * SUB TYPE の解説
 *
 * 出典: docs/01_diagnosis-spec.md §38 / docs/08_web-spec.md §66
 *
 * MAINより明確に控えめにする。
 * ただしMAINの縮小コピーにはせず、「第二の強み」という意味が
 * 視覚的にも伝わる形にする（docs/06_pdf-spec.md §19）。
 *
 * MAINは「大きな見出し」、SUBは「補足として添えられた一枚」という差をつける。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";
import { getSubType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type SubTypeSectionProps = {
  result: DiagnosisResult;
};

export function SubTypeSection({ result }: SubTypeSectionProps) {
  const sub = getSubType(result);

  return (
    <section
      className="bg-brand-off-white flex gap-5 rounded-card px-6 py-7 sm:px-8"
      aria-labelledby="sub-type"
    >
      {/* MAINと違い、アイコンは小さく脇へ添える */}
      <TypeIcon
        name={sub.icon}
        className="text-brand-navy/45 mt-0.5 h-5 w-5 shrink-0"
      />

      <div className="flex flex-col">
        <p className="eyebrow text-brand-black/40">＋ Your Second Strength</p>

        <h2 id="sub-type" className="mt-3 flex flex-wrap items-baseline gap-x-3">
          <span className="label-en text-brand-navy text-base font-bold">
            {sub.englishName}
          </span>
          <span className="text-note text-brand-black/60">{sub.name}</span>
        </h2>

        <p className="text-brand-black/75 mt-3 text-sm leading-relaxed">
          {sub.subResultText}
        </p>
      </div>
    </section>
  );
}
