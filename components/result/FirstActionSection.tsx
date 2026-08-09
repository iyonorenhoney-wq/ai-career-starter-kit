/**
 * 最初の一歩
 *
 * 出典: docs/01_diagnosis-spec.md §41 / docs/08_web-spec.md §74
 *
 * 結果を読んで終わりにせず、「じゃあ今日何する？」へつなげる場所。
 * ページ内でも目立たせるが、CTAとは役割を分ける。
 *
 * デザイン方針:
 *   CTAは「ダーク + ボタン」、ここは「淡いターコイズ + ボタンなし」。
 *   色と構造の両方で役割を分ける。
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
      className="bg-brand-tint relative overflow-hidden rounded-card px-7 py-9 sm:px-10 sm:py-11"
      aria-labelledby="first-action"
    >
      {/* 上辺のターコイズライン。ここが行動の起点だと示す */}
      <div
        aria-hidden="true"
        className="bg-brand-turquoise absolute inset-x-0 top-0 h-0.5"
      />

      <p className="eyebrow text-brand-turquoise">Today&apos;s First Step</p>

      <h2
        id="first-action"
        className="text-brand-navy mt-5 text-xl leading-relaxed font-bold sm:text-2xl"
      >
        {main.firstAction.title}
      </h2>

      <p className="text-brand-black/70 mt-4 text-sm leading-loose">
        {main.firstAction.body}
      </p>
    </section>
  );
}
