/**
 * 診断結果画面
 *
 * 出典: docs/01_diagnosis-spec.md §32 / docs/08_web-spec.md §52, §64
 *
 * 表示順（STEP6で確定・変更しない）:
 *   シェア用結果カード → MAIN TYPE → SUB TYPE → MAIN × SUB
 *   → AI活用スコア → GOAL → 強み → 最初の一歩 → LINE CTA
 *
 * デザイン方針:
 *   背景色を切り替えるだけの単調な繰り返しにしないため、
 *   セクションごとに余白量と文字組みを変えてリズムを作る。
 *   ダークセクションは「見せ場」に絞り、白の余白で呼吸させる。
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
    <div className="animate-fade-up flex flex-col">
      {/* 1. シェア用結果カード ------------------------------------------- */}
      <section aria-labelledby="result-card">
        <p className="eyebrow text-brand-turquoise">Diagnosis Complete</p>
        <h1 id="result-card" className="text-h3 mt-4 font-bold">
          あなたのAI仕事診断書
        </h1>

        <div className="mt-7">
          <ResultShareCard result={result} />
        </div>

        {/* スクリーンショット案内（08 §80） */}
        <p className="text-note text-brand-black/60 mt-5 text-center">
          この診断書をスクショしておいてください。
          <br />
          あとで公式LINEへ送ると、あなた専用の攻略BOOKが届きます。
        </p>
      </section>

      {/* 2. MAIN TYPE ---------------------------------------------------- */}
      <div className="mt-20">
        <MainTypeSection result={result} />
      </div>

      {/* 3. SUB TYPE（MAINのすぐ後ろに添える） --------------------------- */}
      <div className="mt-8">
        <SubTypeSection result={result} />
      </div>

      {/* 4. MAIN × SUB（見せ場：ダーク） --------------------------------- */}
      <div className="mt-20">
        <CombinationSection result={result} />
      </div>

      {/* 5. AI活用スコア ------------------------------------------------- */}
      <div className="mt-20">
        <ScoreSection result={result} />
      </div>

      {/* 6. GOAL（短く方向性だけ） --------------------------------------- */}
      <div className="mt-16">
        <GoalSection result={result} />
      </div>

      {/* 7. 強み --------------------------------------------------------- */}
      <div className="mt-16">
        <StrengthSection result={result} />
      </div>

      {/* 8. 最初の一歩（行動の起点） ------------------------------------- */}
      <div className="mt-16">
        <FirstActionSection result={result} />
      </div>

      {/* 9. LINE CTA（最大CTA：ダーク） ---------------------------------- */}
      <div className="mt-20">
        <LineCTA />
      </div>

      {/* 再診断（メインCTAより下に置く：08 §142） */}
      <div className="mt-16 flex flex-col items-center gap-10 border-t border-brand-border pt-12">
        <RestartButton onRestart={onRestart} />

        {/* 免責（01 §62） */}
        <p className="text-brand-black/40 max-w-[34rem] text-center text-xs leading-loose">
          この診断は、回答内容をもとにAI活用の方向性を整理するためのMOMOKA独自の行動提案型コンテンツです。能力・適性・職業適性等を医学的・心理学的に判定するものではありません。
        </p>
      </div>
    </div>
  );
}
