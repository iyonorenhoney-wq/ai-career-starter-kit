/**
 * シェア用結果カード
 *
 * 出典:
 *   docs/01_diagnosis-spec.md §33-35
 *   docs/08_web-spec.md §53-62
 *
 * 結果画面で最も重要なコンポーネント。
 * スマホのスクリーンショット1枚で結果が伝わることを最優先にする。
 *
 * デザイン:
 *   深いNAVY / BLACK 背景 + WHITE文字 + TURQUOISEの光とライン。
 *   情報を詰め込みすぎず、MAIN / SUB / GOAL が一目で分かるようにする。
 */

import {
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

  return (
    <div className="bg-card-glow relative overflow-hidden rounded-card border border-brand-turquoise/20 px-6 py-8 text-brand-white sm:px-8 sm:py-10">
      {/* 背景の細いライン。文字を邪魔しない濃さにとどめる（08 §57） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4BD6D6 1px, transparent 1px), linear-gradient(to bottom, #4BD6D6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col gap-6">
        {/* 見出し */}
        <div className="flex items-center justify-between gap-3">
          <p className="label-en text-[11px] text-brand-turquoise">
            AI Work Diagnosis
          </p>
          <p className="text-xs text-brand-white/50">AI仕事診断書</p>
        </div>

        {/* MAIN TYPE：カードの主役として最も大きく表示する（08 §59） */}
        <div className="flex flex-col gap-1.5">
          <p className="label-en text-[10px] text-brand-white/45">Main Type</p>
          <p className="label-en text-2xl leading-tight font-bold sm:text-3xl">
            {main.englishName}
          </p>
          <p className="text-sm text-brand-white/75">{main.name}</p>
        </div>

        {/* ターコイズのライン */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-brand-turquoise/70 via-brand-turquoise/20 to-transparent"
        />

        {/* SUB TYPE と GOAL：MAINより小さく（08 §60） */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="label-en text-[10px] text-brand-white/45">Sub Type</p>
            <p className="label-en text-sm font-semibold text-brand-turquoise-light">
              {sub.englishName}
            </p>
            <p className="text-xs text-brand-white/60">{sub.name}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="label-en text-[10px] text-brand-white/45">Goal</p>
            <p className="text-sm font-semibold">{goal.name}</p>
            <p className="label-en text-xs text-brand-white/60">
              {goal.englishName}
            </p>
          </div>
        </div>

        {/* STYLE */}
        <div className="flex flex-col gap-1.5">
          <p className="label-en text-[10px] text-brand-white/45">Style</p>
          <span className="inline-flex self-start rounded-badge border border-brand-turquoise/40 bg-brand-turquoise/10 px-3 py-1">
            <span className="label-en text-[11px] font-semibold text-brand-turquoise-light">
              {styleLabel.english}
            </span>
          </span>
        </div>

        {/* ONE LINE：組み合わせを一言で表す（04_result-combinations §29） */}
        <p className="border-l-2 border-brand-turquoise/60 pl-4 text-sm leading-relaxed text-brand-white/90">
          {combination.oneLine}
        </p>

        {/* 最下部：診断IDとブランド（08 §62-63, §83） */}
        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-brand-white/10 pt-5">
          <div className="flex flex-col gap-0.5">
            <p className="label-en text-[10px] text-brand-white/40">
              Diagnosis ID
            </p>
            <p className="label-en text-xs text-brand-white/70">
              {result.resultId}
            </p>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <p className="label-en text-[10px] text-brand-turquoise">
              AI Career Starter Kit
            </p>
            <p className="text-[10px] text-brand-white/45">by MOMOKA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
