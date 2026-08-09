/**
 * あなたの強み
 *
 * 出典: docs/01_diagnosis-spec.md §32（Section 7）
 *       docs/04_result-types.md §21（Webでは強み3つ程度）
 *       docs/08_web-spec.md §73
 *
 * MAIN TYPE の強みから3つを表示する。
 * データは { title, body } 形式をそのまま使う。
 *
 * デザイン方針:
 *   カード3枚を横並びにせず、縦に読んでテンポよく理解できる構成にする。
 *   大きな番号を目印にして、スマホでも区切りが分かるようにする。
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
    <section className="flex flex-col" aria-labelledby="strengths">
      <p className="eyebrow text-brand-turquoise">Your Strengths</p>
      <h2 id="strengths" className="text-h3 mt-4 font-bold">
        あなたの強み
      </h2>

      <ol className="mt-8 flex flex-col">
        {strengths.map((strength, index) => (
          <li
            key={strength.title}
            className="flex gap-5 border-t border-brand-border py-6"
          >
            <span
              aria-hidden="true"
              className="label-en text-brand-turquoise w-8 shrink-0 pt-0.5 text-sm font-bold"
            >
              {pad2(index + 1)}
            </span>

            <div className="flex flex-col gap-2">
              <h3 className="text-brand-navy text-base font-bold">
                {strength.title}
              </h3>
              <p className="text-brand-black/70 text-sm leading-loose">
                {strength.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
