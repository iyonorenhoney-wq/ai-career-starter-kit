/**
 * あなたの強み
 *
 * 出典: docs/01_diagnosis-spec.md §32（Section 7）
 *       docs/04_result-types.md §21（Webでは強み3つ程度）
 *       docs/08_web-spec.md §73
 *
 * MAIN TYPE の強みから3つを表示する。
 * データは { title, body } 形式をそのまま使う。
 */

import { getMainType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type StrengthSectionProps = {
  result: DiagnosisResult;
};

/** Webで表示する強みの数 */
const STRENGTH_LIMIT = 3;

/** 2桁ゼロ埋め（01 / 02 / 03 の見た目にする） */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function StrengthSection({ result }: StrengthSectionProps) {
  const main = getMainType(result);
  const strengths = main.strengths.slice(0, STRENGTH_LIMIT);

  return (
    <section className="flex flex-col gap-6" aria-labelledby="strengths">
      <div className="flex flex-col gap-2">
        <p className="label-en text-xs text-brand-accent-blue">
          Your Strengths
        </p>
        <h2 id="strengths" className="text-h3 font-bold">
          あなたの強み
        </h2>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {strengths.map((strength, index) => (
          <li
            key={strength.title}
            className="flex flex-col gap-2 rounded-card border border-brand-border bg-brand-white p-5 shadow-card"
          >
            <span className="label-en text-brand-turquoise text-sm font-bold">
              {pad2(index + 1)}
            </span>
            <h3 className="text-sm font-bold text-brand-navy">
              {strength.title}
            </h3>
            <p className="text-xs leading-relaxed text-brand-black/70">
              {strength.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
