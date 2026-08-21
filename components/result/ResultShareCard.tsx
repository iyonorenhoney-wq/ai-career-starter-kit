/**
 * シェア用結果カード
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §33-35
 *   docs/08_web-spec.md §53-62
 *
 * 結果画面で最も重要なコンポーネント。
 * 「診断結果」「SNSで見せたくなるカード」「LINEへ送るカード」の3役を担う。
 *
 * 視覚階層（上から強い順）:
 *   MAIN TYPE → STYLE → GOAL → SUB TYPE → ONE LINE → Diagnosis ID
 *
 * デザイン方針:
 *   装飾を足して豪華にするのではなく、余白・文字サイズ・ウェイト・罫線で
 *   1枚の「診断書」として成立させる。375pxでのスクショを最優先。
 */

import { TypeIcon } from "@/components/ui/TypeIcon";
import {
  getBookCode,
  getCombination,
  getGoal,
  getMainType,
  getStyleLabel,
  getSubType,
} from "@/lib/resultLabels";
import type { DiagnosisResult } from "@/types/diagnosis";

type ResultShareCardProps = {
  result: DiagnosisResult;
};

export function ResultShareCard({ result }: ResultShareCardProps) {
  const main = getMainType(result);
  const sub = getSubType(result);
  const goal = getGoal(result);
  const combination = getCombination(result);
  const styleLabel = getStyleLabel(result);
  const bookCode = getBookCode(result);

  return (
    <div className="bg-card-glow relative overflow-hidden rounded-card px-7 pt-7 pb-6 text-brand-white sm:px-9 sm:pt-9">
      {/* ごく薄いグリッド。文字を邪魔しない濃さにとどめる（08 §57） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4BD6D6 1px, transparent 1px), linear-gradient(to bottom, #4BD6D6 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 上辺のターコイズライン。診断書の表紙らしさを出す */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-turquoise to-transparent"
      />

      <div className="relative">
        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-brand-white/45">AI 仕事診断書</p>
          <TypeIcon name={main.icon} className="text-brand-turquoise h-4 w-4" />
        </div>

        {/* MAIN TYPE：カードの主役 */}
        <div className="mt-7">
          <p className="eyebrow text-brand-turquoise">Main Type</p>
          <p className="label-en text-type mt-3 font-bold">
            {main.englishName}
          </p>
          <p className="text-brand-white/70 mt-2 text-sm">{main.name}</p>
        </div>

        {/* STYLE：2番目に強い情報 */}
        <div className="mt-7 border-t border-brand-turquoise/25 pt-6">
          <p className="eyebrow text-brand-white/40">Style</p>
          <p className="label-en text-brand-turquoise-light mt-2.5 text-base leading-snug font-bold sm:text-lg">
            {styleLabel.english}
          </p>
        </div>

        {/* GOAL と SUB TYPE：罫線で区切った診断書らしい2行 */}
        <dl className="mt-6 flex flex-col">
          <div className="flex items-baseline justify-between gap-4 border-t border-brand-white/10 py-3.5">
            <dt className="eyebrow text-brand-white/40">Goal</dt>
            <dd className="text-sm font-semibold">{goal.name}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-brand-white/10 py-3.5">
            <dt className="eyebrow text-brand-white/40">Sub Type</dt>
            <dd className="label-en text-brand-white/85 text-sm font-semibold">
              {sub.englishName}
            </dd>
          </div>
        </dl>

        {/* ONE LINE：組み合わせを一言で表す（04_result-combinations §29） */}
        <p className="text-brand-white/85 mt-6 border-l-2 border-brand-turquoise/70 pl-4 text-sm leading-relaxed">
          {combination.oneLine}
        </p>

        {/*
          フッター：BOOK CODE・診断ID・ブランド（08 §62-63, §83）

          BOOK CODE はどの攻略BOOKを送るかを示す管理用のコード。
          診断IDと同じ「管理情報」の区画へ置き、STYLE や SUB TYPE から
          離すことで見間違いを防ぐ。
          ターコイズを使わないことで、STYLEとは役割が違うことを色でも分ける。

          カードが縦に伸びるとスクリーンショットの下端が切れやすくなるため、
          独立した枠は設けず、フッター内の1行として収めている。
        */}
        <div className="mt-7 border-t border-brand-white/10 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="eyebrow text-brand-white/40 text-[10px]">
              Book Code
            </span>
            <span className="label-en text-brand-white text-xs font-semibold">
              {bookCode}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="label-en text-brand-white/35 text-[10px]">
              {result.resultId}
            </p>
            <div className="text-right">
              <p className="eyebrow text-brand-white/55 text-[10px]">
                AI Career Starter Kit
              </p>
              <p className="text-brand-white/35 mt-1 text-[10px]">by MOMOKA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
