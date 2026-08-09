/**
 * MAIN TYPE の解説
 *
 * 出典: docs/01_diagnosis-spec.md §37 / docs/04_result-types.md §21
 *       docs/08_web-spec.md §65
 *
 * Webでは全文を載せず、読みやすい長さにとどめる（04 §20）。
 */

import { getMainType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type MainTypeSectionProps = {
  result: DiagnosisResult;
};

export function MainTypeSection({ result }: MainTypeSectionProps) {
  const main = getMainType(result);

  return (
    <section className="flex flex-col gap-5" aria-labelledby="main-type">
      <div className="flex flex-col gap-2">
        <p className="label-en text-xs text-brand-accent-blue">Your Main Type</p>

        <h2
          id="main-type"
          className="label-en text-h3 leading-tight font-bold text-brand-navy"
        >
          {main.englishName}
        </h2>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-lg font-bold">{main.name}</p>
          <span className="rounded-badge bg-brand-off-white px-3 py-1 text-xs text-brand-black/60">
            {main.category}
          </span>
        </div>
      </div>

      {/* キャッチコピー */}
      <p className="text-brand-navy text-lg font-semibold">{main.catchCopy}</p>

      {/* 一言診断 */}
      <p className="border-brand-turquoise rounded-r-card border-l-3 bg-brand-off-white px-5 py-4 text-sm leading-relaxed">
        {main.shortDiagnosis}
      </p>

      {/* あなたはこんなタイプ */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-brand-black/60">
          あなたはこんなタイプ
        </h3>
        <p className="text-sm leading-loose text-brand-black/85">
          {main.description}
        </p>
      </div>
    </section>
  );
}
