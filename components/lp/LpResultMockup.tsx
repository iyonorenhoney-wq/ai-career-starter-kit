/**
 * HEROに置く診断結果のイメージ
 *
 * 出典: docs/09_lp.md §10, §34, §50
 *
 * 結果カードのデザインを流用した簡易モックアップ。
 * 結果の全文は見せず、「こんな結果が出るんだ」と伝わるところまでにとどめる。
 *
 * 実際の結果と混同されないよう、「診断結果の例」と明記している。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";

export function LpResultMockup() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="bg-card-glow relative overflow-hidden rounded-card px-7 py-8 text-brand-white">
        {/* 結果カードと同じ、ごく薄いグリッド */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #4BD6D6 1px, transparent 1px), linear-gradient(to bottom, #4BD6D6 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-turquoise to-transparent"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow text-brand-white/45">AI 仕事診断書</p>
            <TypeIcon
              name="PenTool"
              className="text-brand-turquoise h-4 w-4"
            />
          </div>

          <div className="mt-6">
            <p className="eyebrow text-brand-turquoise">Main Type</p>
            <p className="label-en mt-2.5 text-2xl leading-none font-bold sm:text-3xl">
              AI CREATOR
            </p>
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-brand-white/10 pt-4">
            <p className="eyebrow text-brand-white/40">Sub Type</p>
            <p className="label-en text-brand-white/85 text-sm font-semibold">
              AI BUILDER
            </p>
          </div>

          <div className="mt-5 border-t border-brand-turquoise/25 pt-5">
            <p className="eyebrow text-brand-white/40">Style</p>
            <p className="text-brand-turquoise-light mt-2 text-base font-bold">
              制作 × 仕組み化タイプ
            </p>
          </div>

          <p className="text-brand-white/60 mt-5 text-xs">
            AI CAREER STARTER KIT
          </p>
        </div>
      </div>

      <figcaption className="text-brand-black/40 text-center text-xs">
        診断結果の例
      </figcaption>
    </figure>
  );
}
