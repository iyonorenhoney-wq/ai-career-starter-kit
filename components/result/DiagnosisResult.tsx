/**
 * 診断結果画面
 *
 * 出典: docs/01_diagnosis-spec.md §32 / docs/08_web-spec.md §52, §64
 *
 * 表示順:
 *   シェア用結果カード → MAIN TYPE → SUB TYPE → MAIN × SUB
 *   → AI活用スコア → GOAL → 強み → 最初の一歩 → LINE CTA
 *
 * 背景は「結果冒頭はダーク、詳細はホワイト」で切り替える（08 §64）。
 * このコンポーネントの責務はセクションの並び順だけで、
 * 文章の組み立ては lib/resultLabels.ts と data/ が持つ。
 */

import { CombinationSection } from "@/components/result/CombinationSection";
import { FirstActionSection } from "@/components/result/FirstActionSection";
import { GoalSection } from "@/components/result/GoalSection";
import { LineCTA } from "@/components/result/LineCTA";
import { MainTypeSection } from "@/components/result/MainTypeSection";
import { RestartButton } from "@/components/result/RestartButton";
import { ResultShareCard } from "@/components/result/ResultShareCard";
import { ScoreSection } from "@/components/result/ScoreSection";
import { StrengthSection } from "@/components/result/StrengthSection";
import { SubTypeSection } from "@/components/result/SubTypeSection";
import type { DiagnosisResult as DiagnosisResultType } from "@/types/diagnosis";

type DiagnosisResultProps = {
  result: DiagnosisResultType;
  onRestart: () => void;
};

export function DiagnosisResult({ result, onRestart }: DiagnosisResultProps) {
  return (
    <div className="flex flex-col gap-14">
      {/* 1. シェア用結果カード */}
      <section className="flex flex-col gap-4" aria-labelledby="result-card">
        <div className="flex flex-col gap-1">
          <p className="label-en text-xs text-brand-accent-blue">
            AI Work Diagnosis
          </p>
          <h1 id="result-card" className="text-h3 font-bold">
            あなたのAI仕事診断書
          </h1>
        </div>

        <ResultShareCard result={result} />

        {/* スクリーンショット案内（08 §80） */}
        <p className="bg-brand-off-white rounded-card px-5 py-4 text-sm leading-relaxed text-brand-black/75">
          このカードをスクショしておいてください。
          <br />
          あとで公式LINEへ送ると、あなた専用の攻略BOOKを受け取れます。
        </p>
      </section>

      {/* 2. MAIN TYPE */}
      <MainTypeSection result={result} />

      {/* 3. SUB TYPE */}
      <SubTypeSection result={result} />

      {/* 4. MAIN × SUB */}
      <CombinationSection result={result} />

      {/* 5. AI活用スコア */}
      <ScoreSection result={result} />

      {/* 6. GOAL */}
      <GoalSection result={result} />

      {/* 7. 強み */}
      <StrengthSection result={result} />

      {/* 8. 最初の一歩 */}
      <FirstActionSection result={result} />

      {/* 9. LINE CTA */}
      <LineCTA />

      {/* 再診断（メインCTAより下に置く：08 §142） */}
      <div className="flex flex-col items-center gap-8">
        <RestartButton onRestart={onRestart} />

        {/* 免責（01 §62） */}
        <p className="text-center text-xs leading-relaxed text-brand-black/45">
          この診断は、回答内容をもとにAI活用の方向性を整理するための
          <br className="hidden sm:block" />
          MOMOKA独自の行動提案型コンテンツです。
          <br />
          能力・適性・職業適性等を医学的・心理学的に判定するものではありません。
        </p>
      </div>
    </div>
  );
}
