/**
 * FINAL CTA
 *
 * 出典: docs/09_lp.md §41, §59
 *
 * LP最下部。ダーク背景。
 * ここまで読んだ人が、迷わず診断へ進めるようにする。
 */

import { LpCtaButton } from "@/components/lp/LpCtaButton";
import { disclaimer, finalCta } from "@/data/lpContent";

export function LpFinalCta() {
  return (
    <section className="bg-card-glow relative overflow-hidden py-24 text-brand-white sm:py-32">
      {/* 上辺のターコイズライン。結果画面のCTAと同じ合図にそろえる */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-turquoise to-transparent"
      />

      <div className="mx-auto w-full max-w-[620px] px-6 text-center">
        <h2 className="text-h3 leading-snug font-bold whitespace-pre-line">
          {finalCta.headline}
        </h2>

        <p className="text-brand-white/70 mt-6 text-sm leading-loose">
          {finalCta.body}
        </p>

        <div className="mt-10">
          <LpCtaButton position="final" tone="dark" />
        </div>

        <p className="text-brand-white/35 mt-14 text-xs leading-loose">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}
