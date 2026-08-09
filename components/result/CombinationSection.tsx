/**
 * MAIN × SUB の組み合わせ解説
 *
 * 出典: docs/04_result-combinations.md §30（Web詳細画面の表示項目）
 *       docs/08_web-spec.md §67
 *
 * 「あなたらしさ」が最も出る場所。
 * 2タイプを並べるだけでなく、2つが合わさると何になるのかを見せる。
 *
 * Webでは以下だけを表示する:
 *   Combination Name / ONE LINE / DESCRIPTION / STRENGTH 3つ程度 / FIRST DIRECTION
 * BEST USE と WATCH OUT はPDF側で扱う。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";
import {
  getCombination,
  getMainType,
  getStyle,
  getStyleLabel,
  getSubType,
} from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type CombinationSectionProps = {
  result: DiagnosisResult;
};

/** Webで表示する強みの数 */
const STRENGTH_LIMIT = 3;

export function CombinationSection({ result }: CombinationSectionProps) {
  const main = getMainType(result);
  const sub = getSubType(result);
  const combination = getCombination(result);
  const style = getStyle(result);
  const styleLabel = getStyleLabel(result);

  return (
    <section
      className="bg-dark-gradient overflow-hidden rounded-card px-7 py-10 text-brand-white sm:px-10 sm:py-12"
      aria-labelledby="combination"
    >
      <p className="eyebrow text-brand-turquoise">Your Style</p>

      {/* 2つのタイプが合わさることを、アイコンと × で視覚的に示す */}
      <div
        className="mt-7 flex items-center gap-4 sm:gap-6"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="border-brand-turquoise/40 flex h-12 w-12 items-center justify-center rounded-badge border">
            <TypeIcon name={main.icon} className="text-brand-turquoise h-5 w-5" />
          </span>
          <span className="label-en text-brand-white/50 text-[10px]">Main</span>
        </div>

        <span className="text-brand-white/25 text-xl font-light">×</span>

        <div className="flex flex-col items-center gap-2">
          <span className="border-brand-white/20 flex h-12 w-12 items-center justify-center rounded-badge border">
            <TypeIcon name={sub.icon} className="text-brand-white/60 h-5 w-5" />
          </span>
          <span className="label-en text-brand-white/50 text-[10px]">Sub</span>
        </div>

        <div className="ml-auto h-px flex-1 bg-gradient-to-r from-brand-turquoise/40 to-transparent" />
      </div>

      {/* 組み合わせ名 */}
      <h2 id="combination" className="text-h3 mt-7 leading-snug font-bold">
        {combination.name}
      </h2>
      <p className="label-en text-brand-white/40 mt-2 text-xs">
        {styleLabel.english}
      </p>

      {/* ONE LINE */}
      <p className="text-brand-turquoise-light mt-7 text-lg leading-relaxed font-bold sm:text-xl">
        {combination.oneLine}
      </p>

      {/* DESCRIPTION */}
      <p className="text-brand-white/75 mt-6 text-sm leading-loose">
        {combination.description}
      </p>

      {/* STYLE による補足（focused / hybrid / multi で見せ方を変える） */}
      <p className="text-brand-white/55 text-note mt-5">
        {style.description}
        {style.extraNote ?? ""}
      </p>

      {/* STRENGTH：3つ程度にとどめる */}
      <div className="mt-9 border-t border-brand-white/10 pt-7">
        <h3 className="eyebrow text-brand-white/40">
          この組み合わせの強み
        </h3>
        <ul className="mt-4 flex flex-col gap-3">
          {combination.strengths.slice(0, STRENGTH_LIMIT).map((strength) => (
            <li key={strength} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden="true"
                className="bg-brand-turquoise mt-2 h-1 w-1 shrink-0 rounded-badge"
              />
              <span className="text-brand-white/90">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FIRST DIRECTION：次に進む方向 */}
      <div className="mt-8">
        <h3 className="eyebrow text-brand-white/40">進み方</h3>
        <ol className="mt-4 flex flex-col gap-0">
          {combination.firstDirection.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center self-stretch">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-badge ${
                    index === 0 ? "bg-brand-turquoise" : "bg-brand-white/25"
                  }`}
                />
                {index < combination.firstDirection.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="w-px flex-1 bg-brand-white/15"
                  />
                ) : null}
              </div>
              <span className="text-brand-white/85 py-2 text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
