/**
 * MAIN TYPE の解説
 *
 * 出典: docs/01_diagnosis-spec.md §37 / docs/04_result-types.md §21
 *       docs/08_web-spec.md §65
 *
 * ResultShareCard の次に重要なセクション。
 * 視覚階層: 英語名 → 日本語名 → キャッチコピー → 一言診断 → 説明
 *
 * Webでは全文を載せず、読みやすい長さにとどめる（04 §20）。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";
import { getMainType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type MainTypeSectionProps = {
  result: DiagnosisResult;
};

export function MainTypeSection({ result }: MainTypeSectionProps) {
  const main = getMainType(result);

  return (
    <section className="flex flex-col" aria-labelledby="main-type">
      <p className="eyebrow text-brand-turquoise">Your Main Type</p>

      {/* 英語名を大きく。アイコンでタイプを識別できるようにする */}
      <div className="mt-5 flex items-start gap-4">
        <span className="border-brand-border mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-badge border">
          <TypeIcon name={main.icon} className="text-brand-navy h-5 w-5" />
        </span>

        <div className="flex flex-col">
          <h2
            id="main-type"
            className="label-en text-brand-navy text-2xl leading-none font-bold sm:text-3xl"
          >
            {main.englishName}
          </h2>
          <p className="mt-2.5 text-base font-bold">{main.name}</p>
          <p className="text-note text-brand-black/45 mt-1">{main.category}</p>
        </div>
      </div>

      {/* キャッチコピー */}
      <p className="text-brand-navy mt-8 text-xl leading-snug font-bold sm:text-2xl">
        {main.catchCopy}
      </p>

      {/* 一言診断 */}
      <p className="border-brand-turquoise mt-7 border-l-2 pl-5 text-sm leading-loose sm:text-base">
        {main.shortDiagnosis}
      </p>

      {/* あなたはこんなタイプ */}
      <div className="mt-9 border-t border-brand-border pt-7">
        <h3 className="eyebrow text-brand-black/40">About You</h3>
        <p className="text-brand-black/80 mt-4 text-sm leading-loose">
          {main.description}
        </p>
      </div>
    </section>
  );
}
