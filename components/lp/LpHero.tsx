/**
 * HERO
 *
 * 出典: docs/09_lp.md §8, §10-11, §52
 *
 * この画面だけで「何のサービスか → 何が分かるか → 無料で診断できる」まで
 * 理解できるようにする。
 *
 * スマホは Copy → CTA → 結果モックアップ の縦並び（同 §11）。
 * PCでは右側に結果モックアップを置く（同 §10）。
 */

import { LpCtaButton } from "@/components/lp/LpCtaButton";
import { LpResultMockup } from "@/components/lp/LpResultMockup";
import { hero } from "@/data/lpContent";

export function LpHero() {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="flex flex-col">
          <p className="eyebrow text-brand-turquoise">{hero.eyebrow}</p>

          <h1 className="text-h2 mt-6 leading-snug font-bold tracking-tight whitespace-pre-line">
            {hero.headline}
          </h1>

          <p className="text-brand-black/65 mt-6 text-sm leading-loose whitespace-pre-line sm:text-base">
            {hero.subCopy}
          </p>

          <div className="mt-9 sm:max-w-[420px]">
            <LpCtaButton position="hero" />
          </div>
        </div>

        {/* スマホではCTAの下、PCでは右側に置く */}
        <div className="lg:pl-4">
          <LpResultMockup />
        </div>
      </div>
    </section>
  );
}
