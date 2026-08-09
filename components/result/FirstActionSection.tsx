/**
 * 最初の一歩
 *
 * 出典: docs/01_diagnosis-spec.md §41 / docs/08_web-spec.md §74
 *
 * 結果画面の中でかなり目立たせる。
 * PDFを受け取る前でも、今日できる行動を1つだけ提示する。
 */

import { getMainType } from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type FirstActionSectionProps = {
  result: DiagnosisResult;
};

export function FirstActionSection({ result }: FirstActionSectionProps) {
  const main = getMainType(result);

  return (
    <section
      className="border-brand-turquoise/40 bg-brand-tint flex flex-col gap-4 rounded-card border-2 p-6 sm:p-8"
      aria-labelledby="first-action"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="bg-brand-turquoise h-2 w-2 rounded-badge"
        />
        <p className="label-en text-xs font-semibold text-brand-navy">
          Today&apos;s First Step
        </p>
      </div>

      <h2
        id="first-action"
        className="text-brand-navy text-lg leading-relaxed font-bold sm:text-xl"
      >
        {main.firstAction.title}
      </h2>

      <p className="text-sm leading-relaxed text-brand-black/75">
        {main.firstAction.body}
      </p>
    </section>
  );
}
