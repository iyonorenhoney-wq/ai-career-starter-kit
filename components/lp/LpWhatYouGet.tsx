/**
 * WHAT YOU GET
 *
 * 出典: docs/09_lp.md §14-15, §21-23
 *
 * 「診断で分かる4つ」「5タイプ」「MAIN × SUB」を1ブロックへ統合する。
 *
 * 5タイプは概要だけにとどめる。
 * 診断前に「私はCreatorかな」と結果を予想させないため（同 §21）。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";
import { mainSubCopy, typeSummaries, whatYouGet } from "@/data/lpContent";
import { resultCombinations } from "@/data/resultCombinations";

/** MAIN × SUB の例は1つだけ見せる（09 §22） */
const EXAMPLE = resultCombinations.creator_builder;

/** 2桁ゼロ埋め */
const pad2 = (value: number): string => String(value).padStart(2, "0");

export function LpWhatYouGet() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[880px] px-6">
        {/* --- 診断で分かる4つ --- */}
        <p className="eyebrow text-brand-turquoise">What You Get</p>
        <h2 className="text-h3 mt-5 font-bold">この診断で分かること</h2>

        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {whatYouGet.map((item, index) => (
            <li
              key={item.title}
              className="flex items-baseline gap-5 border-t border-brand-border py-6"
            >
              <span
                aria-hidden="true"
                className="label-en text-brand-turquoise w-6 shrink-0 text-xs font-bold"
              >
                {pad2(index + 1)}
              </span>
              <div>
                <h3 className="label-en text-brand-navy text-sm font-bold">
                  {item.title}
                </h3>
                <p className="text-brand-black/65 mt-1.5 text-sm">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* --- 5タイプ --- */}
        <div className="mt-20">
          <h2 className="text-h3 leading-snug font-bold">
            AIの使い方は、1つじゃない。
          </h2>
          <p className="text-brand-black/60 mt-4 text-sm leading-loose">
            回答の傾向から、5つのAI仕事スタイルのうち、あなたに近いものを整理します。
          </p>

          <ul className="mt-10 flex flex-col">
            {typeSummaries.map((type) => (
              <li
                key={type.id}
                className="flex items-start gap-4 border-t border-brand-border py-5 sm:items-center sm:gap-6"
              >
                <TypeIcon
                  name={type.icon}
                  className="text-brand-navy/45 mt-1 h-5 w-5 shrink-0 sm:mt-0"
                />

                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                  <p className="label-en text-brand-navy w-[9.5rem] shrink-0 text-sm font-bold">
                    {type.englishName}
                  </p>
                  <p className="text-sm">{type.oneLine}</p>
                </div>

                {/* キーワードはPCのみ。スマホでは情報を増やさない */}
                <p className="text-brand-black/35 hidden shrink-0 text-xs lg:block">
                  {type.keywords.join(" / ")}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* --- MAIN × SUB --- */}
        <div className="mt-20">
          <h2 className="text-h3 leading-snug font-bold">
            しかも、結果は1タイプだけじゃない。
          </h2>
          <p className="text-brand-black/65 mt-5 text-sm leading-loose">
            {mainSubCopy}
          </p>

          {/* 例は1つだけ。ダークにして「結果らしさ」を出す */}
          <div className="bg-dark-gradient mt-8 rounded-card px-7 py-8 text-brand-white sm:px-9">
            <p className="eyebrow text-brand-white/40">例えば</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="label-en text-lg font-bold">AI CREATOR</span>
              <span className="text-brand-white/30" aria-hidden="true">
                ×
              </span>
              <span className="label-en text-brand-white/70 text-lg font-bold">
                AI BUILDER
              </span>
            </div>

            <p className="text-brand-turquoise-light mt-5 text-base font-bold">
              {EXAMPLE.name}
            </p>
            <p className="text-brand-white/75 mt-2 text-sm leading-relaxed">
              {EXAMPLE.oneLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
