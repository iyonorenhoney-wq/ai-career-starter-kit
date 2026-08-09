"use client";

/**
 * 診断開始画面
 *
 * 出典: docs/01_diagnosis-spec.md §10-11 / docs/08_web-spec.md §38
 *
 * この画面では5タイプの詳細・採点ルール・商品導線を出さない。
 * 回答の誘導を防ぐため（01 §11）。
 *
 * デザイン方針:
 *   情報を増やさず、「やってみたい」と思えるところまでを最短で見せる。
 *   ブランド名はページ上部に一度だけ出し、ここでは繰り返さない。
 */

import { ArrowRight } from "lucide-react";

type DiagnosisIntroProps = {
  totalQuestions: number;
  onStart: () => void;
};

/** 開始前に伝える最低限の情報（01 §10） */
const META = [
  { label: "Questions", value: "10" },
  { label: "Time", value: "約2分" },
  { label: "Price", value: "無料" },
] as const;

export function DiagnosisIntro({
  totalQuestions,
  onStart,
}: DiagnosisIntroProps) {
  return (
    <section className="animate-fade-up flex flex-col">
      {/* 見出し */}
      <p className="eyebrow text-brand-turquoise">AI Work Diagnosis</p>

      <h1 className="text-h2 mt-5 font-bold tracking-tight">AI仕事診断</h1>

      <p className="text-brand-black/70 mt-6 text-lg leading-relaxed sm:text-xl">
        {totalQuestions}問で、
        <br />
        <span className="text-brand-navy font-bold">
          あなたに合うAIの使い方
        </span>
        がわかる。
      </p>

      <p className="text-note text-brand-black/55 mt-4">
        仕事効率化・制作・副業・商品化・仕組み化。
        <br />
        あなたがAIをどう使うと力を発揮しやすいかを整理します。
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={onStart}
        className="group bg-brand-navy mt-10 flex min-h-15 w-full items-center justify-center gap-3 rounded-btn px-6 font-bold text-brand-white transition-colors hover:bg-brand-navy-light"
      >
        無料で診断する
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>

      {/* 補足情報。罫線で区切って診断書らしい佇まいにする */}
      <dl className="mt-8 grid grid-cols-3 border-t border-brand-border pt-5">
        {META.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <dt className="eyebrow text-brand-black/40">{item.label}</dt>
            <dd className="text-sm font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>

      {/* 回答のしかた */}
      <p className="text-note text-brand-black/60 mt-10 border-l-2 border-brand-turquoise pl-4">
        正解はありません。
        <br />
        「今の自分に一番近い」と思うものを選んでください。
      </p>
    </section>
  );
}
